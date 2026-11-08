# 验收记录

日期均使用 Asia/Shanghai。各项分别注明 Owner 实际运行、Owner 人工确认以及助手临时构建或 UI 验证的来源；未验证项不记为通过。

## Issue #01：Monorepo 初始化

- 初始化提交：`b7337cd chore: initialize monorepo structure`。
- 主目录、说明文件、执行手册与不含秘密的配置示例已提交。
- `.env`、前端依赖目录、后端构建目录、容器数据目录及 secrets 目录的五项忽略规则检查通过。
- Owner 提供的状态为 `main...origin/main`，当时工作区干净。
- 独立克隆验证：Owner 明确决定跳过，未记为通过。
- 许可证：待确认，尚未授予开源许可证。

结论：本地初始化与远端关联已记录，克隆复现项跳过；许可证保持明确的待确认状态。

## Issue #02：后端初始化

- 验证日期：2026-11-05。
- 执行人：项目 Owner。
- 开发分支：`chore/backend-bootstrap`。
- 后端代码提交：`4ac2590`；PR #1 已合并，main 合并提交为 `aafebcb`。
- 原始构建与 HTTP 证据来自提交前的后端工作区。
- 版本：Spring Boot 4.1.2、Maven 3.10.0、JDK 21.0.13.0.3；详见 [环境记录](ENVIRONMENT.md)。

### 构建与测试

在 backend/ 目录执行 `./mvnw -B -V verify`。
Owner 提供的完整日志结束时间为 `2026-11-05T01:13:04+08:00`：

- `BUILD SUCCESS`。
- 测试 1 项，失败 0，错误 0，跳过 0。
- 执行的是应用上下文加载测试 `FleetControlBackendApplicationTests`。
- 可执行 JAR 打包成功：`target/fleet-control-backend-0.0.1-SNAPSHOT.jar`。

### 实际 HTTP 检查

后端启动后，Owner 使用 curl 验证：

| 请求 | 实际结果 | 结论 |
| --- | --- | --- |
| GET /api/v1/system/info | HTTP 200；application 为 vllm-fleet-control，stage 为 M0 | 通过 |
| GET /actuator/health | HTTP 200；status 为 UP，并包含 liveness、readiness 分组 | 通过 |

当前配置监听 `127.0.0.1:8080`，Actuator 仅开放 health，健康明细设置为 never。

### 遗留事项与边界

- 测试日志存在 Mockito / Java agent 动态加载警告，本次测试仍通过；警告尚未修复。
- 当前验证未覆盖非法参数的 Validation 行为、登录鉴权或数据库连接。
- 应用健康结果不能代表 PostgreSQL、Router 或 vLLM 健康。
- 后端初始化代码已通过 PR #1 合并至 main。

结论：Issue #02 的基础构建、应用上下文测试和最小 API 运行验证通过，代码已合并。

## Issue #03：PostgreSQL 与 Flyway

- 验证日期：2026-11-08。
- 执行人：项目 Owner。
- 分支：feat/postgres-flyway，基于 main 合并提交 aafebcb。
- 代码提交 a472c1b；PR #2 已合并，main 合并提交为 1f9b467。
- 记录对应包含 V1 迁移与环境变量密码配置的 Issue #03 变更；提交与 PR 状态以 Git 历史为准。

### 远端数据库

Owner 在 Fedora 的 sudo Podman 环境验证：

- PostgreSQL 17.11，容器状态 healthy。
- 宿主机发布地址 127.0.0.1:5432。
- pg_isready 返回 accepting connections，此项仅证明服务就绪。
- 未安装 Mac psql 客户端；Owner 明确跳过了独立客户端查询，后续通过后端验证连接。

### 首次迁移

Owner 提供的 IDEA 日志在 2026-11-08T20:12:04+08:00 显示：

- Hikari 成功建立 PostgreSQL 连接，目标为 Mac 127.0.0.1:15432 转发端口。
- 初始 public schema 为空，Flyway 创建 flyway_schema_history。
- V1__init_schema.sql 成功执行，schema 升级至版本 1。
- 应用在 8080 端口启动成功。

### 重复启动与最终构建

最终配置已改为通过 DB_PASSWORD 获取密码，助手只检查了占位符是否匹配，未在文档复制密码。
Owner 在已设置该变量的终端执行 ./mvnw -B -V verify，最终日志结束时间为 2026-11-08T20:16:23+08:00：

