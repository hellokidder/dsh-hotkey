#!/usr/bin/env node
/**
 * Generate the DSH plugin-market index (format 1) for this package.
 *
 * DSH does not crawl npm. The Discover tab reads a static index from a URL the
 * user adds, so this script keeps that index in sync with published versions.
 * Run it after npm propagation; the release workflow retries until the version
 * appears in the registry.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(dirname(fileURLToPath(import.meta.url)))
const packageJson = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
const version = packageJson.version
const registry = 'https://registry.npmjs.org'
const packageUrl = `${registry}/${encodeURIComponent(packageJson.name)}`
const indexPath = join(root, 'market', 'index.json')
const indexUrl = 'https://raw.githubusercontent.com/hellokidder/dsh-hotkey/main/market/index.json'
const repoUrl = 'https://github.com/hellokidder/dsh-hotkey'
const iconUrl = 'https://raw.githubusercontent.com/hellokidder/dsh-hotkey/main/icon.svg'

function seconds(value, fallback) {
  const parsed = Date.parse(value)
  return Number.isFinite(parsed) ? Math.floor(parsed / 1000) : fallback
}

async function fetchPackument() {
  let lastError
  for (let attempt = 1; attempt <= 24; attempt++) {
    try {
      const response = await fetch(packageUrl, {
        headers: { accept: 'application/json', 'user-agent': 'dsh-hotkey-market-index' },
      })
      if (!response.ok) throw new Error(`registry returned ${response.status}`)
      const document = await response.json()
      if (document.versions?.[version] === undefined) {
        throw new Error(`${packageJson.name}@${version} is not in the registry yet`)
      }
      return document
    } catch (error) {
      lastError = error
      if (attempt < 24) await new Promise((resolve) => setTimeout(resolve, 5000))
    }
  }
  throw lastError
}

const packument = await fetchPackument()
const now = Math.floor(Date.now() / 1000)
const published = Object.keys(packument.versions ?? {})
  .filter((candidate) => packument.time?.[candidate] !== undefined)
  .map((candidate) => ({
    version: candidate,
    publishTimestamp: seconds(packument.time[candidate], now),
    source: { type: 'npm' },
  }))
  .sort((left, right) => right.publishTimestamp - left.publishTimestamp)

const index = {
  format: 1,
  title: { en: 'DSH Hotkey', zh: 'DSH 快捷键' },
  description: {
    en: 'Keyboard-first DSH: Control conversation numbering and cycling, double-Option letter hints, Option+Enter composer focus.',
    zh: '键盘流 DSH：Control 显示对话编号并轮转，双击 Option 显示字母提示，Option+Enter 聚焦输入框。',
  },
  metadata: {
    categories: {
      productivity: { title: { en: 'Productivity', zh: '效率' } },
      navigation: { title: { en: 'Navigation', zh: '导航' } },
    },
    labels: {
      keyboard: { title: { en: 'Keyboard', zh: '键盘' } },
      hints: { title: { en: 'Hints', zh: '提示' } },
      sessions: { title: { en: 'Sessions', zh: '会话' } },
    },
  },
  plugins: [
    {
      name: packageJson.name,
      title: { en: 'DSH Hotkey', zh: 'DSH 快捷键' },
      description: {
        en: 'Hold Control to number conversations, Control+Tab to cycle, double-tap Option for letter hints on clickable controls, and Option+Enter to focus the composer.',
        zh: '按住 Control 显示对话编号、Control+Tab 轮转；双击 Option 为可点击控件显示字母提示；Option+Enter 聚焦输入框。',
      },
      icon: iconUrl,
      author: 'hellokidder',
      homepage: repoUrl,
      repository: { url: repoUrl },
      metadata: {
        category: 'productivity',
        labels: ['keyboard', 'hints', 'sessions'],
        keywords: [
          ...new Set([
            ...(packageJson.keywords ?? []),
            'vimium',
            'clickable-hints',
            'composer-focus',
            'productivity',
            'macos',
          ]),
        ],
      },
      versions: published,
    },
  ],
}

await mkdir(dirname(indexPath), { recursive: true })
await writeFile(indexPath, `${JSON.stringify(index, null, 2)}\n`)
console.log(`wrote ${indexPath}`)
console.log(`${packageJson.name}@${version} with ${published.length} version(s) from ${indexUrl}`)
