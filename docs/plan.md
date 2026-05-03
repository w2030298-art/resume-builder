# 开发计划（当前 Web 版基线）

## 元信息
- 项目：resume-builder
- 版本：v2
- 技术栈：Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + Zustand 5
- 当前目标：将 PDF 导出主链路切换为“Web 预览 → 浏览器打印”，暂不继续追 `@react-pdf/renderer` 与 Web 排版一致性
- 短期导出策略：
  - 主链路：浏览器打印导出 PDF
  - 数据传输：`sessionStorage` 一次性 payload
  - `@react-pdf/renderer`：降级为实验入口或隐藏，不作为主按钮
- 总模块数：8
- 预计步骤总数：47
- 建议开发顺序：模块 6 Step 6 → 模块 6 Step 7 → 模块 6 Step 8 → 模块 8 Step 5 → 模块 6 Step 9 → 模块 6 Step 10
- 创建日期：2026-05-01
- 最后更新：2026-05-02

### 变更记录
| 版本 | 日期 | 变更摘要 |
|------|------|---------|
| v1 | 2026-05-01 | 补建当前 Web 版 MVP 基线 |
| v2 | 2026-05-02 | PDF 主链路改为浏览器打印；URL query payload 改为 sessionStorage；`@react-pdf` 降级；补打印导出测试 |

## Status
> 任何 agent 读到此区块即可恢复完整上下文。

- 当前阶段：模块 6：导入导出 Step 6
- 整体进度：41 / 47 步骤完成
- 状态：变更后待执行
- 阻塞项：
  - `docs/report.md` 当前缺失；执行端本轮完成后必须补建并记录执行结果。
- 当前决策：
  - 不再以 `@react-pdf/renderer` 作为主 PDF 导出链路。
  - 优先修复浏览器打印，使打印 PDF 与 Web 预览一致。
  - 不在本轮解决 SVG 与 Web 完全一致问题。
  - 不在本轮重构所有模板为共享渲染 schema。

### Last Iteration Summary
- Web 版 MVP 基线已补建。
- 用户确认最严重问题：
  1. 原生 PDF 导出与 Web 排版差异巨大。
  2. 浏览器打印功能报错不可用。
  3. 若原生 PDF 短期成本过高，可暂放，优先使用调试好的浏览器打印功能。
- 代码现状：
  - `src/components/export/ExportBar.tsx` 仍以 `handleExportPDF()` 作为主按钮。
  - `handleBrowserPrint()` 仍通过 `/export?data=...` 传完整 JSON。
  - `src/app/export/page.tsx` 仍从 query string 读取并 `decodeURIComponent()`。
  - `/export` 只渲染预览，没有自动触发 `window.print()`。
  - `tests/visual.spec.ts` 仍验证 “一键导出 PDF 下载”，测试目标与新决策不一致。

### Pending Decisions
- 是否在后续版本彻底删除 `src/lib/export/pdf.tsx` 与 `@react-pdf/renderer` 依赖：本轮不决定。
- 是否将 SVG 导出也改为浏览器/DOM 捕获路线：本轮不决定。

---

## 模块 1：项目基础与运行配置

### 概述
- 职责：Next.js 前端骨架、脚本、依赖与基础样式入口。
- 前置依赖：无
- 当前状态：已实现

### Step 1：[DONE] 配置项目脚本与依赖
- **scope: auto**
- 操作：维护 `package.json` 中的 `dev/build/start/lint/test:visual/test:visual:update`。
- 验证：`npm install && npm run lint && npm run build`

### Step 2：[DONE] 配置 Next.js App Router
- **scope: auto**
- 操作：维护 `src/app/layout.tsx`、`src/app/page.tsx`、`src/app/export/page.tsx`、`src/app/globals.css`。
- 验证：`npm run dev` 后访问 `http://localhost:3001`

### Step 3：[DONE] 配置 Playwright
- **scope: auto**
- 操作：维护 `playwright.config.ts`，确保 `testDir="./tests"`，baseURL 与 dev 端口一致。
- 验证：`npx playwright test --list`

---

## 模块 2：核心数据模型

### 概述
- 职责：定义简历数据结构、模板名称、模块顺序、模块展示状态。
- 前置依赖：模块 1
- 当前状态：已实现

