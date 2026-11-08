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

### 已验证运行

2026-11-08（Asia/Shanghai），助手读取 GitHub 页面确认：

| 触发方式 | 对应提交或 PR | 结果 | 运行记录 |
| --- | --- | --- | --- |
| 分支推送 | `771c1ab` | 后端、前端均通过 | [CI #1](https://github.com/sunl19ht/vllm-fleet-control/actions/runs/42484589906) |
| Pull Request | PR #4 | 成功 | [CI #2](https://github.com/sunl19ht/vllm-fleet-control/actions/runs/42484729548) |
| main 合并后推送 | `90ebdee` | 成功 | [CI #3](https://github.com/sunl19ht/vllm-fleet-control/actions/runs/42484779661) |

PR #4 已合并。结果依据 GitHub 页面状态和已提交的工作流；未下载完整作业日志。详细验收边界见 [验收记录](ACCEPTANCE.md)。

该流程覆盖干净检出的构建、空库迁移、后端测试和打包启动。浏览器交互、SSH 隧道、仓库 Compose 配置的全新部署仍需按相关文档分别验收。

本地启动步骤见仓库根目录、`backend/README.md`、`frontend/README.md` 和 `docs/DATABASE.md`。修改数据库结构时新增迁移文件，不修改已经执行的 V1。
