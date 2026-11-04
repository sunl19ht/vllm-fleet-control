# 验收记录

日期均使用 Asia/Shanghai。以下执行证据由项目 Owner 提供；文档补录不代表助手重新执行了构建或远端操作。

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
- 验证对象：基于 `b7337cd` 的未提交后端工作区；当前尚无本次后端变更的提交号。
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
- 本次代码尚未提交；提交后应更新验证对象对应的提交记录。

结论：Issue #02 的基础构建、应用上下文测试和最小 API 运行验证通过，提交收尾待完成。

## M0 总体状态

尚未完成。数据库与迁移（Issue #03）、前端真实 API 调用（Issue #04）、CI 与干净环境复现（Issue #05）仍待推进。
