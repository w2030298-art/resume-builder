# 开发进度（当前 Web 版基线）

## 当前状态
- 当前阶段：v3 patch 已规划完成，等待执行
- 最后更新：2026-05-03
- 状态：计划已更新，实现待执行
- 说明：本文件记录当前代码仓库已实现能力与本轮新增待完成步骤。

## 模块进度

### 模块 1：项目基础与运行配置
- [x] Step 1：配置项目脚本与依赖 [MODIFIED] 2026-05-01
- [x] Step 2：配置 Next.js App Router
- [x] Step 3：配置 Playwright
- [x] Step 4：修复 Playwright 自动启动 dev server [ADDED] 2026-05-03 [DONE] 2026-05-03

### 模块 2：核心数据模型
- [x] Step 1：定义双语字段模型
- [x] Step 2：定义个人信息模型
- [x] Step 3：定义简历模块模型
- [x] Step 4：定义布局与模板枚举

### 模块 3：状态管理
- [x] Step 1：创建 Zustand store
- [x] Step 2：实现个人信息与通用字段更新
- [x] Step 3：实现数组模块 CRUD action
- [x] Step 4：实现布局/语言/模板 action [MODIFIED] 2026-05-01
- [x] Step 5：实现数据加载与持久化兼容

### 模块 4：编辑器 UI
- [x] Step 1：实现编辑器分区入口 [MODIFIED] 2026-05-01
- [x] Step 2：实现个人信息表单
- [x] Step 3：实现教育经历表单 [MODIFIED] 2026-05-01
- [x] Step 4：实现荣誉奖项表单
- [x] Step 5：实现实习经历表单 [MODIFIED] 2026-05-01
- [x] Step 6：实现项目经历表单 [MODIFIED] 2026-05-01
- [x] Step 7：实现校园经历表单 [MODIFIED] 2026-05-01
- [x] Step 8：实现技能表单 [MODIFIED] 2026-05-01
- [x] Step 9：新增通用逐项输入组件 TagInput [ADDED] 2026-05-01
- [x] Step 10：新增双语亮点逐项输入组件 BilingualListInput [ADDED] 2026-05-01
- [x] Step 11：新增模块展示控制组件 LayoutControls [ADDED] 2026-05-01

### 模块 5：简历预览与模板系统
- [x] Step 1：实现预览容器
- [x] Step 2：实现 Classic 模板 [MODIFIED] 2026-05-01
- [x] Step 3：实现 Modern 模板 [MODIFIED] 2026-05-01
- [x] Step 4：实现 Minimal 模板 [MODIFIED] 2026-05-01
- [x] Step 5：实现 Compact 模板 [MODIFIED] 2026-05-01
- [x] Step 6：新增模板设计 token [ADDED] 2026-05-01
- [x] Step 7：建立字段展示矩阵并落地到模板 [ADDED] 2026-05-01

### 模块 6：导入导出
- [x] Step 1：实现导出栏 [MODIFIED] 2026-05-01
- [x] Step 2：实现 JSON 导入导出
- [x] Step 3：实现 SVG 导出
- [x] Step 4：实现 React PDF 导出 [MODIFIED] 2026-05-01
- [x] Step 5：实现浏览器打印导出页 [MODIFIED] 2026-05-01
- [x] Step 6：切换导出栏主链路为浏览器打印
- [x] Step 7：改造 `/export` 为 sessionStorage 打印页
- [x] Step 8：修正打印 CSS 使打印页与 Web 预览一致
- [x] Step 9：降级 React PDF 入口与文案
- [x] Step 10：记录已修复问题
- [ ] Step 11：为 `/export` sessionStorage payload 增加 shape guard [ADDED] 2026-05-03

### 模块 7：国际化
- [x] Step 1：实现词典文件 [MODIFIED] 2026-05-01
- [x] Step 2：实现翻译函数 [MODIFIED] 2026-05-01
- [ ] Step 3：补齐导出反馈与运行控制 i18n key [ADDED] 2026-05-03

### 模块 8：视觉测试
- [x] Step 1：配置 Playwright 基础环境
- [x] Step 2：维护视觉测试文件（当前文件存在，但不可作为可靠验收依据） [MODIFIED] 2026-05-01
- [x] Step 3：新增 PDF 下载验收测试 [ADDED] 2026-05-01
- [x] Step 4：新增模块隐藏验收测试 [ADDED] 2026-05-01
- [x] Step 5：改造导出验收测试为浏览器打印主链路
- [ ] Step 6：稳定 popup print mock 并补充本轮测试 [ADDED] 2026-05-03

### 模块 9：本地后台进程控制
- [x] Step 1：确认关闭网页不会同步关闭后台进程 [ADDED] 2026-05-03
- [x] step 2：新增 dev-only shutdown API route [ADDED] 2026-05-03
- [x] step 3：新增网页端关闭后台按钮 [ADDED] 2026-05-03
- [ ] step 4：补充关闭后台按钮测试 [ADDED] 2026-05-03
- [ ] step 5：更新文档、问题记录与执行报告 [ADDED] 2026-05-03

## 已知问题摘要
- `tests/visual.test.js` 当前存在明显语法/拼写/路由问题，后续 patch 必须优先修复。
- 模块展示控制已存在 store 能力，但缺少用户 UI。
- 分隔字段当前主要依赖逗号字符串输入，不适合用户逐项编辑。
- Web 模板与 PDF 模板样式不是同一套 token，容易出现导出与预览不一致。
- 部分用户填写的信息在简历模板中未完整展示，例如项目链接。
- 关闭浏览器标签页不会自动停止 `npm run dev` 后台进程；需显式关闭入口。
