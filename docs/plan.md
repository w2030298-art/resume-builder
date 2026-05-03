# 开发计划（当前 Web 版基线）

## 元信息
- 项目：resume-builder
- 版本：v3
- 技术栈：Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + Zustand 5
- 当前目标：在 v2 浏览器打印导出基线之上，修复审计发现的验收问题，并新增“开发环境本地后台进程关闭”能力。
- 本轮策略：
  - 先修复审计报告中的 High / Medium 问题，恢复可复现验收。
  - 明确确认：关闭网页标签页不会同步关闭 `npm run dev` 启动的 Next.js 后台进程。
  - 新增网页端“关闭后台”按钮，通过 dev-only API 让本地 Node 进程在响应后退出。
  - 不做关闭标签页自动 kill 进程；浏览器 unload 请求不可靠，且误关标签会杀开发服务。
  - 不在本轮删除 `@react-pdf/renderer`；仅保留为后续 cleanup 决策。
- 总模块数：9
- 预计步骤总数：56
- 建议开发顺序：模块 1 Step 4 → 模块 8 Step 6 → 模块 6 Step 11 → 模块 7 Step 3 → 模块 9 Step 1 → 模块 9 Step 2 → 模块 9 Step 3 → 模块 9 Step 4 → 模块 9 Step 5
- 创建日期：2026-05-01
- 最后更新：2026-05-02

### 变更记录
| 版本 | 日期 | 变更摘要 |
|------|------|---------|
| v1 | 2026-05-01 | 补建当前 Web 版 MVP 基线 |
| v2 | 2026-05-02 | PDF 主链路改为浏览器打印；URL query payload 改为 sessionStorage；`@react-pdf` 降级；补打印导出测试 |
| v3 | 2026-05-02 | 修复 Playwright webServer / popup print mock / print payload guard；新增开发环境关闭后台进程按钮 |

## Status
> 任何 agent 读到此区块即可恢复完整上下文。

- 当前阶段：模块 1：项目基础与运行配置 Step 4
- 整体进度：47 / 56 步骤完成
- 状态：变更后待执行
- 阻塞项：无
- 当前决策：
  - `@react-pdf/renderer` 仍不作为主 PDF 导出链路。
  - Playwright 视觉测试必须可自启动 dev server，`npm run test:visual` 必须成为可复现验收命令。
  - 关闭网页标签页不等价于关闭后台进程；本轮只实现显式“关闭后台”按钮。
  - 关闭后台能力仅限本地开发环境，不能在生产环境暴露可远程杀进程的接口。
  - 关闭后台按钮必须经过确认弹窗，避免误触。

### Last Iteration Summary
- v2 已完成浏览器打印导出主链路：
  - `ExportBar.tsx` 主按钮写入 `sessionStorage` 并打开 `/export`。
  - `/export/page.tsx` 从 `sessionStorage` 读取 payload 并自动 `window.print()`。
  - `globals.css` 已设置 A4 打印约束。
  - `tests/visual.spec.ts` 已改为打印导出主链路测试。
- 审计发现：
  - `playwright.config.ts` 缺 `webServer`，导致 `npm run test:visual` 无法自启动 dev server。
  - popup 页面中的 `window.print()` mock 注入不可靠。
  - `/export` 读取 payload 时缺少 shape guard。
  - `ExportBar.tsx` 仍有少量硬编码中文反馈。
- 用户新增需求：
  - 先确认现有项目关闭网页时是否会同步关闭后台进程。
  - 如不能，网页端增加关闭后台进程按钮。

### Pending Decisions
- 是否在后续版本彻底删除 `src/lib/export/pdf.tsx` 与 `@react-pdf/renderer` 依赖：本轮不决定。
- 是否将 SVG 导出也改为浏览器/DOM 捕获路线：本轮不决定。
- 是否增加“关闭标签页时自动尝试关闭后台”的实验功能：本轮不做；如后续要做，需单独评估 `navigator.sendBeacon()`、误触风险与浏览器兼容性。

---

## 模块 1：项目基础与运行配置

### 概述
- 职责：Next.js 前端骨架、脚本、依赖、基础样式入口、测试运行基础设施。
- 前置依赖：无
- 当前状态：已实现；本轮新增测试 webServer 修复。

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