### Step 1：[DONE] 定义双语字段模型
- **scope: auto**
- 操作：在 `src/types/resume.ts` 中定义 `interface BilingualText { zh: string; en: string }`。
- 验证：`npm run build`

### Step 2：[DONE] 定义个人信息模型
- **scope: auto**
- 操作：在 `src/types/resume.ts` 中定义 `interface PersonalInfo`。
- 验证：`npm run build`

### Step 3：[DONE] 定义简历模块模型
- **scope: auto**
- 操作：在 `src/types/resume.ts` 中定义 `Education/Honor/Experience/Project/CampusActivity/SkillCategory/ResumeData`。
- 验证：`npm run build`

### Step 4：[DONE] 定义布局与模板枚举
- **scope: auto**
- 操作：在 `src/types/resume.ts` 中定义 `TemplateName`、`SectionKey`、`SectionEmphasis`、`DEFAULT_SECTION_ORDER`、`SECTION_LABELS`、`TEMPLATE_NAMES`。
- 验证：`npm run build`

---

## 模块 3：状态管理

### 概述
- 职责：集中管理简历数据、模板、语言、当前编辑区、模块顺序、模块展示状态。
- 前置依赖：模块 2
- 当前状态：已实现

### Step 1：[DONE] 创建 Zustand store
- **scope: auto**
- 操作：在 `src/store/useResumeStore.ts` 中定义 `ResumeState` 与 `useResumeStore`。
- 验证：`npm run build`

### Step 2：[DONE] 实现个人信息与通用字段更新
- **scope: auto**
- 操作：在 `src/store/useResumeStore.ts` 中实现 `setField()` 与 `setPersonalInfo()`。
- 验证：`npm run build`

### Step 3：[DONE] 实现数组模块 CRUD action
- **scope: auto**
- 操作：在 `src/store/useResumeStore.ts` 中实现教育、荣誉、经历、项目、校园经历、技能的 add/update/remove action。
- 验证：`npm run build`

### Step 4：[DONE] 实现布局/语言/模板 action
- **scope: auto**
- 操作：在 `src/store/useResumeStore.ts` 中实现 `setTemplate()`、`setSectionOrder()`、`setEmphasis()`、`setActiveLanguage()`、`setActiveSection()`。
- 验证：`npm run build`

### Step 5：[DONE] 实现数据加载与持久化兼容
- **scope: auto**
- 操作：在 `src/store/useResumeStore.ts` 中实现 `loadResumeData()`、`loadDemoData()`、`resetResumeData()`、Zustand `persist.merge`。
- 验证：`npm run build`，浏览器刷新后数据保持

---

## 模块 4：编辑器 UI

### 概述
- 职责：左侧分区表单，支持编辑简历各模块。
- 前置依赖：模块 2、模块 3
- 当前状态：已实现

### Step 1：[DONE] 实现编辑器分区入口
- **scope: auto**
- 操作：在 `src/components/editor/SidebarEditor.tsx` 中实现 tab 切换与 section 渲染。
- 验证：点击 7 个 tab 均显示对应表单

### Step 2：[DONE] 实现个人信息表单
- **scope: auto**
- 操作：在 `src/components/editor/PersonalInfoForm.tsx` 中实现个人信息输入。
- 验证：修改字段后右侧预览实时更新

### Step 3：[DONE] 实现教育经历表单
- **scope: auto**
- 操作：在 `src/components/editor/EducationForm.tsx` 中实现教育经历 CRUD 与字段输入。
- 验证：新增教育经历并填写课程后预览显示课程

### Step 4：[DONE] 实现荣誉奖项表单
- **scope: auto**
- 操作：在 `src/components/editor/HonorForm.tsx` 中实现荣誉 CRUD 与字段输入。
- 验证：`npm run build`

### Step 5：[DONE] 实现实习经历表单
- **scope: auto**
- 操作：在 `src/components/editor/ExperienceForm.tsx` 中实现经历 CRUD 与亮点输入。
- 验证：`npm run build`

### Step 6：[DONE] 实现项目经历表单
- **scope: auto**
- 操作：在 `src/components/editor/ProjectForm.tsx` 中实现项目 CRUD、技术栈、链接输入。
- 验证：`npm run build`

### Step 7：[DONE] 实现校园经历表单
- **scope: auto**
- 操作：在 `src/components/editor/CampusActivityForm.tsx` 中实现校园经历 CRUD 与亮点输入。
- 验证：`npm run build`

