# 开发计划（当前 Web 版基线）

## 元信息
- 项目：resume-builder
- 当前阶段：Web 版 MVP 基线
- 技术栈：Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + Zustand 5
- PDF 方案：`@react-pdf/renderer` 客户端生成 + 浏览器打印页并存
- 状态持久化：Zustand persist → `localStorage`
- 测试方案：ESLint + Playwright 视觉测试（当前视觉测试文件存在但不可稳定执行）
- 本文件用途：作为后续 Iter 模式 `plan-patch.md` 的基线，不表示未来需求。

## 模块 1：项目基础与运行配置

### 概述
- 职责：提供 Next.js 前端项目骨架、脚本、依赖与基础样式入口。
- 前置依赖：无
- 当前状态：已实现

### Step 1：配置项目脚本与依赖
- 操作：在 `package.json` 中定义：
  - `scripts.dev`：启动 Next.js dev server
  - `scripts.build`：执行生产构建
  - `scripts.start`：启动生产服务
  - `scripts.lint`：运行 ESLint
  - `scripts.test:visual`：运行 Playwright 视觉测试
- 关键依赖：
  - `next`
  - `react`
  - `react-dom`
  - `zustand`
  - `uuid`
  - `@react-pdf/renderer`
  - `@playwright/test`
- 验证：
  - `npm install`
  - `npm run lint`
  - `npm run build`

### Step 2：配置 Next.js App Router
- 操作：保留并维护以下文件：
  - `src/app/layout.tsx` — Root layout
  - `src/app/page.tsx` — 主页面，组合编辑器、预览区、导出栏
  - `src/app/export/page.tsx` — 浏览器打印 PDF 页面
  - `src/app/globals.css` — Tailwind 4、CSS 变量、表单/按钮/打印样式
- 验证：
  - `npm run dev`
  - 浏览器访问 `http://localhost:3000`
  - 浏览器访问 `/export` 不出现运行时崩溃

### Step 3：配置 Playwright
- 操作：维护 `playwright.config.ts`：
  - `testDir` 指向 `./tests`
  - `baseURL` 默认 `http://localhost:3000`
  - `chromium` 项目启用
  - viewport 设为 `1440x900`
- 验证：
  - `npx playwright test --list`

## 模块 2：核心数据模型

### 概述
- 职责：定义简历数据结构、模板名称、模块顺序、模块展示状态。
- 前置依赖：模块 1
- 当前状态：已实现

### Step 1：定义双语字段模型
- 操作：在 `src/types/resume.ts` 中定义：
  - `interface BilingualText { zh: string; en: string }`
- 验证：
  - `npm run build`

### Step 2：定义个人信息模型
- 操作：在 `src/types/resume.ts` 中定义 `interface PersonalInfo`：
  - `name: BilingualText`
  - `title: BilingualText`
  - `email: string`
  - `phone: string`
  - `location: BilingualText`
  - `website: string`
  - `summary: BilingualText`
  - `avatarUrl: string`
  - `gender: string`
  - `birthDate: string`
  - `politicalStatus: string`
- 验证：
  - `npm run build`

### Step 3：定义简历模块模型
- 操作：在 `src/types/resume.ts` 中定义：
  - `interface Education`
  - `interface Honor`
  - `interface Experience`
  - `interface Project`
  - `interface CampusActivity`
  - `interface SkillCategory`
  - `interface ResumeData`
- 验证：
  - `npm run build`

### Step 4：定义布局与模板枚举
- 操作：在 `src/types/resume.ts` 中定义：
  - `type TemplateName = 'classic' | 'modern' | 'minimal' | 'compact'`
  - `type SectionKey = 'personalInfo' | 'education' | 'honors' | 'experience' | 'projects' | 'campusActivities' | 'skills'`
  - `type SectionEmphasis = 'expanded' | 'normal' | 'compact' | 'hidden'`
  - `DEFAULT_SECTION_ORDER`
  - `SECTION_LABELS`
  - `TEMPLATE_NAMES`
- 验证：
  - `npm run build`

## 模块 3：状态管理

