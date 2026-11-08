# CI 检查说明

工作流文件：`.github/workflows/ci.yml`。推送、Pull Request 和手动触发时运行两组独立检查。

## 后端

- Ubuntu 24.04、Temurin JDK 21、项目 Maven Wrapper。
- 创建 PostgreSQL `17.11-bookworm` 临时服务，使用空数据库。
- 执行 `./mvnw -B -ntp -V verify`；现有 Spring Boot 上下文测试连接临时数据库并执行 Flyway 迁移。
- 启动打包后的 JAR，检查健康接口为 `UP`、应用标识正确、工程阶段为非空字符串。
- 检查测试和 JAR 启动后，Flyway 历史表中恰好有一条成功的 V1 记录。

CI 的数据库地址和凭据只属于当前临时服务，任务结束后销毁。CI 不连接开发者的 Fedora，不使用 SSH 隧道，也不需要配置真实 `DB_PASSWORD` Secret。

## 前端

- Ubuntu 24.04、Node.js `24.22.2`。
- 从 `frontend/package.json` 的 `packageManager` 字段读取固定 pnpm 版本。
- 执行 `pnpm install --frozen-lockfile`，锁文件与依赖声明不一致时失败。
- 执行 `pnpm run build`，包含 Vue/TypeScript 类型检查与 Vite 构建。

缓存仅用于 Maven 依赖和 pnpm store；每次重新构建，不缓存数据库、`node_modules` 或应用产物。

## 查看与验收

在 GitHub 仓库的 Actions 页面打开对应提交的 `CI` 运行，确认 `Backend checks` 和 `Frontend checks` 都通过，再将运行链接、提交号和结果补入 `docs/ACCEPTANCE.md`。

首次编写工作流时仅完成静态检查；GitHub 实际运行成功前，不应记录为 CI 已通过。

该流程覆盖干净检出的构建、空库迁移、后端测试和打包启动。浏览器交互、SSH 隧道、仓库 Compose 配置的全新部署仍需按相关文档分别验收。

本地启动步骤见仓库根目录、`backend/README.md`、`frontend/README.md` 和 `docs/DATABASE.md`。修改数据库结构时新增迁移文件，不修改已经执行的 V1。