### Step 8：[DONE] 实现技能表单
- **scope: auto**
- 操作：在 `src/components/editor/SkillForm.tsx` 中实现技能分类与技能项输入。
- 验证：`npm run build`

### Step 9：[DONE] 新增通用逐项输入组件 TagInput
- **scope: auto**
- 操作：维护 `src/components/editor/TagInput.tsx`，用于 `string[]` 逐项编辑。
- 验证：课程、技能、技术栈可逐项新增/删除

### Step 10：[DONE] 新增双语亮点逐项输入组件 BilingualListInput
- **scope: auto**
- 操作：维护 `src/components/editor/BilingualListInput.tsx`，用于 `BilingualText[]` 逐项编辑。
- 验证：实习/校园经历亮点可逐条新增/删除

### Step 11：[DONE] 新增模块展示控制组件 LayoutControls
- **scope: auto**
- 操作：维护 `src/components/editor/LayoutControls.tsx`，控制 section 显示/隐藏。
- 验证：隐藏某模块后预览不显示该模块

---

## 模块 5：简历预览与模板系统

### 概述
- 职责：渲染 A4 比例简历预览，支持 4 套模板、双语、模块顺序、模块隐藏。
- 前置依赖：模块 2、模块 3
- 当前状态：已实现

### Step 1：[DONE] 实现预览容器
- **scope: auto**
- 操作：在 `src/components/preview/PreviewPanel.tsx` 中实现 dynamic import、`id="resume-preview"`、`resume-print-area`、A4 预览尺寸。
- 验证：`npm run build`

### Step 2：[DONE] 实现 Classic 模板
- **scope: auto**
- 操作：维护 `src/components/templates/ClassicTemplate.tsx`。
- 验证：选择 Classic 模板，所有非空模块显示

### Step 3：[DONE] 实现 Modern 模板
- **scope: auto**
- 操作：维护 `src/components/templates/ModernTemplate.tsx`。
- 验证：选择 Modern 模板，左侧/右侧布局正常

### Step 4：[DONE] 实现 Minimal 模板
- **scope: auto**
- 操作：维护 `src/components/templates/MinimalTemplate.tsx`。
- 验证：`npm run build`

### Step 5：[DONE] 实现 Compact 模板
- **scope: auto**
- 操作：维护 `src/components/templates/CompactTemplate.tsx`。
- 验证：`npm run build`

### Step 6：[DONE] 新增模板设计 token
- **scope: review**
- 操作：维护 `src/lib/templates/designTokens.ts`。
- 验证：四套 Web 模板视觉无明显回退

### Step 7：[DONE] 建立字段展示矩阵并落地到模板
- **scope: review**
- 操作：维护模板字段展示策略，确保已采集字段在模板中有明确展示/隐藏决策。
- 验证：项目链接、描述、亮点等字段行为符合展示策略

---

## 模块 6：导入导出

### 概述
- 职责：支持 JSON 导入导出、SVG 导出、浏览器打印 PDF 导出、实验性 React PDF 导出。
- 前置依赖：模块 2、模块 3、模块 5
- 当前状态：已实现，但 PDF 主链路需从 `@react-pdf/renderer` 改为浏览器打印

### Step 1：[DONE] 实现导出栏
- **scope: auto**
- 操作：在 `src/components/export/ExportBar.tsx` 中实现 PDF、打印、SVG、JSON、导入、示例、重置按钮。
- 变更说明：v2 保留历史实现；实际主链路调整放到 Step 6。
- 验证：页面顶部导出栏按钮可见

### Step 2：[DONE] 实现 JSON 导入导出
- **scope: auto**
- 操作：在 `src/lib/export/json.ts` 中实现 `exportToJSON()`、`importFromJSON()`、`downloadJSON()`、`mergeWithDefaults()`。
- 验证：导出 JSON 后重新导入，页面数据恢复且不崩溃

### Step 3：[DONE] 实现 SVG 导出
- **scope: review**
- 操作：在 `src/lib/export/svg.ts` 中实现 SVG 字符串生成与下载。
- 验证：点击 SVG 后下载文件，SVG 文件可在浏览器打开