### 概述
- 职责：集中管理简历数据、模板、语言、当前编辑区、模块顺序、模块展示状态。
- 前置依赖：模块 2
- 当前状态：已实现

### Step 1：创建 Zustand store
- 操作：在 `src/store/useResumeStore.ts` 中定义：
  - `interface ResumeState`
  - `useResumeStore`
- 关键状态字段：
  - `data: ResumeData`
  - `template: TemplateName`
  - `sectionOrder: SectionKey[]`
  - `emphasis: Partial<Record<SectionKey, SectionEmphasis>>`
  - `activeLanguage: 'zh' | 'en'`
  - `activeSection: SectionKey`
- 验证：
  - `npm run build`

### Step 2：实现个人信息与通用字段更新
- 操作：在 `src/store/useResumeStore.ts` 中实现：
  - `setField(section, value)`
  - `setPersonalInfo(info)`
- 验证：
  - `npm run build`

### Step 3：实现数组模块 CRUD action
- 操作：在 `src/store/useResumeStore.ts` 中实现：
  - `addEducation/updateEducation/removeEducation`
  - `addHonor/updateHonor/removeHonor`
  - `addExperience/updateExperience/removeExperience`
  - `addProject/updateProject/removeProject`
  - `addCampusActivity/updateCampusActivity/removeCampusActivity`
  - `addSkillCategory/updateSkillCategory/removeSkillCategory`
- 关键代码指引：
  - 新增项统一使用 `uuidv4()` 生成 `id`
  - 双语字段默认值统一为 `{ zh: '', en: '' }`
- 验证：
  - `npm run build`

### Step 4：实现布局/语言/模板 action
- 操作：在 `src/store/useResumeStore.ts` 中实现：
  - `setTemplate(template)`
  - `setSectionOrder(order)`
  - `setEmphasis(emphasis)`
  - `setActiveLanguage(lang)`
  - `setActiveSection(section)`
- 当前限制：
  - `setSectionOrder` 已实现，但没有拖拽排序 UI。
  - `setEmphasis` 已实现，但没有模块显示/隐藏 UI。
- 验证：
  - `npm run build`

### Step 5：实现数据加载与持久化兼容
- 操作：在 `src/store/useResumeStore.ts` 中实现：
  - `loadResumeData(data)`
  - `loadDemoData()`
  - `resetResumeData()`
  - Zustand `persist` 自定义 `merge`
- 验证：
  - `npm run build`
  - 浏览器刷新后数据保持
  - 导入旧 JSON 后缺失字段被默认值补齐

## 模块 4：编辑器 UI

### 概述
- 职责：提供左侧分区表单，支持编辑简历各模块。
- 前置依赖：模块 2、模块 3
- 当前状态：已实现，但易用性仍需迭代

### Step 1：实现编辑器分区入口
- 操作：在 `src/components/editor/SidebarEditor.tsx` 中实现：
  - `SECTIONS: SectionKey[]`
  - `SECTION_ICONS`
  - `renderSection()`
  - tab 切换调用 `setActiveSection`
- 验证：
  - `npm run build`
  - 手动点击 7 个 tab 均显示对应表单

### Step 2：实现个人信息表单
- 操作：在 `src/components/editor/PersonalInfoForm.tsx` 中实现：
  - 中英文姓名/标题/地点/简介输入
  - 性别、出生日期、政治面貌输入
  - 邮箱、电话、网站输入
- 验证：
  - `npm run build`
  - 修改字段后右侧预览实时更新

### Step 3：实现教育经历表单
- 操作：在 `src/components/editor/EducationForm.tsx` 中实现：
  - 新增/删除教育经历
  - 学校、学位、专业、时间、GPA、课程、描述字段
- 当前限制：
  - `courses` 使用逗号分割的单输入框，用户体验不够直观。
- 验证：
  - `npm run build`
  - 新增教育经历并填写课程后预览显示课程

### Step 4：实现荣誉奖项表单
- 操作：在 `src/components/editor/HonorForm.tsx` 中实现：
  - 新增/删除荣誉
  - 标题、级别、时间、描述字段
- 验证：
  - `npm run build`

### Step 5：实现实习经历表单
- 操作：在 `src/components/editor/ExperienceForm.tsx` 中实现：
  - 新增/删除经历
  - 公司、角色、时间、描述、亮点字段