### Step 4：修复 Playwright 自动启动 dev server
- **scope: auto**
- 变更说明：v3 新增；对应审计 H-1。
- 操作：
  - 修改 `playwright.config.ts`。
  - 在 `defineConfig({ ... })` 顶层增加：
    ```ts
    webServer: {
      command: "npm run dev",
      url: "http://localhost:3001",
      reuseExistingServer: true,
      timeout: 120_000,
    },
    ```
  - 保持 `use.baseURL` 默认值为 `process.env.APP_URL || "http://localhost:3001"`。
  - 不修改 `package.json` 的 `dev: "next dev -p 3001"`，除非端口发生冲突。
- 验证：
  - `npx playwright test --list`
  - 不手动启动 dev server，直接运行 `npm run test:visual`，不再出现 `ERR_CONNECTION_REFUSED`

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
- 当前状态：浏览器打印主链路已完成；本轮补 payload guard 与审计发现的健壮性问题。

### Step 1：[DONE] 实现导出栏
- **scope: auto**
- 操作：在 `src/components/export/ExportBar.tsx` 中实现 PDF、打印、SVG、JSON、导入、示例、重置按钮。
- 变更说明：v2 已将主链路调整到 Step 6。
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
- 变更说明：v2 已从 query string 改为 sessionStorage payload。
- 验证：以 Step 7 和 Step 11 验证为准

### Step 6：[DONE] 切换导出栏主链路为浏览器打印
- **scope: review**
- 操作：修改 `src/components/export/ExportBar.tsx`，主按钮写入 `sessionStorage.setItem("resume-export-payload", JSON.stringify(payload))` 并打开 `/export`。
- 验证：点击主按钮后打开 `/export`，URL 不包含 `data=`

### Step 7：[DONE] 改造 `/export` 为 sessionStorage 打印页
- **scope: review**
- 操作：修改 `src/app/export/page.tsx`，删除 query string 读取，改从 `sessionStorage` 读取 payload，渲染完成后调用 `window.print()`。
- 验证：从主页面点击导出时自动打开打印预览

### Step 8：[DONE] 修正打印 CSS 使打印页与 Web 预览一致
- **scope: review**
- 操作：修改 `src/app/globals.css`，在 `@media print` 中明确 A4 尺寸、隐藏 `.no-print`、保留 `@page { size: A4; margin: 0; }`。
- 验证：Chrome 打印预览中选择 A4、边距无，简历版心不被裁切

### Step 9：[DONE] 降级 React PDF 入口与文案
- **scope: auto**
- 操作：修改 `src/components/export/ExportBar.tsx`，隐藏或降级 React PDF 入口，删除未使用 import。
- 验证：`npm run lint && npm run build`

### Step 10：[DONE] 记录已修复问题
- **scope: auto**
- 操作：修改 `docs/issues.md`，追加 `[Fixed] I-4-browser-print-mainline — 2026-05-02`；补建 `docs/report.md`。
- 验证：`docs/issues.md` 包含 fixed 记录，`docs/report.md` 存在并包含 STATUS

### Step 11：为 `/export` sessionStorage payload 增加 shape guard
- **scope: auto**
- 变更说明：v3 新增；对应审计 M-2。
- 操作：
  - 修改 `src/app/export/page.tsx`。
  - 新增：
    ```ts
    function isRecord(value: unknown): value is Record<string, unknown>
    function isTemplateName(value: unknown): value is TemplateName
    function isLanguage(value: unknown): value is "zh" | "en"
    function isSectionOrder(value: unknown): value is SectionKey[]
    function isPrintPayload(value: unknown): value is PrintPayload
    ```
  - `isPrintPayload()` 至少校验：
    - `data` 是 object。
    - `template` 属于 `classic | modern | minimal | compact`。
    - `sectionOrder` 是数组。
    - `language` 属于 `zh | en`。
    - `emphasis` 是 object 或缺省时可用 `{}`。
  - `readPrintPayload()` 中 JSON parse 成功但 shape 不合法时，走现有错误态，不调用 `loadResumeData()`。
  - 对缺失、损坏、不合法 payload 统一显示“未找到导出数据，请返回主页面重新导出”或对应 i18n 文案。
  - 对不合法 payload 可执行 `sessionStorage.removeItem("resume-export-payload")`，避免反复失败。
