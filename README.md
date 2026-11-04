# dsh-hotkey

DSH 快捷键的统一入口。当前版本提供侧边栏对话切换；后续快捷键能力都集成在这个插件里。

npm：`@hellokidder/dsh-hotkey`

## 已包含

- **按住 Control** 时，左侧每个对话行首显示 1…n 的序号；当前对话的序号使用品牌色高亮。macOS 上也是 **Control**，不是 Command。
- **Control + N** 切换到下一个对话，**Control + Shift + N** 切换到上一个，均循环。
- **Control + 1…9** 直接跳转到对应序号的对话。
- 序号顺序跟随侧边栏默认视图：按 Workspace 分组、置顶优先、组内按最近使用排序；归档会话、子代理会话和空的「新会话」行不参与编号。
- 三个快捷键会出现在「设置 → 键盘快捷键」的只读分组中，便于查找。

## 平台说明

- 所有平台统一使用 **Control**；macOS 的 `Command+N` 不再被插件占用，仍然是「新建会话」。
- macOS 的 `Control+1…9` 可能被系统「切换桌面」占用。如果数字跳转没有反应，可以在 **系统设置 → 键盘 → 键盘快捷键 → 调度中心** 关闭对应的桌面切换快捷键；`Control+N` / `Control+Shift+N` 不受影响。
- 在 Chrome / Safari 里直接打开 Web GUI 时，`Control+1…9` 可能被浏览器标签页切换占用；桌面 App 更稳妥。

## 安装

从 npm 安装：

```sh
dsh plugin --profile web add @hellokidder/dsh-hotkey
```

从本地目录安装（开发）：

```sh
dsh plugin --profile web add "link:/absolute/path/to/dsh-hotkey"
```

安装后在插件管理中启用，客户端会通过 HMR 加载；如果没有更新，刷新一次页面。

## 显示细节

- 编号占用每行标题左侧的 16px 座位；正在运行、等待审批或有未读完成状态的行会优先显示宿主的状态点，该行不显示编号。
- 编号顺序与侧边栏默认视图一致：按 Workspace 分组、置顶优先、组内最新在前。折叠分组中的会话仍参与编号和切换。

## 与「新建会话」的关系

插件现在只使用 Control 组合：

- macOS：`Command+N` 保持宿主默认行为，仍然是「新建会话」；对话切换使用 `Control+N` / `Control+Shift+N`。
- Windows / Linux：宿主的「新建会话」默认也是 `Ctrl+N`，插件会接管这个组合；侧边栏的新建按钮和菜单仍然可用，也可在「设置 → 键盘快捷键」里给「新建会话」换一个键。
- 固定快捷键仍然会出现在「设置 → 键盘快捷键」中，方便查看。

## 扩展新快捷键

1. 在 `client.js` 的 `apply` 中用 `ctx.shortcuts.registerFixed({ id, label, keys, bindings, group })` 声明固定组合，用来占键并让快捷键面板可见；需要用户可改键时改用 `ctx.shortcuts.register`（与宿主已有默认组合冲突时 `register` 会抛错）。
2. 在 `window` 的**捕获阶段**监听 `keydown` 并分发动作，不要依赖 `observeFixedInput` 的 bubble 监听：编辑器和输入法可能提前 `stopPropagation`，中文输入法还会把 Shift 标记为组合态。带 Control 的组合是命令，不应被 `isComposing` 拦截。
3. 需要随快捷键状态显示 UI 时，沿用当前 `store` + `React.useSyncExternalStore` 的模式，通过槽位渲染。
4. 同步更新 `locale/en.json`、`locale/zh.json` 的插件标题与描述，以及 `client.js` 中的 `en`/`zh` 命令标签。
5. 保存后客户端 HMR 会自动重载；如未生效刷新页面即可。修改 `package.json` 或 patch 需要重新安装。

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
