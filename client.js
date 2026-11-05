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
      'hints.footer': 'Type hint letters to filter and click · Esc to close',
    }
    const zh = {
      'command.next': '下一个对话',
      'command.previous': '上一个对话',
      'command.jump': '跳转到对话 1-9',
      'hints.footer': '输入字母筛选并点击 · Esc 关闭',
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

    const HINT_INTERACTIVE = 'button, a[href], input:not([type="hidden"]), select, textarea, summary, [role="button"], [role="link"], [role="tab"], [role="menuitem"], [role="option"], [role="checkbox"], [role="radio"], [role="switch"], [role="treeitem"], [contenteditable="true"], [contenteditable=""]'
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
        if (element.closest('[inert]') !== null) continue
        if (element.closest('[aria-hidden="true"]') !== null) continue
        if (element.closest('[data-chat-flow]') !== null) continue
        if (isTurnRail(element)) continue
        if (element.tagName === 'BODY' || element.tagName === 'HTML') continue
        if (element.disabled === true || element.getAttribute('aria-disabled') === 'true') continue
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
        const store = createStore({ held: false, ...initial })

        const refreshOrder = () => {
          store.publish(deriveVisibleOrder(ctx.sessions.list.getSnapshot(), ctx.workspaces.list.getSnapshot()))
        }

        const hintStore = createStore({ active: false, hints: [] })

        function HintOverlay() {
          const snapshot = React.useSyncExternalStore(hintStore.subscribe, hintStore.getSnapshot)
          if (!snapshot.active) return null
          return h('div', {
            className: 'dsh-hotkey-hints',
            'data-dsh-hotkey-overlay': 'true',
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
          const number = snapshot.held ? snapshot.indexById[sessionId] : 0
          if (!number) return null
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

        // Numbers follow Control on every platform, macOS included.
        ctx.effect(() => {
          const sync = (event) => {
            if (event.ctrlKey) refreshOrder()
            store.publish({ held: event.ctrlKey })
          }
          const clear = () => store.publish({ held: false })
          const onVisibility = () => {
            if (document.visibilityState === 'hidden') clear()
          }
          window.addEventListener('keydown', sync, true)
          window.addEventListener('keyup', sync, true)
          window.addEventListener('blur', clear)
          document.addEventListener('visibilitychange', onVisibility)
          return () => {
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
            if (event.shiftKey !== true && /^Digit[1-9]$/u.test(event.code)) {
              event.preventDefault()
              event.stopPropagation()
              jump(Number(event.code.slice('Digit'.length)))
            }
          }
          window.addEventListener('keydown', onKeyDown, true)
          return () => {
            window.removeEventListener('keydown', onKeyDown, true)
          }
        }, 'dsh-hotkey: keyboard')

        ctx.slots.inject('shell.overlay', () => ctx.slots.register({
          name: 'shell.overlay',
          id: 'dsh-hotkey.hints',
          order: 100,
        }, HintOverlay))

        ctx.slots.inject('sidebar.session.row.leading', () => ctx.slots.register({
          name: 'sidebar.session.row.leading',
          id: 'dsh-hotkey.number',
          order: 20,
        }, SwitcherBadge))
      },
    }
  },
})