- 验证：
  - `npm run build`
  - 直接访问 `/export` 显示错误态
  - 在 DevTools 手动写入损坏 payload 后访问 `/export`，不崩溃、不进入无限 loading

---

## 模块 7：国际化

### 概述
- 职责：提供编辑器、导出栏、运行控制文案的中英文词典。
- 前置依赖：模块 1
- 当前状态：基础已实现；本轮补齐导出反馈与关闭后台文案。

### Step 1：[DONE] 实现词典文件
- **scope: auto**
- 操作：维护 `src/lib/i18n/zh.ts` 与 `src/lib/i18n/en.ts`。
- 验证：`npm run build`

### Step 2：[DONE] 实现翻译函数
- **scope: auto**
- 操作：维护 `src/lib/i18n/index.ts`。
- 验证：点击语言按钮后导出栏/编辑器文案与当前语言一致；`npm run build`

### Step 3：补齐导出反馈与运行控制 i18n key
- **scope: auto**
- 变更说明：v3 新增；对应审计 L-1，并为模块 9 提供按钮文案。
- 操作：
  - 修改 `src/lib/i18n/zh.ts` 和 `src/lib/i18n/en.ts`。
  - 在 `export` 下新增 key：
    - `popupBlocked`
    - `svgFailed`
    - `importSuccess`
    - `importFailed`
  - 新增 `runtime` 分组：
    - `shutdown`
    - `shutdownTitle`
    - `shutdownConfirm`
    - `shutdownStarting`
    - `shutdownFailed`
    - `shutdownUnavailable`
  - 修改 `src/components/export/ExportBar.tsx` 中硬编码反馈：
    - `"请允许弹出窗口以导出PDF"` → `t("export.popupBlocked")`
    - `"SVG 导出失败"` → `t("export.svgFailed")`
    - `"导入成功"` → `t("export.importSuccess")`
    - `"无法解析该 JSON 文件"` → `t("export.importFailed")`
- 验证：
  - `npm run lint`
  - `npm run build`
  - 切换中英文后触发导出/导入错误反馈，文案语言一致

---

## 模块 8：视觉测试

### 概述
- 职责：验证模板在不同语言/模板下的视觉一致性，以及导出主链路和本地运行控制入口可用性。
- 前置依赖：模块 1、模块 5、模块 6、模块 9
- 当前状态：视觉 snapshot 已重建；本轮修复测试运行基础设施与 popup print mock。

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

### Step 5：[DONE] 改造导出验收测试为浏览器打印主链路
- **scope: review**
- 操作：修改 `tests/visual.spec.ts`，新增 `/export` clean URL、`#resume-preview` 可见、无 payload 错误态测试。
- 验证：以 Step 6 修复后的 `npm run test:visual` 为准

### Step 6：稳定 popup print mock 并补充本轮测试
- **scope: review**
- 变更说明：v3 新增；对应审计 M-1，并覆盖模块 9 的 UI 行为。
- 操作：
  - 修改 `tests/visual.spec.ts`。
  - 将当前测试中的：
    ```ts
    await page.addInitScript(() => {
      window.print = () => window.dispatchEvent(new Event("resume-print-called"));
    });
    ```
    改为在 popup 创建前通过 context 注入：
    ```ts
    await page.context().addInitScript(() => {
      window.print = () => window.dispatchEvent(new Event("resume-print-called"));
    });
    ```
  - 确保该 init script 覆盖新打开的 `/export` popup 页面。
  - 在 `print export opens clean export page` 中：
    - `await expect(newPage.locator("#resume-preview")).toBeVisible()`
    - 可选监听 `resume-print-called`，但不要因事件时序造成 flaky。
  - 新增测试：`export page with invalid payload shows error`
    - 访问 `/export` 前写入损坏或 shape 不合法的 `sessionStorage` payload。
    - 断言错误态出现。
  - 新增测试：`shutdown button calls local shutdown endpoint`
    - 使用 `page.route("**/api/runtime/shutdown", route => route.fulfill(...))` mock 接口，不能真的杀 Playwright webServer。
    - 接受确认弹窗。
    - 点击“关闭后台 / Stop server”按钮。
    - 断言 mock endpoint 被调用，按钮进入关闭中或反馈成功态。
