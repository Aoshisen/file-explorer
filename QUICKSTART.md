# 快速开始指南

## 项目已创建完成！

你的 Tauri + React 文件系统可视化工具已经构建完成。项目位于：
```
/Users/aoshisen/Documents/Code/file-explorer
```

## 项目结构

```
file-explorer/
├── src/                          # React 前端代码
│   ├── components/
│   │   ├── Sunburst.tsx         # D3 旭日图组件
│   │   ├── Breadcrumb.tsx       # 面包屑导航
│   │   └── Tooltip.tsx          # 悬浮提示
│   ├── App.tsx                  # 主应用组件
│   ├── main.tsx                 # React 入口
│   └── index.css                # 样式（深色主题 + 霓虹色）
├── src-tauri/                    # Rust 后端代码
│   ├── src/
│   │   ├── main.rs              # Tauri 命令处理
│   │   └── lib.rs               # 文件系统扫描逻辑
│   ├── Cargo.toml               # Rust 依赖
│   └── tauri.conf.json          # Tauri 配置
├── vite.config.ts               # Vite 构建配置
├── tsconfig.json                # TypeScript 配置
└── package.json                 # Node 依赖
```

## 核心功能

### 后端（Rust）
- ✅ 递归文件夹扫描（`scan_directory`）
- ✅ 文件大小计算
- ✅ 系统文件夹过滤（$Recycle.Bin, node_modules 等）
- ✅ 符号链接处理
- ✅ 深度限制（防止无限递归）

### 前端（React）
- ✅ D3 旭日图可视化
- ✅ 交互式导航（点击文件夹切换）
- ✅ 面包屑导航
- ✅ 悬浮提示（显示文件名、大小、类型）
- ✅ 深色主题 + 霓虹色配色

## 设计美学

采用 **科技感深色主题** 配合 **霓虹色强调**：
- 背景色：深灰黑 (#0f0f1e)
- 主色调：霓虹青 (#00d9ff)
- 辅助色：霓虹洋红 (#ff006e)、霓虹绿 (#39ff14)
- 字体：等宽字体（技术感）+ 无衬线字体（现代感）
- 动画：平滑过渡、发光效果

## 开发命令

### 安装依赖
```bash
cd file-explorer
npm install
```

### 开发模式（带热重载）
```bash
npm run tauri:dev
```
这会启动 Vite 开发服务器并打开 Tauri 窗口。

### 生产构建
```bash
npm run tauri:build
```
生成可执行的桌面应用（.exe/.dmg/.deb）。

### 仅构建前端
```bash
npm run build
```
输出到 `dist/` 目录。

## 使用方式

1. **启动应用**：运行 `npm run tauri:dev`
2. **浏览文件**：应用会自动加载你的主目录
3. **导航**：
   - 点击旭日图中的文件夹块进入该目录
   - 使用面包屑导航快速返回上级目录
   - 悬浮鼠标查看文件详情
4. **查看信息**：
   - 文件名、大小、类型显示在悬浮提示中
   - 底部显示当前路径

## 技术栈

- **前端框架**：React 19 + TypeScript
- **可视化**：D3.js 7
- **桌面框架**：Tauri 2
- **后端**：Rust（tokio 异步运行时）
- **构建工具**：Vite 8
- **样式**：原生 CSS（无框架依赖）

## 下一步优化建议

根据原始需求，可以继续添加：

1. **性能优化**
   - [ ] Web Worker 处理 D3 布局计算
   - [ ] 虚拟滚动处理超大文件夹
   - [ ] 流式传输大目录数据

2. **功能增强**
   - [ ] 搜索功能（按文件名筛选）
   - [ ] 导出为 SVG/PNG
   - [ ] 文件夹选择对话框
   - [ ] 仅显示前 N 个大文件夹

3. **用户体验**
   - [ ] 键盘快捷键
   - [ ] 深色/浅色主题切换
   - [ ] 右键菜单
   - [ ] 拖拽支持

## 故障排除

### 构建失败
- 确保已安装 Rust 和 Node.js
- 运行 `npm install` 重新安装依赖
- 清除缓存：`rm -rf node_modules dist && npm install`

### 扫描速度慢
- 这是正常的，大文件夹需要时间扫描
- 系统文件夹已被自动过滤
- 可以修改 `src-tauri/src/lib.rs` 中的 `MAX_DEPTH` 来限制扫描深度

### 权限错误
- 某些系统文件夹可能无法访问
- 应用会自动跳过无权限的目录

## 文件说明

| 文件 | 说明 |
|------|------|
| `src/App.tsx` | 主应用逻辑、状态管理 |
| `src/components/Sunburst.tsx` | D3 旭日图实现 |
| `src/components/Breadcrumb.tsx` | 面包屑导航组件 |
| `src/components/Tooltip.tsx` | 悬浮提示组件 |
| `src-tauri/src/lib.rs` | 文件系统扫描核心逻辑 |
| `src-tauri/src/main.rs` | Tauri 命令注册 |
| `src/index.css` | 全局样式和动画 |

祝你使用愉快！🚀
