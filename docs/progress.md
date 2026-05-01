# 开发进度（当前 Web 版基线）

## 当前状态
- 当前阶段：Web 版 MVP 已完成，准备进入 UX / Template Polish / Export / Visual Regression 迭代
- 最后更新：2026-05-01
- 状态：基线已补建
- 说明：本文件记录当前代码仓库已实现能力，不包含下一轮新增需求。

## 模块进度

### 模块 1：项目基础与运行配置
- [x] Step 1：配置项目脚本与依赖 [MODIFIED] 2026-05-01
- [x] Step 2：配置 Next.js App Router
- [x] Step 3：配置 Playwright

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

### 模块 7：国际化
- [x] Step 1：实现词典文件 [MODIFIED] 2026-05-01
- [x] Step 2：实现翻译函数 [MODIFIED] 2026-05-01

### 模块 8：视觉测试
- [x] Step 1：配置 Playwright 基础环境
- [x] Step 2：维护视觉测试文件（当前文件存在，但不可作为可靠验收依据） [MODIFIED] 2026-05-01
- [x] Step 3：新增 PDF 下载验收测试 [ADDED] 2026-05-01
- [x] Step 4：新增模块隐藏验收测试 [ADDED] 2026-05-01

## 已知问题摘要
- `tests/visual.test.js` 当前存在明显语法/拼写/路由问题，后续 patch 必须优先修复。
- 模块展示控制已存在 store 能力，但缺少用户 UI。
- 分隔字段当前主要依赖逗号字符串输入，不适合用户逐项编辑。
- Web 模板与 PDF 模板样式不是同一套 token，容易出现导出与预览不一致。
- 部分用户填写的信息在简历模板中未完整展示，例如项目链接。
