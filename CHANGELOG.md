# Changelog

## 0.0.3

- Number only the first nine sidebar conversations: a visible number now always means a working chord, and rows past nine keep the host's 16px seat empty instead of showing an unreachable index.
- Add Control+J, a conversation switcher listing every session, including folded groups and rows the sidebar never rendered; panel numbers 1..k match the badges and the rest are appended in sidebar order.
- Filter the switcher by index prefix (`12`) or title fragment; the arrows and Tab move, Enter opens, Escape or a second Control+J closes, and the previous focus is restored.
- Hold Control for a moment past nine conversations to surface a `Control+J · all N conversations` hint; short presses like Control+C do not flash it.
- Register the switcher in the read-only Keyboard Shortcuts group; Control+Tab, Control+Shift+Tab and Control+1-9 keep their behavior.
- Dress the switcher in DSH's own material and semantic tokens (menu surface fill, menu blur, prominent elevation, panel radii, content font size, tooltip chip) with no hard-coded colors, so theme plugins repaint it by overriding tokens.

## 0.0.2

- Use Control on every platform, including macOS; Command+N is no longer reserved and keeps opening a new session.
- Cycle conversations with Control+Tab / Control+Shift+Tab; Control+1-9 still jumps to a numbered conversation.
- Numbering and cycling follow the rendered sidebar order, so changing grouping, sorting, folding or the archive filter renumbers the visible rows; when no row is rendered, fall back to the service order.
- Limit hint collection to real controls (including buttons and links inside the chat transcript); skip generic tabindex containers and the turn-navigation rail.
- Hint codes are two letters: the first letter filters and highlights matches while other badges disappear, and the second letter clicks; Backspace rewinds the filter.
- Add Option+Enter to focus the message composer from anywhere, closing the active main panel first.
- Include the Lexical composer and menu/listbox portal items in hint scanning, and skip hidden ancestors via checkVisibility.
- Promote the hint layer to the browser top layer so its badges appear above portaled menus and dropdowns.
- Double-tap Option to toggle the clickable-control hint layer; every target is a compact letter pill matching the conversation number badges, with no outline boxes and native shortcut labels hidden for now. Control stays reserved for conversation numbering and rotation.
- Keep the capture-phase keyboard handling and IME-safe dispatch from 0.0.1.

## 0.0.1

- First release.
- Hold Command (Control on Windows/Linux) to number the sidebar conversations.
- `Command+N` / `Command+Shift+N` cycle through conversations.
- `Command+1` through `Command+9` jump to a numbered conversation.
- Capture-phase keyboard handling that keeps working while an editor or IME has focus.