- 当前限制：
  - 亮点字段如使用分隔符输入，需在后续 patch 中改成可逐条添加/删除的 UI。
- 验证：
  - `npm run build`

### Step 6：实现项目经历表单
- 操作：在 `src/components/editor/ProjectForm.tsx` 中实现：
  - 新增/删除项目
  - 项目名、角色、时间、技术栈、描述、链接字段
- 当前限制：
  - `tech` 使用逗号分割的单输入框，用户体验不够直观。
  - `link` 已采集，但部分模板未展示链接。
- 验证：
  - `npm run build`

### Step 7：实现校园经历表单
- 操作：在 `src/components/editor/CampusActivityForm.tsx` 中实现：
  - 新增/删除校园经历
  - 组织、角色、时间、描述、亮点字段
- 验证：
  - `npm run build`

### Step 8：实现技能表单
- 操作：在 `src/components/editor/SkillForm.tsx` 中实现：
  - 新增/删除技能分类
  - 分类名称与技能项字段
- 当前限制：
  - 技能项如使用分隔符输入，需在后续 patch 中改成可逐条添加/删除的 UI。
- 验证：
  - `npm run build`

## 模块 5：简历预览与模板系统

### 概述
- 职责：渲染 A4 比例简历预览，支持 4 套模板、双语、模块顺序、模块隐藏。
- 前置依赖：模块 2、模块 3
- 当前状态：已实现，视觉细节需迭代

### Step 1：实现预览容器
- 操作：在 `src/components/preview/PreviewPanel.tsx` 中实现：
  - 使用 dynamic import 加载 4 套模板
  - 从 store 读取 `data/template/sectionOrder/emphasis/activeLanguage`
  - 预览容器 id 为 `resume-preview`
  - 预览尺寸为 `794px × minHeight 1123px`
- 验证：
  - `npm run build`
  - 页面右侧能显示 A4 简历预览

### Step 2：实现 Classic 模板
- 操作：在 `src/components/templates/ClassicTemplate.tsx` 中实现：
  - 单栏结构
  - 中心化个人信息
  - 按 `sectionOrder` 渲染模块
  - `emphasis[key] === 'hidden'` 时隐藏模块
- 当前限制：
  - 横线颜色、粗细、间距为硬编码，缺少统一设计 token。
  - 部分字段如项目链接未完整展示。
- 验证：
  - `npm run build`
  - 选择 Classic 模板，所有非空模块显示

### Step 3：实现 Modern 模板
- 操作：在 `src/components/templates/ModernTemplate.tsx` 中实现：
  - 30/70 双栏结构
  - 左侧个人信息与技能
  - 右侧教育、荣誉、实习、项目、校园经历
- 当前限制：
  - `skills` 不跟随用户 `sectionOrder`，固定在侧边栏。
  - `personalInfo` 可被 `emphasis.hidden` 隐藏，但其他模板通常强制显示个人信息，行为不一致。
  - 部分模块文本/分割线 spacing 需统一。
- 验证：
  - `npm run build`
  - 选择 Modern 模板，左侧/右侧布局正常

### Step 4：实现 Minimal 模板
- 操作：在 `src/components/templates/MinimalTemplate.tsx` 中实现：
  - 简约单栏结构
  - 细线分割模块
- 当前限制：
  - Web 模板与 PDF 模板样式参数不完全共源。
- 验证：
  - `npm run build`

### Step 5：实现 Compact 模板
- 操作：在 `src/components/templates/CompactTemplate.tsx` 中实现：
  - 紧凑单栏结构
  - 控制内容密度
- 当前限制：
  - Web 模板与 PDF 模板样式参数不完全共源。
- 验证：
  - `npm run build`

## 模块 6：导入导出

### 概述
- 职责：支持 JSON 导入导出、SVG 导出、PDF 导出与浏览器打印。
- 前置依赖：模块 2、模块 3、模块 5
- 当前状态：已实现，但 PDF 体验需迭代