- 验证：
  - 不手动启动 dev server，直接运行 `npm run test:visual`
  - `npm run build`

---

## 模块 9：本地后台进程控制

### 概述
- 职责：确认并显式控制本地开发后台进程关闭行为。提供网页端按钮，请求本地 Next.js API route 在响应后退出 Node 进程。
- 前置依赖：模块 1、模块 7
- 当前状态：v3 新增
- 非目标：
  - 不在生产环境暴露远程关闭服务接口。
  - 不实现关闭标签页自动关闭后台。
  - 不处理除当前 Next.js Node 进程之外的外部进程树；如 `npm` 父进程残留，由终端/系统负责回收。

### Step 1：确认关闭网页不会同步关闭后台进程
- **scope: auto**
- 操作：
  - 启动项目：
    ```bash
    npm run dev
    ```
  - 打开 `http://localhost:3001`。
  - 关闭浏览器标签页或整个浏览器窗口。
  - 在终端确认 `next dev -p 3001` 仍在运行。
  - 可执行：
    ```bash
    curl -I http://localhost:3001
    ```
    若仍返回 HTTP 响应，说明后台进程未随网页关闭而退出。
  - 修改 `docs/issues.md`，追加：
    ```md
    [Open] I-5-local-dev-process-not-closed-by-browser — 2026-05-02
    关闭浏览器标签页不会停止 `npm run dev` 启动的 Next.js 后台进程；需要显式关闭入口。
    ```
- 验证：
  - `curl -I http://localhost:3001` 在关闭网页后仍有响应
  - `docs/issues.md` 包含 I-5 记录

### Step 2：新增 dev-only shutdown API route
- **scope: review**
- 操作：
  - 新建 `src/app/api/runtime/shutdown/route.ts`。
  - 文件必须显式使用 Node runtime：
    ```ts
    export const runtime = "nodejs";
    export const dynamic = "force-dynamic";
    ```
  - 实现 `POST()`：
    - 若 `process.env.NODE_ENV !== "development"`，返回 `403`：
      ```json
      { "ok": false, "reason": "unavailable" }
      ```
    - 开发环境中返回：
      ```json
      { "ok": true, "shuttingDown": true }
      ```
    - 在响应创建后使用 `setTimeout(() => process.exit(0), 250)` 退出当前 Node 进程。
  - 可选但建议：要求请求头 `x-resume-builder-runtime-action: shutdown`，不满足时返回 `400`，减少误调用。
  - 不实现 `GET` 关闭能力。
  - 不在 API route 中读取或修改简历数据。
- 验证：
  - `npm run build`
  - 开发环境启动后执行：
    ```bash
    curl -X POST -H "x-resume-builder-runtime-action: shutdown" http://localhost:3001/api/runtime/shutdown
    ```
    返回 ok 后，`npm run dev` 进程退出
  - 生产 build 中接口不允许关闭，至少代码路径返回 `403`

### Step 3：新增网页端关闭后台按钮
- **scope: auto**
- 操作：
  - 新建 `src/lib/runtime/shutdown.ts`：
    ```ts
    export async function requestRuntimeShutdown(): Promise<{ ok: boolean; reason?: string }> {
      const response = await fetch("/api/runtime/shutdown", {
        method: "POST",
        headers: { "x-resume-builder-runtime-action": "shutdown" },
      });
      return response.json();
    }
    ```
  - 新建 `src/components/runtime/ShutdownButton.tsx`。
  - `ShutdownButton` 行为：
    - 仅在 `process.env.NODE_ENV === "development"` 时渲染；否则返回 `null`。
    - 按钮文案使用 `t("runtime.shutdown")`。
    - 点击时先 `confirm(t("runtime.shutdownConfirm"))`。
    - 用户确认后：
      - 禁用按钮。
      - 调用 `requestRuntimeShutdown()`。
      - 成功时显示 `t("runtime.shutdownStarting")`。
      - 失败或异常时恢复按钮并显示 `t("runtime.shutdownFailed")`。
    - 按钮样式使用 `btn-danger text-xs px-3 py-1.5`。
  - 修改 `src/components/export/ExportBar.tsx`：
    - `import { ShutdownButton } from "@/components/runtime/ShutdownButton";`
    - 将 `<ShutdownButton />` 放在右侧操作区，建议位于“重置”按钮之后。
  - 不把关闭后台按钮放进打印页；该按钮必须在 `.no-print` 区域。
