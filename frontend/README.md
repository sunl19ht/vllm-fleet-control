# 前端

Vue 3 + TypeScript 管理控制台，使用 shadcn/vue 与 Tailwind CSS。
当前提供 M0 基础环境概览页，真实请求 GET /api/v1/system/info，展示应用标识、工程阶段和管理 API 可达性。
推理实例、监控与生命周期操作尚未接入，连接状态不代表 vLLM 实例健康。

## 环境与依赖

- 推荐 Node.js 24 LTS；本次验证使用 24.22.2。
- pnpm 固定为 11.25.0，见 package.json 的 packageManager。
- 提交 pnpm-lock.yaml；复现安装使用冻结锁文件方式。
- 已验证 Vue 3.5.45、Vite 8.3.6、TypeScript 6.0.3、vue-tsc 3.3.14。
- Tailwind CSS 与 Vite 插件均为 4.3.5，Reka UI 2.11.0、Lucide 1.70.0。
- shadcn/vue 的 Button、Card、Badge、Alert 源码位于 src/components/ui/，需要随项目提交。

完整版本与选型见 [环境记录](../docs/ENVIRONMENT.md) 和 [前端 UI 决策](../docs/decisions/0001-frontend-ui.md)。

## 安装、构建与启动

从仓库根目录进入前端：

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm run build
pnpm dev
```

build 同时执行 TypeScript 检查和 Vite 生产构建。只做类型检查可运行 pnpm run type-check。
前端监听 http://127.0.0.1:5173，端口被占用时会退出，不自动换端口。
在启动终端按 Control + C 停止服务。构建输出为 dist/，不纳入 Git。

## 连接后端

浏览器 → Vite 的 /api 代理 → http://127.0.0.1:8080 后端。
代理保持原始路径，不移除 /api 前缀；此设置仅用于 Vite 开发服务器。
生产部署需要单独配置反向代理，不能把 pnpm run build 视为完整部署。

联调前启动数据库 SSH 隧道和后端，见 [后端说明](../backend/README.md)。
前端不需要 DB_PASSWORD，数据库密码只配置在后端终端或 IDEA 私有运行配置中。

## 页面与请求行为

- 进入页面自动检查管理 API，点击重新检查可再次请求；请求期间按钮禁用。
- 请求集中在 src/api/system.ts，使用相对路径 /api/v1/system/info。
- 超时为 5 秒，校验 HTTP 状态、JSON 和 application、stage 字段类型。
- 请求开始时清空旧数据，失败时展示错误提示，不将旧数据保留为当前连接结果。
- 后端恢复后重新检查可恢复显示；具体证据见 [验收记录](../docs/ACCEPTANCE.md)。

该接口当前返回工程元数据，不能据此判断数据库持续健康或推理实例健康。

## 样式

采用 Neutral 基色、深色页面、青绿色强调色，图标使用 Lucide。
主字体 Geist 当前通过 Google Fonts 引入；不可访问时使用系统字体回退，中文使用系统中文字体。
全局样式位于 src/assets/main.css，组件生成选项位于 components.json。

## Git 约定

提交组件源码、components.json、package.json、pnpm-lock.yaml 与前端配置。
node_modules/、dist/、本地 .env 及 IDE 私有配置不提交。
Element Plus 已从当前前端依赖移除；执行手册中的原选型作为历史基线保留，以前端 UI 决策为当前选择。