### Step 4：[DONE] 实现 React PDF 导出
- **scope: review**
- 操作：在 `src/lib/export/pdf.tsx` 中实现 `createResumePDF()` 与四套 PDF 模板。
- 变更说明：v2 中此功能降级为实验能力，不再作为主导出链路。
- 验证：本轮不再以 React PDF 视觉一致性作为验收目标

### Step 5：[DONE] 实现浏览器打印导出页
- **scope: review**
- 操作：在 `src/app/export/page.tsx` 中实现打印导出页。
- 变更说明：v1 使用 query string 传递数据；v2 必须改为 sessionStorage payload。
- 验证：旧 query string 验证废弃，以 Step 7 验证为准

### Step 6：切换导出栏主链路为浏览器打印
- **scope: review**
- 操作：
  - 修改 `src/components/export/ExportBar.tsx`
  - 将主按钮点击逻辑改为新的浏览器打印主链路
  - 新增或改造函数：
    - `buildPrintPayload(store): PrintPayload`
    - `handlePrintPDF()`
  - `handlePrintPDF()` 写入 `sessionStorage.setItem("resume-export-payload", JSON.stringify(payload))`
  - 打开 `/export`，不再拼接 `data/template/sectionOrder/emphasis/language` query string
  - 原 `handleExportPDF()` 不作为主按钮使用
- PrintPayload 结构：
  ```ts
  interface PrintPayload {
    data: ResumeData;
    template: TemplateName;
    sectionOrder: SectionKey[];
    emphasis: Partial<Record<SectionKey, SectionEmphasis>>;
    language: "zh" | "en";
    createdAt: number;
  }
  ```
- 验证：
  - `npm run build`
  - 点击主按钮后打开 `/export`，URL 不包含 `data=`
  - 主按钮不再触发 `@react-pdf/renderer`

### Step 7：改造 `/export` 为 sessionStorage 打印页
- **scope: review**
- 操作：
  - 修改 `src/app/export/page.tsx`
  - 删除 query string 解析逻辑：`new URLSearchParams(window.location.search)`、`decodeURIComponent(data)`
  - 新增 `readPrintPayload()`：
    - 从 `sessionStorage.getItem("resume-export-payload")` 读取
    - JSON parse 失败时设置错误态
    - payload 缺失时显示“未找到导出数据，请返回主页面重新导出”
  - payload 成功读取后调用：
    - `loadResumeData(payload.data)`
    - `setTemplate(payload.template)`
    - `setSectionOrder(payload.sectionOrder)`
    - `setEmphasis(payload.emphasis)`
    - `setActiveLanguage(payload.language)`
  - 渲染完成后调用 `window.print()`
  - 监听 `afterprint`，不强制 `window.close()`
  - 打印触发后可清理 `sessionStorage.removeItem("resume-export-payload")`
- 验证：
  - `npm run build`
  - 手动访问 `/export` 且无 payload 时显示错误态
  - 从主页面点击导出时自动打开打印预览
  - 控制台无 JSON parse 报错

### Step 8：修正打印 CSS 使打印页与 Web 预览一致
- **scope: review**
- 操作：
  - 修改 `src/app/globals.css`
  - 在 `@media print` 中明确：
    - `html, body { width: 210mm; min-height: 297mm; background: white !important; }`
    - `.no-print { display: none !important; }`
    - `.print-container { margin: 0 !important; padding: 0 !important; display: block !important; }`
    - `#resume-preview.resume-print-area { width: 210mm !important; min-height: 297mm !important; box-shadow: none !important; margin: 0 auto !important; }`
  - 保留 `@page { size: A4; margin: 0; }`
  - 不改四套模板内部排版，除非打印模式下出现明显页面裁切
- 验证：
  - Chrome 打印预览中选择 A4、边距无，简历版心不被裁切
  - Classic/Modern/Minimal/Compact 四套模板打印预览与 Web 预览基本一致

### Step 9：降级 React PDF 入口与文案
- **scope: auto**
- 操作：
  - 修改 `src/components/export/ExportBar.tsx`
  - React PDF 入口如保留，必须：
    - 使用 secondary 样式
    - 文案为“实验PDF”或 `t("export.experimentalPdf")`
    - title 明确说明“可能与 Web 预览不完全一致”
  - 如隐藏入口，删除未使用 import：
    - `pdf`
    - `createResumePDF`
    - 未使用的 `exporting === "pdf"` 状态分支