- Hikari 再次成功连接 PostgreSQL 17.11。
- Successfully validated 1 migration。
- Current version of schema public: 1。
- Schema public is up to date. No migration necessary。
- 应用上下文测试 1 项，失败 0、错误 0、跳过 0。
- 可执行 JAR 打包完成，BUILD SUCCESS。

以上证明首次迁移成功，后续应用上下文启动不重复应用 V1，并且环境变量方式可完成构建。

### 已记录限制

- MyBatis-Plus 3.5.18 仅验证基础装配，尚无 Mapper；未找到 Mapper 的警告仍存在。
- Mockito / Java agent 动态加载警告仍存在。
- 最终构建出现两个附加仓库元数据请求的 HTTP 401 警告，本次构建成功；未将其记为构建失败或干净依赖下载验证通过。
- 初次记录时未补交接入数据库后的 HTTP 健康请求；Issue #04 的恢复检查已补充，见后文。
- 实际 Fedora 部署与仓库示例的目录、文件名和镜像来源存在差异，干净部署与数据卷恢复尚未验证。
- 尚未覆盖失败迁移、业务 Mapper、并发事务和业务数据升级场景。

结论：Issue #03 的数据库连接、首次迁移、重复迁移校验及基础构建通过。记录截至上述验证日志，后续提交和合并进度以 Git 为准。

## Issue #04：前端初始化与真实 API 联调

- 验证日期：2026-11-08。
- 分支：feat/frontend-bootstrap，基于 main 合并提交 1f9b467。
- Owner 确认 UI 方案由 Element Plus 改为 shadcn/vue + Tailwind CSS，记录于 [前端 UI 决策](decisions/0001-frontend-ui.md)。
- 本记录随前端实现提交；提交与合并状态以 Git 历史为准。

### 构建证据

- Owner 提供了首批 shadcn/vue 组件生成后 pnpm run build 的成功日志，其中包含 vue-tsc --build 与 Vite 8.3.6 生产构建。
- 助手将 API 封装、页面及代理配置放入临时副本，使用 Node.js 24 完成 vue-tsc --build 和 Vite build --configLoader runner，均成功。
- 临时副本将 TypeScript 缓存重定向至临时目录，未替换实际工程的 TypeScript 配置。
- 最小页面产物约为 JS 109.73 kB、CSS 28.39 kB，来自该次临时副本构建，不作为未来包大小承诺。
- 收尾时已核对实际工程中的 App.vue、src/api/system.ts 和 vite.config.ts 与已构建脚手架一致。

### 浏览器联调

Owner 提供了页面截图，展示真实 API 响应：

- 管理 API 为已连接。
- 应用标识为 vllm-fleet-control，工程阶段为 M0。
- 请求为 GET /api/v1/system/info，页面展示最近检查时间。

停止后端与恢复的人工检查由 Owner 确认完成；未保存独立的失败状态截图，不将其描述为自动化端到端测试。
当前请求代码具有 5 秒超时、JSON 与字段类型检查；这些错误分支尚未逐项独立实测。

### IDEA 密码配置恢复

- Owner 在恢复后端时遇到 PostgreSQL 28P01 密码认证失败。
- 助手按 Owner 授权，将 DB_PASSWORD 设置至当前 FleetControlBackendApplication 的 IDEA 私有运行配置。
- 已确认私有配置落盘、被 Git 忽略且未被跟踪；应用配置仍使用环境变量占位符。
- 助手从 IDEA 启动应用，2026-11-08T20:57:10+08:00 日志显示数据库连接成功、迁移版本 1 无需再次应用，并且应用启动成功。
- 助手随后通过浏览器访问 /actuator/health，实际响应 status 为 UP，并包含 liveness、readiness 分组。
- Owner 随后确认前端重新检查已完成。

### 边界与后续

- 最小页面只验证管理 API 可达性；应用标识与阶段是后端工程元数据，不是数据库或 vLLM 的持续健康探测。
- 当前没有自动化前端单元测试或端到端测试。
- Node 依赖目录、dist 及 IDEA 私有配置已检查忽略规则，密码不写入记录。
- CI、干净环境复现、生产反向代理、移动端独立验收和字体离线部署尚未完成。

结论：前端基础组件、类型检查、生产构建和真实 API 页面联调已验证，异常与恢复由 Owner 人工确认；代码提交和合并进度以 Git 为准。

## M0 总体状态

尚未完成。后端、数据库迁移与前端基础联调已验证，下一项为 Issue #05：CI 与干净环境复现。
