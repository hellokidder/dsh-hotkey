# Changelog

## 0.0.2

- Use Control on every platform, including macOS; Command+N is no longer reserved and keeps opening a new session.
- Cycle conversations with Control+Tab / Control+Shift+Tab; Control+1-9 still jumps to a numbered conversation.
- Numbering and cycling follow the rendered sidebar order, so changing grouping, sorting, folding or the archive filter renumbers the visible rows; when no row is rendered, fall back to the service order.
- Long-press Control to reveal every clickable control in the window as a compact blue letter pill; no outline boxes are drawn, and native shortcut labels are hidden for now. After Control is released, the letter clicks the target.
- Keep the capture-phase keyboard handling and IME-safe dispatch from 0.0.1.

## 0.0.1

- First release.
- Hold Command (Control on Windows/Linux) to number the sidebar conversations.
- `Command+N` / `Command+Shift+N` cycle through conversations.
- `Command+1` through `Command+9` jump to a numbered conversation.
- Capture-phase keyboard handling that keeps working while an editor or IME has focus.