- 验证：
  - `npm run lint`
  - `npm run build`
  - 页面主路径只展示一个明确的 PDF 导出主按钮

### Step 10：记录已修复问题
- **scope: auto**
- 操作：
  - 修改 `docs/issues.md`
  - 追加 `[Fixed] I-4-browser-print-mainline — 2026-05-02`
  - 说明：PDF 主链路已切换为浏览器打印；URL payload 已改为 sessionStorage；React PDF 降级
  - 如 `docs/report.md` 不存在，本轮补建，记录执行摘要与验证结果
- 验证：
  - `docs/issues.md` 包含 fixed 记录
  - `docs/report.md` 存在并包含 STATUS

---

## 模块 7：国际化

### 概述
- 职责：提供编辑器和导出栏文案的中英文词典。
- 前置依赖：模块 1
- 当前状态：部分实现，已做基础修正

### Step 1：[DONE] 实现词典文件
- **scope: auto**
- 操作：维护 `src/lib/i18n/zh.ts` 与 `src/lib/i18n/en.ts`。
- 验证：`npm run build`

### Step 2：[DONE] 实现翻译函数
- **scope: auto**
- 操作：维护 `src/lib/i18n/index.ts`。
- 验证：点击语言按钮后导出栏/编辑器文案与当前语言一致；`npm run build`

---

## 模块 8：视觉测试

### 概述
- 职责：验证模板在不同语言/模板下的视觉一致性，以及导出主链路可用性。
- 前置依赖：模块 1、模块 5、模块 6
- 当前状态：视觉 snapshot 已重建，但导出测试仍需跟随 v2 主链路调整

### Step 1：[DONE] 配置 Playwright 基础环境
- **scope: auto**
- 操作：维护 `playwright.config.ts`。
- 验证：`npx playwright test --list`

### Step 2：[DONE] 重建视觉测试文件
- **scope: review**
- 操作：维护 `tests/visual.spec.ts`，覆盖 4 模板 × 中英文 snapshot。
- 验证：`npm run test:visual`

### Step 3：[DONE] 新增 PDF 下载验收测试
- **scope: review**
- 操作：历史步骤，当前测试验证 `@react-pdf/renderer` 下载。
- 变更说明：v2 中该验收方向废弃，以 Step 5 替代。
- 验证：本轮不再要求以原生 PDF 下载作为主验收

### Step 4：[DONE] 新增模块隐藏验收测试
- **scope: auto**
- 操作：维护 `tests/visual.spec.ts` 中模块隐藏测试。
- 验证：隐藏校园经历后预览不包含对应文本

### Step 5：改造导出验收测试为浏览器打印主链路
- **scope: review**
- 操作：
  - 修改 `tests/visual.spec.ts`
  - 删除或跳过 “one click PDF export triggers download” 对原生 PDF 下载的断言
  - 新增测试：`print export opens clean export page`
    - 从 `/` 进入
    - 点击主 PDF 导出按钮
    - 捕获新页面
    - 断言新页面 URL path 为 `/export`
    - 断言新页面 URL 不包含 `data=`
    - 断言新页面 `#resume-preview` 可见
  - 新增测试：`export page without payload shows error`
    - 直接访问 `/export`
    - 断言出现“未找到导出数据”或等价错误文案
  - 如 Playwright 环境中 `window.print()` 影响测试稳定性，在测试启动前使用：
    ```ts
    await page.addInitScript(() => {
      window.print = () => window.dispatchEvent(new Event("resume-print-called"));
    });
    ```
- 验证：
  - `npm run test:visual`
  - `npm run build`

---

## 当前验收基线

- [x] `npm install` 可安装依赖
- [x] `npm run dev` 可启动 Web 应用
- [x] 主页面可编辑并实时预览简历
- [x] 支持 Classic / Modern / Minimal / Compact 四套模板
- [x] 支持 JSON 导入导出
- [x] 支持 SVG 导出
- [x] 支持 React PDF 实验导出
- [ ] 主 PDF 导出按钮走浏览器打印
- [ ] `/export` 使用 sessionStorage 读取导出 payload
- [ ] `/export` 自动触发 `window.print()`
- [ ] 打印预览与 Web `#resume-preview` 基本一致
- [ ] 导出主链路 Playwright 测试通过
- [ ] `docs/report.md` 补建并记录本轮执行结果