- 验证：
  - `npm run lint`
  - `npm run build`
  - 开发环境主页面可见“关闭后台”按钮
  - 点击取消确认弹窗时不请求 API
  - 点击确认后 dev server 退出，浏览器页面随后显示连接中断或无法继续访问

### Step 4：补充关闭后台按钮测试
- **scope: review**
- 操作：
  - 修改 `tests/visual.spec.ts`。
  - 新增测试：`shutdown button calls local shutdown endpoint`。
  - 测试必须 mock `/api/runtime/shutdown`，不得真实调用并杀死 Playwright webServer：
    ```ts
    let called = false;
    await page.route("**/api/runtime/shutdown", async (route) => {
      called = true;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, shuttingDown: true }),
      });
    });
    ```
  - 在点击按钮前注册确认弹窗处理：
    ```ts
    page.once("dialog", async (dialog) => {
      expect(dialog.type()).toBe("confirm");
      await dialog.accept();
    });
    ```
  - 点击：
    ```ts
    await page.getByRole("button", { name: /关闭后台|Stop server/i }).click();
    ```
  - 断言 `called === true`，并断言页面出现关闭中反馈文案。
- 验证：
  - `npm run test:visual`
  - `npm run build`

### Step 5：更新文档、问题记录与执行报告
- **scope: auto**
- 操作：
  - 修改 `docs/issues.md`：
    - 追加 `[Fixed] H-1-playwright-webserver — 2026-05-02`
    - 追加 `[Fixed] M-1-popup-print-mock — 2026-05-02`
    - 追加 `[Fixed] M-2-print-payload-guard — 2026-05-02`
    - 将 `[Open] I-5-local-dev-process-not-closed-by-browser` 更新为 `[Fixed] I-5-local-dev-shutdown-button`
  - 修改 `docs/report.md`：
    - `STATUS` 更新为 `NEEDS_REVIEW`。
    - `Last Execution` 记录 v3 patch。
    - `Completed` 列出模块 1 Step 4、模块 6 Step 11、模块 7 Step 3、模块 8 Step 6、模块 9 Step 1-4。
    - `Verification Results` 记录：
      - `npm run lint`
      - `npm run build`
      - `npm run test:visual`
      - 手动验证关闭网页不杀进程
      - 手动验证“关闭后台”按钮能停止 dev server
  - 修改 `docs/plan.md` Status：
    - 当前阶段改为模块 9 Step 5 或完成态。
    - 整体进度按实际完成数更新。
- 验证：
  - `docs/issues.md` 有新增 Fixed 记录
  - `docs/report.md` 有 STATUS 与 Verification Results
  - `docs/plan.md` Status 可恢复本轮上下文

---

## 当前验收基线

- [x] `npm install` 可安装依赖
- [x] `npm run dev` 可启动 Web 应用
- [x] 主页面可编辑并实时预览简历
- [x] 支持 Classic / Modern / Minimal / Compact 四套模板
- [x] 支持 JSON 导入导出
- [x] 支持 SVG 导出
- [x] 支持 React PDF 实验导出
- [x] 主 PDF 导出按钮走浏览器打印
- [x] `/export` 使用 sessionStorage 读取导出 payload
- [x] `/export` 自动触发 `window.print()`
- [x] 打印预览与 Web `#resume-preview` 基本一致
- [ ] Playwright `webServer` 自动启动 dev server
- [ ] popup 页面 `window.print()` mock 稳定
- [ ] `/export` 对不合法 payload 有明确错误态
- [ ] 导出反馈文案无硬编码中文
- [ ] 已确认关闭网页不会关闭后台进程
- [ ] 开发环境网页端提供“关闭后台”按钮
- [ ] 点击“关闭后台”按钮可停止 `npm run dev` 后台进程
- [ ] `npm run test:visual` 可不依赖手动 dev server 通过
- [ ] `docs/report.md` 记录本轮执行结果
