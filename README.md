# dsh-hotkey

DSH 快捷键的统一入口。当前版本提供侧边栏对话切换；后续快捷键能力都集成在这个插件里。

npm：`@hellokidder/dsh-hotkey`

## 已包含

- **按住 Control** 时，左侧每个对话行首显示 1…n 的序号；当前对话的序号使用品牌色高亮。macOS 上也是 **Control**，不是 Command。
- **Control + Tab** 切换到下一个对话，**Control + Shift + Tab** 切换到上一个，均循环。
- **Control + 1…9** 直接跳转到对应序号的对话。
- **Option + Enter** 从任意位置把光标聚焦到当前输入框；如果主面板（设置、Review 等）盖住了会话，会先关掉面板再聚焦。
- 编号和轮转顺序直接跟随**当前渲染出来的侧边栏行**：切换 Workspace 分组、In one list、Manual 排序、固定、折叠或归档过滤后，都会按你看到的行顺序重排。
- 归档会话、子代理会话和空的「新会话」行不参与编号。
- **双击 Option（⌥）** 打开或关闭点击提示层：整个窗口的可点击控件会在左上角显示一个字母胶囊，样式与侧边栏的 1…n 编号一致（原生快捷键暂时不展示，也不绘制外框）。提示层保持显示：每个控件显示两个字母的提示码，输入第一个字母会保留并高亮命中的提示、其余消失，输入第二个字母才点击对应控件；`Backspace` 回退，`Esc` 或点击任意位置关闭。Ctrl 只负责会话编号与轮转。
- 三个快捷键会出现在「设置 → 键盘快捷键」的只读分组中，便于查找。

## 平台说明

- 会话编号与轮转统一使用 **Control**；`Command+N` 完全不受影响，仍然是「新建会话」。
- 字母提示层用 **双击 Option**（Windows/Linux 上是 Alt）打开/关闭；它和 Ctrl 的会话编号/轮转互不影响，也不会和 Option+字母输入特殊字符冲突。
- macOS 的 `Control+1…9` 可能被系统「切换桌面」占用。如果数字跳转没有反应，可以在 **系统设置 → 键盘 → 键盘快捷键 → 调度中心** 关闭对应的桌面切换快捷键；`Control+Tab` / `Control+Shift+Tab` 不受影响。
- 在 Chrome / Safari 里直接打开 Web GUI 时，`Control+Tab` / `Control+Shift+Tab` 会被浏览器标签页切换占用，`Control+1…9` 也可能被占用；桌面 App 更稳妥。

## 安装

从 npm 安装：

```sh
dsh plugin --profile web add @hellokidder/dsh-hotkey
```

从本地目录安装（开发）：

```sh
dsh plugin --profile web add "link:/absolute/path/to/dsh-hotkey"
```

安装后在插件管理中启用；修改 `client.js` 后刷新一次页面即可加载，如果运行在带 `pnpm run dev:web` watcher 的 checkout 中则会自动重载。

## 显示细节

- 编号占用每行标题左侧的 16px 座位；正在运行、等待审批或有未读完成状态的行会优先显示宿主的状态点，该行不显示编号。
- 顺序来自会话行上的 `data-row-key="session:<id>"`，按 DOM 中的视觉顺序编号。折叠分组和「显示更多」里尚未渲染的会话不参与编号与 `Control+Tab`；侧边栏收起或处于搜索态、读不到行时，会回退到服务端默认顺序（按 Workspace 分组 + 最近使用）。
- 这是一个 DOM 依赖：如果 DSH 升级改动了会话行的 `data-row-key`，编号会退回默认顺序，需要同步更新插件；插件不会修改侧边栏 DOM。
- 提示层只扫描真正的控件（原生可交互标签、Lexical/textarea 输入框，以及 button / link / tab / menuitem / textbox 等角色），覆盖侧边栏、输入区、顶栏、设置、右侧面板、对话正文里的按钮/链接，以及菜单/下拉项的 portal。右侧轮次缩略轴（turn rail）不参与；被 aria-hidden/inert 隐藏或不可见的元素会跳过。段落、消息行这类非控件容器不会生成提示。
- 会话行本身由 1…n 编号负责，不再重复生成字母提示；折叠、隐藏或禁用的控件不显示。
- 当前提示层只显示生成的字母提示，不绘制外框/背景；原生快捷键标签默认关闭，匹配逻辑保留在 `SHOW_NATIVE_SHORTCUTS` 常量后面，以后需要时可以重新打开。字母提示是插件生成的点击键，不依赖宿主的快捷键注册表；双击 Option 打开它，按住 Control 仍是对话编号与轮转。

## 与「新建会话」的关系

插件只使用 Control 组合，不占用任何 `Command`/`Ctrl + N`：

- `Command+N`（macOS）和宿主默认的 `Ctrl+N`（Windows/Linux）都保持原样，「新建会话」不受影响；
- 对话轮转使用 `Control+Tab` / `Control+Shift+Tab`，直达使用 `Control+1…9`；
- 固定快捷键仍然会出现在「设置 → 键盘快捷键」中，方便查看。

## 扩展新快捷键

1. 在 `client.js` 的 `apply` 中用 `ctx.shortcuts.registerFixed({ id, label, keys, bindings, group })` 声明固定组合，用来占键并让快捷键面板可见；需要用户可改键时改用 `ctx.shortcuts.register`（与宿主已有默认组合冲突时 `register` 会抛错）。
2. 在 `window` 的**捕获阶段**监听 `keydown` 并分发动作，不要依赖 `observeFixedInput` 的 bubble 监听：编辑器和输入法可能提前 `stopPropagation`，中文输入法还会把 Shift 标记为组合态。带 Control 的组合是命令，不应被 `isComposing` 拦截。
3. 需要随快捷键状态显示 UI 时，沿用当前 `store` + `React.useSyncExternalStore` 的模式，通过槽位渲染。
4. 同步更新 `locale/en.json`、`locale/zh.json` 的插件标题与描述，以及 `client.js` 中的 `en`/`zh` 命令标签。
5. 保存后刷新页面即可；如果运行在带 `pnpm run dev:web` watcher 的 checkout 中会自动重载。修改 `package.json` 或 patch 需要重新安装。

## 开发

```sh
git clone https://github.com/hellokidder/dsh-hotkey.git
cd dsh-hotkey
node --check client.js
```

- `client.js` 是浏览器端模块（`window.__ModuleLoader__` 格式），不依赖构建工具。
- 插件清单与入口见 `package.json`、`cordis.patch.yml`，宿主半边 `index.js` 目前为空。

## 发布

```sh
npm publish --access public
git tag v0.0.2 && git push origin v0.0.2
```

## License

MIT
