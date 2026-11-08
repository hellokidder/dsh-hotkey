window.__ModuleLoader__.load({
  id: '@hellokidder/dsh-hotkey',
  factory(require) {
    const React = require('react')
    const h = React.createElement

    const NS = 'dshHotkey'
    const BADGE_CLASS = 'dsh-hotkey__number'
    const BADGE_CURRENT_CLASS = 'dsh-hotkey__number--current'
    const STYLE_ID = '@hellokidder/dsh-hotkey/badge.css'

    const en = {
      'command.next': 'Next conversation',
      'command.previous': 'Previous conversation',
      'command.jump': 'Go to conversation 1-9',
      'command.panel': 'Jump to a conversation',
      'command.focus': 'Focus message input',
      'hints.footer': 'Type hint letters to filter and click · Esc to close',
      'panel.title': 'Jump to conversation',
      'panel.placeholder': 'Type a number or a title…',
      'panel.empty': 'No matching conversation',
      'panel.current': 'Current',
      'panel.footer': '↑↓ choose · Enter open · Esc close',
      'switcher.more': 'all {count} conversations',
    }
    const zh = {
      'command.next': '下一个对话',
      'command.previous': '上一个对话',
      'command.jump': '跳转到对话 1-9',
      'command.panel': '跳转到会话',
      'command.focus': '聚焦输入框',
      'hints.footer': '输入字母筛选并点击 · Esc 关闭',
      'panel.title': '跳转会话',
      'panel.placeholder': '输入序号或标题…',
      'panel.empty': '没有匹配的会话',
      'panel.current': '当前',
      'panel.footer': '↑↓ 选择 · Enter 打开 · Esc 关闭',
      'switcher.more': '全部 {count} 个对话',
    }

    const CSS = `
.${BADGE_CLASS} {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: none;
  width: 16px;
  height: 16px;
  border: 0.5px solid var(--dsw-alias-border-l1);
  border-radius: 4px;
  background: var(--dsw-alias-bg-layer-2);
  color: var(--dsw-alias-label-secondary);
  font-size: 9px;
  font-weight: 600;
  line-height: 1;
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.02em;
  pointer-events: none;
  user-select: none;
}
.${BADGE_CURRENT_CLASS} {
  border-color: transparent;
  background: var(--dsw-alias-brand-primary);
  color: var(--dsw-alias-bg-base);
}
.dsh-hotkey-hints {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  overflow: visible;
  box-sizing: border-box;
  pointer-events: none;
  font-family: inherit;
}
.dsh-hotkey-hints__badge {
  position: fixed;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 16px;
  height: 16px;
  padding: 0 3px;
  border: 0.5px solid var(--dsw-alias-border-l1, rgba(255, 255, 255, 0.12));
  border-radius: 4px;
  background: var(--dsw-alias-bg-layer-2, #262a31);
  color: var(--dsw-alias-label-secondary, #c9cdd4);
  font-family: inherit;
  font-size: 9px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -0.02em;
  text-transform: lowercase;
  white-space: nowrap;
  pointer-events: none;
  user-select: none;
  transition: background-color 0.12s ease, color 0.12s ease, box-shadow 0.12s ease;
}
.dsh-hotkey-hints__badge--match {
  border-color: transparent;
  background: var(--dsw-alias-brand-primary, #e8eaed);
  color: var(--dsw-alias-bg-base, #15171c);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--dsw-alias-brand-primary, #e8eaed) 35%, transparent);
}
.dsh-hotkey-hints__footer {
  position: fixed;
  left: 50%;
  bottom: 14px;
  transform: translateX(-50%);
  padding: 4px 10px;
  border: 1px solid var(--dsw-alias-border-l1, #3a3f46);
  border-radius: 6px;
  background: var(--dsw-alias-bg-overlay, #1f2329);
  color: var(--dsw-alias-label-secondary, #c9cdd4);
  max-width: calc(100vw - 24px);
  overflow: hidden;
  font-size: 11px;
  line-height: 16px;
  white-space: nowrap;
  text-overflow: ellipsis;
  pointer-events: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.25);
}
.dsh-hotkey-switcher {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  max-width: none;
  max-height: none;
  margin: 0;
  padding: max(14vh, calc(var(--dsh-frame-overlay-top, 0px) + 24px)) 24px 24px;
  border: 0;
  background: transparent;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  font-family: inherit;
}
/* Same material as the Menu primitive card: translucent fill, menu blur,
   prominent elevation with the menu's l1 hairline. Semantic tokens only, so
   theme plugins repaint the palette without touching this stylesheet. */
.dsh-hotkey-switcher__dialog {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: min(520px, 100%);
  max-height: 62vh;
  padding: 4px;
  overflow: hidden;
  border: 0;
  border-radius: var(--dsw-radius-lg);
  --dsw-elevation-stroke-color: var(--dsw-alias-border-l1);
  background: var(--dsw-menu-surface-fill, var(--dsw-alias-bg-layer-2));
  backdrop-filter: var(--dsw-menu-backdrop-filter);
  box-shadow: var(--dsw-elevation-prominent);
  color: var(--dsw-alias-label-primary);
  --dsh-scrollbar-thumb: var(--dsw-alias-scrollbar-bg-l2);
  --dsh-scrollbar-thumb-hover: var(--dsw-alias-scrollbar-hover-l2);
  animation: dsh-hotkey-switcher-in var(--ds-transition-duration) var(--ds-ease-in-out);
}
@keyframes dsh-hotkey-switcher-in {
  from { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh-hotkey-switcher__dialog,
  .dsh-hotkey-switcher-hint { animation: none; }
}
.dsh-hotkey-switcher__search {
  flex: none;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 2px 0 3px;
  padding: 5px 8px;
  border-radius: var(--dsw-radius-md);
}
.dsh-hotkey-switcher__search-icon {
  display: inline-flex;
  flex: none;
  color: var(--dsw-alias-label-caption);
}
.dsh-hotkey-switcher__input {
  flex: 1 1 auto;
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--dsw-alias-label-primary);
  font-family: inherit;
  font-size: var(--dsh-content-font-size, 14px);
  line-height: 22px;
}
.dsh-hotkey-switcher__input::placeholder {
  color: var(--dsw-alias-label-caption);
}
@media (pointer: coarse) {
  .dsh-hotkey-switcher__input {
    font-size: 16px;
  }
}
.dsh-hotkey-switcher__list {
  flex: 1 1 auto;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 0;
}
.dsh-hotkey-switcher__row {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 5px 8px;
  border-radius: var(--dsw-radius-md);
  color: var(--dsw-alias-label-primary);
  font-size: 13px;
  line-height: 20px;
  cursor: pointer;
  user-select: none;
}
.dsh-hotkey-switcher__row--active {
  background: var(--dsw-alias-interactive-bg-hover);
}
/* DSH has no surface keycap: shortcut keys are plain tertiary text outside
   tooltips. The index column keeps that restraint and stays aligned with the
   search glyph above it. */
.dsh-hotkey-switcher__number {
  flex: none;
  min-width: 16px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}
.dsh-hotkey-switcher__row--active .dsh-hotkey-switcher__number {
  color: var(--dsw-alias-label-secondary);
}
.dsh-hotkey-switcher__title {
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dsh-hotkey-switcher__current {
  flex: none;
  color: var(--dsw-alias-label-caption);
  font-size: 12px;
  line-height: 18px;
}
.dsh-hotkey-switcher__empty {
  padding: 8px;
  color: var(--dsw-alias-label-tertiary);
  font-size: 12px;
  line-height: 18px;
}
.dsh-hotkey-switcher__footer {
  flex: none;
  margin-top: 2px;
  padding: 5px 8px 3px;
  border-top: 0.5px solid var(--dsw-alias-border-l2);
  color: var(--dsw-alias-label-caption);
  font-size: 11px;
  line-height: 16px;
}
.dsh-hotkey-switcher-hint {
  position: fixed;
  inset: auto;
  left: 50%;
  bottom: 14px;
  margin: 0;
  transform: translateX(-50%);
  display: inline-flex;
  align-items: center;
  width: max-content;
  max-width: min(60vw, calc(100vw - 24px));
  padding: 3px 7px;
  border: 0;
  border-radius: var(--dsw-radius-sm);
  background: var(--dsw-alias-tooltip-bg);
  color: var(--dsw-static-neutral-bluish-00);
  font-family: inherit;
  font-size: 12px;
  line-height: 18px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  pointer-events: none;
  animation: dsh-hotkey-switcher-in 150ms var(--ds-ease-in-out);
}
`

    function createStore(initial) {
      let snapshot = initial
      const listeners = new Set()
      return {
        getSnapshot: () => snapshot,
        subscribe: (listener) => {
          listeners.add(listener)
          return () => {
            listeners.delete(listener)
          }
        },
        publish(patch) {
          let changed = false
          for (const key of Object.keys(patch)) {
            if (!Object.is(snapshot[key], patch[key])) {
              changed = true
              break
            }
          }
          if (!changed) return
          snapshot = { ...snapshot, ...patch }
          for (const listener of [...listeners]) listener()
        },
      }
    }

    /** Newest first, with the Session id as a deterministic tie-break. */
    function orderByRecency(ids, byId) {
      return ids
        .map((id) => ({ id, rank: byId[id] === undefined ? 0 : byId[id].updatedAt }))
        .sort((left, right) => (left.rank !== right.rank ? right.rank - left.rank : left.id < right.id ? -1 : 1))
        .map((entry) => entry.id)
    }

    /**
     * Reproduce the sidebar's default browsing order: Workspace groups in Host
     * order, pinned rows before ordinary rows inside each group, then newest
     * first. Only rows the sidebar can show are numbered: no archived Session,
     * no subagent Session, and no blank New Session placeholder.
     */
    function deriveOrder(list, workspaceState) {
      const byId = list.byId === undefined ? {} : list.byId
      const state = workspaceState === undefined || workspaceState === null ? {} : workspaceState
      const archived = new Set(state.archivedSessionIds === undefined ? [] : state.archivedSessionIds)
      const pinned = new Set(state.pinnedSessionIds === undefined ? [] : state.pinnedSessionIds)
      const workspaces = Array.isArray(state.items) ? state.items : []
      const ids = Array.isArray(list.ids) ? list.ids : []
      const ordered = []
      const indexById = {}
      const accounted = new Set()

      const visible = (session) => session !== undefined
        && session.origin !== 'subagent'
        && session.blank !== true
        && !archived.has(session.id)

      const pushSection = (memberIds) => {
        const recency = orderByRecency(memberIds, byId)
        const section = [
          ...recency.filter((id) => pinned.has(id)),
          ...recency.filter((id) => !pinned.has(id)),
        ]
        for (const id of section) {
          if (Object.hasOwn(indexById, id)) continue
          indexById[id] = ordered.length + 1
          ordered.push(id)
        }
      }

      for (const workspace of workspaces) {
        const memberIds = Array.isArray(workspace.sessionIds) ? workspace.sessionIds : []
        const visibleIds = []
        for (const id of memberIds) {
          accounted.add(id)
          if (visible(byId[id])) visibleIds.push(id)
        }
        pushSection(visibleIds)
      }

      pushSection(ids.filter((id) => !accounted.has(id) && visible(byId[id])))

      let currentId
      for (const id of ids) {
        const session = byId[id]
        if (session !== undefined && (session.retainedBy === undefined ? 0 : session.retainedBy.mainView ?? 0) > 0) {
          currentId = id
          break
        }
      }

      return { ordered, indexById, currentId }
    }

    /** Read the Session rows the sidebar actually rendered, in visual order. */
    function readRenderedSessionIds() {
      if (typeof document === 'undefined' || typeof document.querySelectorAll !== 'function') return []
      const nodes = document.querySelectorAll('[data-row-key^="session:"]')
      const ids = []
      const seen = new Set()
      for (const node of nodes) {
        const key = node.getAttribute('data-row-key')
        if (key === null) continue
        const id = key.slice('session:'.length)
        if (id === '' || seen.has(id)) continue
        seen.add(id)
        ids.push(id)
      }
      return ids
    }

    /**
     * Prefer the rendered rows so numbering follows the user's current
     * grouping, sorting, pinning, folding and archive filter. When no row is
     * rendered (rail, search, early boot), fall back to the service order.
     */
    function deriveVisibleOrder(list, workspaceState) {
      const fallback = deriveOrder(list, workspaceState)
      const rendered = readRenderedSessionIds()
      if (rendered.length === 0) return fallback
      const state = workspaceState === undefined || workspaceState === null ? {} : workspaceState
      const archived = new Set(state.archivedSessionIds === undefined ? [] : state.archivedSessionIds)
      const byId = list.byId === undefined ? {} : list.byId
      const ordered = []
      const indexById = {}
      for (const id of rendered) {
        const session = byId[id]
        if (session === undefined) continue
        if (session.origin === 'subagent') continue
        if (session.blank === true) continue
        if (archived.has(id)) continue
        indexById[id] = ordered.length + 1
        ordered.push(id)
      }
      if (ordered.length === 0) return fallback
      return { ordered, indexById, currentId: fallback.currentId }
    }

    /**
     * Filter switcher rows: all-digit queries match the global index prefix,
     * anything else matches the title. Numbering inside the panel is global,
     * so "12" always selects the twelfth conversation even when the sidebar
     * only badges the first nine.
     */
    function filterPanelItems(items, rawQuery) {
      const query = rawQuery.trim().toLowerCase()
      if (query === '') return items
      if (/^\d{1,3}$/u.test(query)) {
        return items.filter((item) => String(item.number).startsWith(query))
      }
      return items.filter((item) => item.title.toLowerCase().includes(query))
    }

    const HINT_INTERACTIVE = 'button, a[href], input:not([type="hidden"]), select, textarea, summary, [data-composer-input], [data-lexical-editor="true"], [role="button"], [role="link"], [role="tab"], [role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"], [role="option"], [role="checkbox"], [role="radio"], [role="switch"], [role="treeitem"], [role="textbox"], [role="searchbox"], [contenteditable]:not([contenteditable="false"])'
    const HINT_LIMIT = 80
    const HINT_GENERIC_LABELS = new Set(['close', 'more', 'copy', 'send', 'stop', 'ok', 'cancel', 'back', 'next', 'previous', 'delete', 'rename'])
    const HINT_NATIVE_TAGS = new Set(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA', 'SUMMARY'])
    // Native shortcut labels are intentionally hidden for now; flip this to
    // true to surface the registered key next to the generated letter again.
    const SHOW_NATIVE_SHORTCUTS = false

    function normalizeHintLabel(value) {
      if (typeof value !== 'string') return ''
      return value
        .toLowerCase()
        .replace(/[\s\u00a0]+/gu, ' ')
        .replace(/[.。,，:：;；!！?？…]+$/gu, '')
        .trim()
    }

    function readElementNames(element) {
      const names = []
      const add = (value) => {
        const normalized = normalizeHintLabel(value)
        if (normalized !== '' && !names.includes(normalized)) names.push(normalized)
      }
      add(element.getAttribute('aria-label'))
      const labelledBy = element.getAttribute('aria-labelledby')
      if (labelledBy !== null && typeof document !== 'undefined') {
        for (const id of labelledBy.split(/\s+/u)) {
          if (id === '') continue
          add(document.getElementById(id)?.textContent)
        }
      }
      add(element.getAttribute('title'))
      add(element.getAttribute('placeholder'))
      if (element.tagName === 'IMG') add(element.getAttribute('alt'))
      if (names.length === 0) add((element.textContent ?? '').slice(0, 80))
      return names
    }

    function buildShortcutIndex(catalog, fixedCatalog) {
      const index = []
      for (const row of catalog) {
        if (row.binding === null || !Array.isArray(row.keys) || row.keys.length === 0) continue
        if (row.issue !== null && row.issue !== undefined) continue
        if (Array.isArray(row.conflicts) && row.conflicts.length > 0) continue
        const labels = [row.label, ...(Array.isArray(row.aliases) ? row.aliases : [])]
          .map(normalizeHintLabel)
          .filter((label) => label !== '')
        if (labels.length === 0) continue
        index.push({ labels, keys: row.keys.join(' ') })
      }
      for (const row of fixedCatalog) {
        if (!Array.isArray(row.keys) || row.keys.length === 0) continue
        const label = normalizeHintLabel(row.label)
        if (label === '') continue
        index.push({ labels: [label], keys: row.keys.join(' ') })
      }
      return index
    }

    function matchShortcut(index, names) {
      for (const name of names) {
        if (name.length < 4 || HINT_GENERIC_LABELS.has(name)) continue
        for (const row of index) {
          if (row.labels.includes(name)) return row
        }
      }
      return undefined
    }

    function assignHintCodes(count) {
      const codes = []
      for (let position = 0; position < count; position++) {
        codes.push(String.fromCharCode(97 + (position % 26)) + String.fromCharCode(97 + Math.floor(position / 26)))
      }
      return codes
    }

    /**
     * The transcript's turn-navigation minimap is a narrow nav stacked with
     * `data-index` mark buttons. Its marks are far too dense for hints.
     */
    function isTurnRail(element) {
      const nav = element.closest('nav')
      if (nav === null || nav.getAttribute('aria-label') === null) return false
      if (typeof nav.getBoundingClientRect !== 'function' || typeof nav.querySelectorAll !== 'function') return false
      if (nav.getBoundingClientRect().width > 80) return false
      return nav.querySelectorAll('button[data-index]').length >= 2
    }

    /** The visible composer editor, preferring the largest rendered one. */
    function findComposer() {
      if (typeof document === 'undefined' || typeof document.querySelectorAll !== 'function') return null
      const nodes = document.querySelectorAll('[data-composer-input], [data-lexical-editor="true"][contenteditable]:not([contenteditable="false"]), [role="textbox"][aria-multiline="true"]')
      let best = null
      let bestArea = 0
      for (const node of nodes) {
        if (typeof node.getBoundingClientRect !== 'function') continue
        const rect = node.getBoundingClientRect()
        if (rect.width < 20 || rect.height < 10) continue
        if (typeof node.checkVisibility === 'function') {
          try {
            if (!node.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue
          } catch (_ignored) {}
        }
        const area = rect.width * rect.height
        if (area > bestArea) {
          best = node
          bestArea = area
        }
      }
      return best
    }

    /**
     * Promote the hint layer to the browser's top layer so its badges stay
     * above portaled menus and popovers.
     */
    function showHintPopover(node) {
      if (node === null || node === undefined) return
      try {
        node.setAttribute('popover', 'manual')
        if (typeof node.showPopover === 'function') node.showPopover()
      } catch (_ignored) {}
    }

    function collectHintCandidates(shortcutIndex) {
      if (typeof document === 'undefined' || typeof document.querySelectorAll !== 'function') return []
      if (typeof window === 'undefined') return []
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const candidates = []
      const seen = new Set()
      for (const element of document.querySelectorAll(HINT_INTERACTIVE)) {
        if (seen.has(element)) continue
        seen.add(element)
        if (typeof element.getBoundingClientRect !== 'function'
          || typeof element.getAttribute !== 'function'
          || typeof element.matches !== 'function'
          || typeof element.closest !== 'function') continue
        if (element.matches('[data-row-key^="session:"]')) continue
        if (element.closest('[data-dsh-hotkey-overlay]') !== null) continue
        if (isTurnRail(element)) continue
        // Menu and listbox portals can sit under an aria-hidden/inert app shell
        // while still being the visible interactive layer.
        const inMenu = element.closest('[role="menu"], [role="listbox"]') !== null
        const menuItem = element.matches('[role="menuitem"], [role="menuitemradio"], [role="menuitemcheckbox"], [role="option"]')
        if (!inMenu && !menuItem && element.closest('[inert]') !== null) continue
        if (!inMenu && !menuItem && element.closest('[aria-hidden="true"]') !== null) continue
        if (element.tagName === 'BODY' || element.tagName === 'HTML') continue
        if (element.disabled === true || element.getAttribute('aria-disabled') === 'true') continue
        if (typeof element.checkVisibility === 'function') {
          try {
            if (!element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true })) continue
          } catch (_ignored) {}
        }
        if (typeof window.getComputedStyle === 'function') {
          const style = window.getComputedStyle(element)
          if (style.display === 'none' || style.visibility === 'hidden' || style.visibility === 'collapse') continue
          if (Number(style.opacity) === 0) continue
          if (style.pointerEvents === 'none' && element.tabIndex < 0) continue
        }
        const rect = element.getBoundingClientRect()
        if (rect.width < 2 || rect.height < 2) continue
        if (rect.bottom < 0 || rect.right < 0 || rect.top > viewportHeight || rect.left > viewportWidth) continue
        if (!HINT_NATIVE_TAGS.has(element.tagName)
          && rect.width * rect.height > viewportWidth * viewportHeight * 0.2) continue
        const shortcut = shortcutIndex === null || shortcutIndex === undefined
          ? undefined
          : matchShortcut(shortcutIndex, readElementNames(element))
        candidates.push({
          element,
          left: rect.left,
          top: rect.top,
          keys: shortcut === undefined ? '' : shortcut.keys,
        })
      }
      candidates.sort((left, right) => (left.top !== right.top ? left.top - right.top : left.left - right.left))
      return candidates.slice(0, HINT_LIMIT)
    }

    return {
      inject: ['slots', 'locale', 'shortcuts', 'sessions', 'workspaces', 'uiWorkspace'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { en, zh }), 'dsh-hotkey: dictionaries')
        const t = ctx.locale.bind(NS)

        const initial = deriveVisibleOrder(ctx.sessions.list.getSnapshot(), ctx.workspaces.list.getSnapshot())
        const store = createStore({ held: false, hintVisible: false, total: 0, ...initial })

        const refreshOrder = () => {
          store.publish(deriveVisibleOrder(ctx.sessions.list.getSnapshot(), ctx.workspaces.list.getSnapshot()))
        }

        const hintStore = createStore({ active: false, hints: [] })
        const panelStore = createStore({ open: false, items: [], query: '', active: 0 })
        let panelOpen = false
        let restoreFocus

        // Platform-aware label for the switcher chord: ⌃J on macOS, Ctrl+J elsewhere.
        const panelKeyLabel = ctx.shortcuts.describeBinding({ code: 'KeyJ', modifiers: ['control'] }).keys.join('')

        function HintOverlay() {
          const snapshot = React.useSyncExternalStore(hintStore.subscribe, hintStore.getSnapshot)
          if (!snapshot.active) return null
          return h('div', {
            className: 'dsh-hotkey-hints',
            'data-dsh-hotkey-overlay': 'true',
            ref: showHintPopover,
          },
            h('div', { className: 'dsh-hotkey-hints__footer' }, t('hints.footer')),
            snapshot.hints.map((hint) => h('div', {
              key: `badge-${hint.code}`,
              className: hint.matched
                ? 'dsh-hotkey-hints__badge dsh-hotkey-hints__badge--match'
                : 'dsh-hotkey-hints__badge',
              style: { left: hint.left + 4, top: hint.top + 4 },
            }, hint.code)),
          )
        }

        function SwitcherBadge({ sessionId }) {
          const snapshot = React.useSyncExternalStore(store.subscribe, store.getSnapshot)
          // Only the first nine rows are reachable with Control+1…9; rows past
          // nine carry no badge, so a visible number always means a live chord.
          // Everything else is reachable through the Control+J switcher.
          const number = snapshot.held ? snapshot.indexById[sessionId] : 0
          if (!number || number > 9) return null
          return h('span', {
            className: snapshot.currentId === sessionId
              ? `${BADGE_CLASS} ${BADGE_CURRENT_CLASS}`
              : BADGE_CLASS,
            'aria-hidden': 'true',
          }, String(number))
        }

        ctx.effect(() => {
          const style = document.createElement('style')
          style.setAttribute('data-plugin-css', STYLE_ID)
          style.textContent = CSS
          document.head.appendChild(style)
          return () => {
            style.remove()
          }
        }, 'dsh-hotkey: badge styles')

        ctx.effect(() => {
          const offSessions = ctx.sessions.list.subscribe(refreshOrder)
          const offWorkspaces = ctx.workspaces.list.subscribe(refreshOrder)
          refreshOrder()
          return () => {
            offSessions()
            offWorkspaces()
          }
        }, 'dsh-hotkey: switch order')

        // Numbers follow Control on every platform, macOS included. Holding
        // Control for a moment past nine conversations surfaces the switcher
        // entry point; a quick Control+C does not flash it.
        ctx.effect(() => {
          const HINT_DELAY_MS = 320
          let hintTimer
          const clearHint = () => {
            if (hintTimer !== undefined) {
              clearTimeout(hintTimer)
              hintTimer = undefined
            }
            store.publish({ hintVisible: false })
          }
          const sync = (event) => {
            if (panelOpen) {
              store.publish({ held: false })
              return
            }
            if (event.ctrlKey) refreshOrder()
            store.publish({ held: event.ctrlKey })
            if (!event.ctrlKey) {
              clearHint()
              return
            }
            if (event.type === 'keydown' && hintTimer === undefined) {
              hintTimer = setTimeout(() => {
                hintTimer = undefined
                if (panelOpen) return
                const total = buildPanelItems().length
                store.publish({ hintVisible: total > 9, total })
              }, HINT_DELAY_MS)
            }
          }
          const clear = () => {
            clearHint()
            store.publish({ held: false })
          }
          const onVisibility = () => {
            if (document.visibilityState === 'hidden') clear()
          }
          window.addEventListener('keydown', sync, true)
          window.addEventListener('keyup', sync, true)
          window.addEventListener('blur', clear)
          document.addEventListener('visibilitychange', onVisibility)
          return () => {
            clearHint()
            window.removeEventListener('keydown', sync, true)
            window.removeEventListener('keyup', sync, true)
            window.removeEventListener('blur', clear)
            document.removeEventListener('visibilitychange', onVisibility)
          }
        }, 'dsh-hotkey: modifier state')

        // Double-tap Option (Alt) to toggle the clickable-control hint layer.
        // Control stays reserved for conversation numbering and rotation.
        ctx.effect(() => {
          const DOUBLE_TAP_MS = 350
          let active = false
          let lastAltUp = 0
          let altClean = true
          let frame
          let buffer = ''
          let entries = []

          const close = () => {
            if (frame !== undefined) frame = undefined
            buffer = ''
            entries = []
            if (active) {
              active = false
              hintStore.publish({ active: false, hints: [] })
            }
          }

          const open = () => {
            const index = SHOW_NATIVE_SHORTCUTS
              ? buildShortcutIndex(
                ctx.shortcuts.catalog.getSnapshot(),
                ctx.shortcuts.fixedCatalog.getSnapshot(),
              )
              : null
            const candidates = collectHintCandidates(index)
            if (candidates.length === 0) {
              if (active) close()
              return
            }
            const codes = assignHintCodes(candidates.length)
            entries = candidates.map((candidate, position) => ({
              element: candidate.element,
              code: codes[position],
              keys: candidate.keys,
              left: candidate.left,
              top: candidate.top,
            }))
            buffer = ''
            active = true
            hintStore.publish({
              active: true,
              hints: entries.map(({ element, ...hint }) => ({ ...hint, matched: false })),
            })
          }

          const toggle = () => {
            if (active) close()
            else open()
          }

          const clickTarget = (element) => {
            try {
              element.click()
            } catch (_error) {
              try {
                element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }))
              } catch (_ignored) {}
            }
          }

          const handleHintKey = (letter) => {
            buffer += letter
            const matches = entries.filter((entry) => entry.code.startsWith(buffer))
            if (matches.length === 0) {
              close()
              return
            }
            const exact = matches.find((entry) => entry.code === buffer)
            if (exact !== undefined) {
              const element = exact.element
              buffer = ''
              close()
              clickTarget(element)
              return
            }
            hintStore.publish({
              active: true,
              hints: matches.map(({ element, ...hint }) => ({ ...hint, matched: true })),
            })
          }

          const onKeyDown = (event) => {
            if (event.repeat) return
            // The session switcher is its own input owner.
            if (panelOpen) return
            const altEnter = event.code === 'Enter' && event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey
            if (altEnter) {
              const composer = findComposer()
              const layout = ctx.get('layout')
              if (composer !== null && document.activeElement === composer) return
              if (composer === null && layout === undefined) return
              event.preventDefault()
              event.stopPropagation()
              if (active) close()
              const focusComposer = () => {
                const target = findComposer()
                if (target !== null) target.focus({ preventScroll: true })
              }
              if (layout !== undefined) {
                try {
                  layout.selectPanel(null)
                } catch (_ignored) {}
                if (typeof requestAnimationFrame === 'function') requestAnimationFrame(focusComposer)
                else setTimeout(focusComposer, 0)
              } else {
                focusComposer()
              }
              return
            }
            const alt = event.code === 'AltLeft' || event.code === 'AltRight'
            if (alt) {
              if (event.ctrlKey || event.metaKey || event.shiftKey) return
              const now = Date.now()
              if (altClean && lastAltUp !== 0 && now - lastAltUp <= DOUBLE_TAP_MS) {
                lastAltUp = 0
                altClean = false
                toggle()
              }
              return
            }
            if (/^(Control|Shift|Meta)(Left|Right)$/u.test(event.code)) return
            altClean = false
            lastAltUp = 0
            if (!active) return
            // Any other chord closes the layer and proceeds; Control keeps
            // driving conversation rotation.
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) {
              close()
              return
            }
            if (event.code === 'Escape') {
              event.preventDefault()
              event.stopPropagation()
              close()
              return
            }
            if (event.code === 'Backspace' && buffer !== '') {
              event.preventDefault()
              event.stopPropagation()
              buffer = buffer.slice(0, -1)
              const matches = entries.filter((entry) => entry.code.startsWith(buffer))
              if (matches.length === 0) close()
              else {
                hintStore.publish({
                  active: true,
                  hints: matches.map(({ element, ...hint }) => ({ ...hint, matched: buffer !== '' })),
                })
              }
              return
            }
            if (/^Key[A-Z]$/u.test(event.code)) {
              event.preventDefault()
              event.stopPropagation()
              handleHintKey(event.code.slice(3).toLowerCase())
              return
            }
            close()
          }

          const onKeyUp = (event) => {
            if (event.code !== 'AltLeft' && event.code !== 'AltRight') return
            lastAltUp = Date.now()
            altClean = true
          }

          const onViewport = () => {
            if (!active || frame !== undefined) return
            const run = () => {
              frame = undefined
              if (active) open()
            }
            frame = typeof requestAnimationFrame === 'function'
              ? requestAnimationFrame(run)
              : setTimeout(run, 16)
          }

          const onPointerDown = () => close()
          const onBlur = () => close()
          const onVisibility = () => {
            if (document.visibilityState === 'hidden') close()
          }

          window.addEventListener('keydown', onKeyDown, true)
          window.addEventListener('keyup', onKeyUp, true)
          window.addEventListener('blur', onBlur)
          window.addEventListener('pointerdown', onPointerDown, true)
          window.addEventListener('scroll', onViewport, true)
          window.addEventListener('resize', onViewport)
          document.addEventListener('visibilitychange', onVisibility)
          return () => {
            close()
            window.removeEventListener('keydown', onKeyDown, true)
            window.removeEventListener('keyup', onKeyUp, true)
            window.removeEventListener('blur', onBlur)
            window.removeEventListener('pointerdown', onPointerDown, true)
            window.removeEventListener('scroll', onViewport, true)
            window.removeEventListener('resize', onViewport)
            document.removeEventListener('visibilitychange', onVisibility)
          }
        }, 'dsh-hotkey: hint overlay')

        const activate = (sessionId) => {
          if (sessionId !== undefined) ctx.uiWorkspace.openSession(sessionId)
        }

        const step = (delta) => {
          const { ordered, currentId } = store.getSnapshot()
          if (ordered.length === 0) return
          const at = currentId === undefined ? -1 : ordered.indexOf(currentId)
          const target = at === -1
            ? (delta > 0 ? 0 : ordered.length - 1)
            : (at + delta + ordered.length) % ordered.length
          const nextId = ordered[target]
          if (nextId !== currentId) activate(nextId)
        }

        const jump = (number) => {
          const { ordered, currentId } = store.getSnapshot()
          const target = ordered[number - 1]
          if (target !== undefined && target !== currentId) activate(target)
        }

        // ---- Conversation switcher (Control+J) -------------------------------
        // Rendered rows keep their badge numbers; rows the sidebar folded away
        // (or never rendered) are appended after them, so panel number 1..k is
        // always identical to the badge on screen.

        const buildPanelItems = () => {
          const list = ctx.sessions.list.getSnapshot()
          const workspaceState = ctx.workspaces.list.getSnapshot()
          const rendered = deriveVisibleOrder(list, workspaceState).ordered
          const fallback = deriveOrder(list, workspaceState)
          const byId = list.byId === undefined ? {} : list.byId
          const seen = new Set()
          const items = []
          for (const id of [...rendered, ...fallback.ordered]) {
            if (seen.has(id)) continue
            seen.add(id)
            const session = byId[id]
            if (session === undefined) continue
            const title = typeof session.displayTitle === 'string' && session.displayTitle !== ''
              ? session.displayTitle
              : String(id)
            items.push({ id, number: items.length + 1, title, current: id === fallback.currentId })
          }
          return items
        }

        const openPanel = () => {
          if (panelOpen) return
          const items = buildPanelItems()
          if (items.length === 0) return
          const active = document.activeElement
          restoreFocus = active !== null && active !== undefined && active !== document.body
            && typeof active.focus === 'function'
            ? active
            : undefined
          panelOpen = true
          store.publish({ held: false, hintVisible: false })
          panelStore.publish({ open: true, items, query: '', active: 0 })
        }

        const closePanel = (restore = true) => {
          if (!panelOpen) return
          panelOpen = false
          panelStore.publish({ open: false, items: [], query: '', active: 0 })
          const target = restoreFocus
          restoreFocus = undefined
          if (!restore || target === undefined) return
          try {
            target.focus({ preventScroll: true })
          } catch (_ignored) {}
        }

        const panelSelection = () => {
          const snapshot = panelStore.getSnapshot()
          if (!snapshot.open) return undefined
          const items = filterPanelItems(snapshot.items, snapshot.query)
          if (items.length === 0) return undefined
          const active = Math.min(Math.max(snapshot.active, 0), items.length - 1)
          return { items, active, item: items[active] }
        }

        const movePanelActive = (delta) => {
          const selection = panelSelection()
          if (selection === undefined) return
          const count = selection.items.length
          panelStore.publish({ active: (selection.active + delta + count) % count })
        }

        const openPanelSelection = () => {
          const selection = panelSelection()
          if (selection === undefined) return
          const target = selection.item.id
          closePanel(false)
          activate(target)
        }

        function SwitcherPanel() {
          const snapshot = React.useSyncExternalStore(panelStore.subscribe, panelStore.getSnapshot)
          const inputRef = React.useRef(null)
          const activeRef = React.useRef(null)
          React.useEffect(() => {
            if (!snapshot.open) return
            const input = inputRef.current
            if (input === null || input === undefined) return
            try {
              input.focus({ preventScroll: true })
            } catch (_ignored) {}
          }, [snapshot.open])
          React.useEffect(() => {
            const node = activeRef.current
            if (node === null || node === undefined || typeof node.scrollIntoView !== 'function') return
            try {
              node.scrollIntoView({ block: 'nearest' })
            } catch (_ignored) {}
          }, [snapshot.active, snapshot.query])
          if (!snapshot.open) return null
          const items = filterPanelItems(snapshot.items, snapshot.query)
          const active = Math.min(Math.max(snapshot.active, 0), Math.max(0, items.length - 1))
          const updateQuery = (value) => panelStore.publish({ query: value, active: 0 })
          return h('div', {
            className: 'dsh-hotkey-switcher',
            'data-dsh-hotkey-overlay': 'true',
            ref: showHintPopover,
            onPointerDown: (event) => {
              if (event.target === event.currentTarget) closePanel()
            },
          },
            h('div', {
              className: 'dsh-hotkey-switcher__dialog',
              role: 'dialog',
              'aria-modal': 'true',
              'aria-label': t('panel.title'),
              // Menu material hook: the theme's dark-mode stroke override and
              // any theme plugin restyle key off the same attribute.
              'data-menu-material': 'translucent',
            },
              h('div', { className: 'dsh-hotkey-switcher__search' },
                h('span', { className: 'dsh-hotkey-switcher__search-icon', 'aria-hidden': 'true' },
                  h('svg', {
                    viewBox: '0 0 16 16',
                    width: 16,
                    height: 16,
                    fill: 'none',
                    stroke: 'currentColor',
                    strokeWidth: 1.4,
                    strokeLinecap: 'round',
                  },
                    h('circle', { cx: 7, cy: 7, r: 4.4 }),
                    h('path', { d: 'M10.4 10.4 13.4 13.4' }),
                  ),
                ),
                h('input', {
                  ref: inputRef,
                  className: 'dsh-hotkey-switcher__input',
                  type: 'text',
                  value: snapshot.query,
                  placeholder: t('panel.placeholder'),
                  spellCheck: false,
                  autoComplete: 'off',
                  'aria-label': t('panel.title'),
                  onChange: (event) => updateQuery(event.target.value),
                }),
              ),
              h('div', { className: 'dsh-hotkey-switcher__list', role: 'listbox' },
                items.map((item, position) => h('div', {
                  key: item.id,
                  ref: position === active ? activeRef : undefined,
                  role: 'option',
                  'aria-selected': position === active,
                  className: position === active
                    ? 'dsh-hotkey-switcher__row dsh-hotkey-switcher__row--active'
                    : 'dsh-hotkey-switcher__row',
                  onMouseDown: (event) => {
                    event.preventDefault()
                    closePanel(false)
                    activate(item.id)
                  },
                  onMouseEnter: () => {
                    if (position !== active) panelStore.publish({ active: position })
                  },
                },
                  h('span', { className: 'dsh-hotkey-switcher__number' }, String(item.number)),
                  h('span', { className: 'dsh-hotkey-switcher__title' }, item.title),
                  item.current === true
                    ? h('span', { className: 'dsh-hotkey-switcher__current' }, t('panel.current'))
                    : null,
                )),
                items.length === 0
                  ? h('div', { className: 'dsh-hotkey-switcher__empty' }, t('panel.empty'))
                  : null,
              ),
              h('div', { className: 'dsh-hotkey-switcher__footer' }, t('panel.footer')),
            ),
          )
        }

        function SwitcherHint() {
          const snapshot = React.useSyncExternalStore(store.subscribe, store.getSnapshot)
          if (!snapshot.hintVisible || snapshot.total <= 9) return null
          return h('div', {
            className: 'dsh-hotkey-switcher-hint',
            'data-dsh-hotkey-overlay': 'true',
            ref: showHintPopover,
          }, `${panelKeyLabel} · ${t('switcher.more', { count: snapshot.total })}`)
        }

        ctx.effect(() => {
          const nextBinding = { code: 'Tab', modifiers: ['control'] }
          const previousBinding = { code: 'Tab', modifiers: ['control', 'shift'] }
          const jumpBindings = []
          for (let number = 1; number <= 9; number++) {
            jumpBindings.push({ code: `Digit${number}`, modifiers: ['control'] })
          }
          const jumpKeys = ctx.shortcuts.describeBinding({ code: 'Digit1', modifiers: ['control'] }).keys
          const disposers = [
            ctx.shortcuts.registerFixed({
              id: 'dsh-hotkey.next',
              label: () => t('command.next'),
              keys: ctx.shortcuts.describeBinding(nextBinding).keys,
              bindings: [nextBinding],
              group: 'application',
            }),
            ctx.shortcuts.registerFixed({
              id: 'dsh-hotkey.previous',
              label: () => t('command.previous'),
              keys: ctx.shortcuts.describeBinding(previousBinding).keys,
              bindings: [previousBinding],
              group: 'application',
            }),
            ctx.shortcuts.registerFixed({
              id: 'dsh-hotkey.jump',
              label: () => t('command.jump'),
              keys: [...jumpKeys.slice(0, -1), '1-9'],
              bindings: jumpBindings,
              group: 'application',
            }),
            ctx.shortcuts.registerFixed({
              id: 'dsh-hotkey.panel',
              label: () => t('command.panel'),
              keys: ctx.shortcuts.describeBinding({ code: 'KeyJ', modifiers: ['control'] }).keys,
              bindings: [{ code: 'KeyJ', modifiers: ['control'] }],
              group: 'application',
            }),
            ctx.shortcuts.registerFixed({
              id: 'dsh-hotkey.focus',
              label: () => t('command.focus'),
              keys: ctx.shortcuts.describeBinding({ code: 'Enter', modifiers: ['alt'] }).keys,
              bindings: [{ code: 'Enter', modifiers: ['alt'] }],
              group: 'application',
            }),
          ]
          return () => {
            for (const dispose of disposers) dispose()
          }
        }, 'dsh-hotkey: fixed shortcuts')

        // Capture phase: own the combination before editors, terminals, and
        // modal controls can stop its propagation. The fixed registrations above
        // reserve the Control chords and keep them visible in the Keyboard
        // Shortcuts reference; Command+N stays with New Session.
        ctx.effect(() => {
          const onKeyDown = (event) => {
            if (event.defaultPrevented || event.repeat) return
            if (panelOpen) {
              // The input owns text and IME composition; the panel owns
              // navigation, commit, and close.
              if (event.isComposing === true) return
              const command = event.ctrlKey === true && event.metaKey !== true && event.altKey !== true
              if (event.code === 'Escape') {
                event.preventDefault()
                event.stopPropagation()
                closePanel()
                return
              }
              if (command && event.code === 'KeyJ') {
                event.preventDefault()
                event.stopPropagation()
                closePanel()
                return
              }
              if (command && event.code === 'Tab') {
                event.preventDefault()
                event.stopPropagation()
                closePanel()
                step(event.shiftKey === true ? -1 : 1)
                return
              }
              if (event.code === 'ArrowDown' || event.code === 'ArrowUp') {
                event.preventDefault()
                event.stopPropagation()
                movePanelActive(event.code === 'ArrowDown' ? 1 : -1)
                return
              }
              if (event.code === 'Tab') {
                // Keep focus in the input; Tab walks the results instead of
                // escaping behind the scrim.
                event.preventDefault()
                event.stopPropagation()
                movePanelActive(event.shiftKey === true ? -1 : 1)
                return
              }
              if (event.code === 'Enter' && event.ctrlKey !== true && event.metaKey !== true && event.shiftKey !== true) {
                event.preventDefault()
                event.stopPropagation()
                openPanelSelection()
              }
              return
            }
            // Do not consult isComposing/keyCode 229 here: Chinese IMEs report
            // Shift as a composition key, which would swallow Control+Shift+Tab.
            // A Control chord is a command, not text input.
            const primary = event.ctrlKey === true && event.metaKey !== true
            if (!primary || event.altKey === true) return
            if (event.code === 'Tab') {
              event.preventDefault()
              event.stopPropagation()
              step(event.shiftKey === true ? -1 : 1)
              return
            }
            if (event.code === 'KeyJ' && event.shiftKey !== true) {
              event.preventDefault()
              event.stopPropagation()
              openPanel()
              return
            }
            if (event.shiftKey !== true && /^Digit[1-9]$/u.test(event.code)) {
              event.preventDefault()
              event.stopPropagation()
              jump(Number(event.code.slice('Digit'.length)))
            }
          }
          const onBlur = () => {
            if (panelOpen) closePanel(false)
          }
          window.addEventListener('keydown', onKeyDown, true)
          window.addEventListener('blur', onBlur)
          return () => {
            window.removeEventListener('keydown', onKeyDown, true)
            window.removeEventListener('blur', onBlur)
          }
        }, 'dsh-hotkey: keyboard')

        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay',
          id: 'dsh-hotkey.hints',
          order: 100,
        }, HintOverlay))

        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay',
          id: 'dsh-hotkey.switcher',
          order: 110,
        }, SwitcherPanel))

        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay',
          id: 'dsh-hotkey.switcher-hint',
          order: 120,
        }, SwitcherHint))

        ctx.slots.inject('sidebar.session.row.leading', () => ctx.slots.register({
          name: 'sidebar.session.row.leading',
          id: 'dsh-hotkey.number',
          order: 20,
        }, SwitcherBadge))
      },
    }
  },
})
