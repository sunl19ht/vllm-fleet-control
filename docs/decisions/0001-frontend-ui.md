# ADR 0001：使用 shadcn/vue 与 Tailwind CSS

- 状态：Owner 已接受。
- 日期：2026-11-08。
- 对应阶段：M0 / Issue #04。

## 背景

执行手册原先采用 Vue 3、TypeScript 与 Element Plus。
前端初始化时 Owner 提出希望采用更现代、可定制的控制台视觉，并明确选择 shadcn/vue + Tailwind CSS。
现有 Vue 3 + TypeScript + Vite 工程继续使用，Element Plus 依赖已移除。

## 决策

- 基础控件使用 shadcn/vue，生成后的组件源码保存至 src/components/ui/ 并纳入 Git。
- 使用 Reka UI 基础交互组件及 Tailwind CSS 4 的 Vite 插件。
- 当前样式选项为 New York、Neutral、Geist 与 Lucide；页面采用深色背景和青绿色强调色。
- 首批只添加 Button、Card、Badge、Alert，满足 M0 页面和错误提示。
- 依赖由 pnpm-lock.yaml 定位，packageManager 固定 pnpm 11.25.0。
- components.json 保存组件生成配置；后续添加或更新组件时审查生成的源码和依赖差异。

## 影响

- 页面布局与组件样式由项目维护，需要保持主题、交互及错误状态一致。
- 本次不引入图表、复杂动画或资源管理功能；相关需求按后续里程碑推进。
- 后续监控图表仍按既有 ECharts 方向评估，尚未接入。
- 当前 Geist 使用远端字体加载与系统字体回退，离线字体部署尚未验证。
- 执行手册作为历史基线保留原文，当前 UI 选择以本决策为准。

## 验证

基础组件生成、类型检查、生产构建与最小页面 API 联调已记录，见 [验收记录](../ACCEPTANCE.md)。