### Step 1：实现导出栏
- 操作：在 `src/components/export/ExportBar.tsx` 中实现：
  - PDF 按钮
  - 打印 PDF 按钮
  - SVG 按钮
  - JSON 导出按钮
  - JSON 导入按钮
  - 示例数据按钮
  - 重置按钮
- 验证：
  - `npm run build`
  - 页面顶部导出栏按钮可见

### Step 2：实现 JSON 导入导出
- 操作：在 `src/lib/export/json.ts` 中实现：
  - `exportToJSON(data)`
  - `importFromJSON(jsonString)`
  - `downloadJSON(data, filename)`
  - `mergeWithDefaults(data)`
- 验证：
  - 导出 JSON 后重新导入
  - 页面数据恢复且不崩溃

### Step 3：实现 SVG 导出
- 操作：在 `src/lib/export/svg.ts` 中实现：
  - 根据简历数据生成 SVG 字符串
  - 下载 `.svg`
- 验证：
  - 点击 SVG 后下载文件
  - SVG 文件可在浏览器打开

### Step 4：实现 React PDF 导出
- 操作：在 `src/lib/export/pdf.tsx` 中实现：
  - `createResumePDF(props)`
  - `createClassicPDF`
  - `createModernPDF`
  - `createMinimalPDF`
  - `createCompactPDF`
  - 注册 Noto 字体
- 当前限制：
  - Web 模板和 PDF 模板是两套样式实现，容易视觉漂移。
  - `@react-pdf/renderer` 不适用于未来微信小程序前端。
- 验证：
  - 点击 PDF 后下载 `resume.pdf`
  - PDF 能正常打开

### Step 5：实现浏览器打印导出页
- 操作：在 `src/app/export/page.tsx` 中实现：
  - 从 query string 读取 `data/template/sectionOrder/emphasis/language`
  - 调用 store action 恢复简历状态
  - 渲染 `PreviewPanel`
  - 派发 `resume-export-ready`
- 验证：
  - 点击“打印PDF”后打开 `/export?...`
  - 新窗口正常显示简历

## 模块 7：国际化

### 概述
- 职责：提供编辑器和导出栏文案的中英文词典。
- 前置依赖：模块 1
- 当前状态：部分实现

### Step 1：实现词典文件
- 操作：维护以下文件：
  - `src/lib/i18n/zh.ts`
  - `src/lib/i18n/en.ts`
- 验证：
  - `npm run build`

### Step 2：实现翻译函数
- 操作：在 `src/lib/i18n/index.ts` 中实现：
  - `setLocale(locale)`
  - `getLocale()`
  - 默认导出 `t(path)`
- 当前限制：
  - 页面语言切换只修改 store 的 `activeLanguage`，没有同步调用 `setLocale()`。
  - 模板主要通过 `activeLanguage` 直接选择双语字段，不依赖 `t()`。
- 验证：
  - `npm run build`

## 模块 8：视觉测试

### 概述
- 职责：验证模板在不同语言/模板下的视觉一致性。
- 前置依赖：模块 1、模块 5
- 当前状态：存在测试文件，但当前不可作为可靠验收依据

### Step 1：配置 Playwright 基础环境
- 操作：维护 `playwright.config.ts`
- 验证：
  - `npx playwright test --list`

### Step 2：维护视觉测试文件
- 操作：维护 `tests/visual.test.js`
- 当前问题：
  - 文件中存在错误导入、拼写错误、语法错误、错误路由假设。
  - 当前不能作为视觉回归基线。
- 验证：
  - 当前预期：`npm run test:visual` 可能失败。
  - 后续 patch 必须先修复该测试链路。

## 当前验收基线

- [x] `npm install` 可安装依赖
- [x] `npm run dev` 可启动 Web 应用
- [x] 主页面可编辑并实时预览简历
- [x] 支持 Classic / Modern / Minimal / Compact 四套模板
- [x] 支持 JSON 导入导出
- [x] 支持 SVG 导出
- [x] 支持 React PDF 导出与浏览器打印导出页
- [ ] 视觉测试链路可靠可用
- [ ] 模块展示控制有用户可操作 UI
- [ ] 分隔字段有易用的逐项输入 UI
- [ ] Web 模板与 PDF 模板样式完全一致
