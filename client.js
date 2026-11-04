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
    }
    const zh = {
      'command.next': '下一个对话',
      'command.previous': '上一个对话',
      'command.jump': '跳转到对话 1-9',
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

    return {
      inject: ['slots', 'locale', 'shortcuts', 'sessions', 'workspaces', 'uiWorkspace'],
      apply(ctx) {
        ctx.effect(() => ctx.locale.register(NS, { en, zh }), 'dsh-hotkey: dictionaries')
        const t = ctx.locale.bind(NS)

        const initial = deriveOrder(ctx.sessions.list.getSnapshot(), ctx.workspaces.list.getSnapshot())
        const store = createStore({ held: false, ...initial })

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
          const rebuild = () => {
            store.publish(deriveOrder(ctx.sessions.list.getSnapshot(), ctx.workspaces.list.getSnapshot()))
          }
          const offSessions = ctx.sessions.list.subscribe(rebuild)
          const offWorkspaces = ctx.workspaces.list.subscribe(rebuild)
          rebuild()
          return () => {
            offSessions()
            offWorkspaces()
          }
        }, 'dsh-hotkey: switch order')

        // Numbers follow Control on every platform, macOS included.
        ctx.effect(() => {
          const sync = (event) => store.publish({ held: event.ctrlKey })
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

        ctx.slots.inject('sidebar.session.row.leading', () => ctx.slots.register({
          name: 'sidebar.session.row.leading',
          id: 'dsh-hotkey.number',
          order: 20,
        }, SwitcherBadge))
      },
    }
  },
})
