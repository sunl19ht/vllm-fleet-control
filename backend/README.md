# 后端

Spring Boot 管理 API，已接入远端 PostgreSQL 与 Flyway，提供最小信息接口和应用健康检查。
当前仅用于本地开发，登录鉴权、业务 Mapper 与 vLLM 集成尚未实现。

## 已验证版本

| 组件 | 版本 |
| --- | --- |
| JDK | Homebrew OpenJDK 21.0.13.0.3，工程目标为 Java 21 |
| Spring Boot | 4.1.2 |
| Maven / Wrapper | 3.10.0 / 3.3.4 |
| PostgreSQL | 17.11 |
| MyBatis-Plus | 3.5.18，Boot 4 专用 Starter |
| Flyway | 12.4.0 |
| PostgreSQL JDBC | 42.7.14 |

Maven 由 Wrapper 固定，Spring Boot 由 pom.xml 父工程固定，MyBatis-Plus 显式指定版本；Flyway 与 JDBC 版本由 Spring Boot 管理。
后端构件版本仍为 0.0.1-SNAPSHOT，不代表已发布 v0.1.0。

## 连接开发数据库

当前验证链路为：Mac 后端 → 本机 15432 端口 → SSH 隧道 → Fedora 本机 5432 端口 → PostgreSQL 容器。

在第一个 Mac 终端设置实际 SSH 目标并启动隧道：

```bash
export FLEET_DB_SSH_TARGET='your-user@your-db-host'
ssh -N -o ExitOnForwardFailure=yes -o ServerAliveInterval=30 -L 127.0.0.1:15432:127.0.0.1:5432 "$FLEET_DB_SSH_TARGET"
```

保持此终端运行，Control + C 可停止隧道。示例 SSH 目标需要替换为自己的环境，不在仓库保存真实地址。

## 配置环境变量

在第二个 Mac 终端进入 backend/，设置实际数据库名称和用户：

```bash
cd backend
export DB_HOST=127.0.0.1
export DB_PORT=15432
export DB_NAME=fleet_control
export DB_USER=fleet_control
read -r -s "DB_PASSWORD?请输入数据库密码："
printf '\n'
export DB_PASSWORD
```

上述 read 命令适用于 macOS 默认的 zsh，密码输入不回显。变量仅在当前终端及其子进程有效。

| 变量 | 默认值 | 说明 |
| --- | --- | --- |
| DB_HOST | 127.0.0.1 | Mac 上的隧道监听地址 |
| DB_PORT | 15432 | Mac 上的隧道监听端口 |
| DB_NAME | fleet_control | 必须与实际数据库一致 |
| DB_USER | fleet_control | 必须与实际数据库用户一致 |
| DB_PASSWORD | 无 | 必须提供，不写入受 Git 跟踪的配置 |

根目录 .env.example 只说明变量格式，Spring Boot 不会自动读取它。
IDEA 启动时需在该应用的运行配置 Environment variables 中单独设置这些变量；终端中 export 的变量不会自动更新已运行 IDEA 的配置。

## 构建、测试与迁移

在已配置环境变量的 backend/ 终端执行：

```bash
./mvnw -B -V verify
```

首次运行会下载 Maven 与依赖。当前应用上下文测试会连接真实开发数据库，并由 Flyway 执行尚未应用的迁移；运行前应确认连接的是开发库。
本次流程不是无需数据库的离线单元测试。CI 独立测试数据库将在 Issue #05 配置。

首次运行会应用 V1，后续启动会校验迁移历史并保持版本 1。迁移规则见 [数据库说明](../docs/DATABASE.md)。
打包产物为 target/fleet-control-backend-0.0.1-SNAPSHOT.jar，不纳入 Git。

## 启动与停止

在同一个已设置变量的 backend/ 终端执行：

```bash
./mvnw spring-boot:run
```

应用监听 127.0.0.1:8080。在启动终端按 Control + C 停止服务，数据库与隧道分别管理。

## 接口检查

在另一个终端执行：

```bash
curl -i http://127.0.0.1:8080/api/v1/system/info
curl -i http://127.0.0.1:8080/actuator/health
```

- 信息接口仍返回静态的 application 与 stage，不能作为数据库查询验证。
- Actuator 仅开放 health，健康明细设置为 never。
- Issue #02 已验证上述两个 HTTP 接口；Issue #03 的证据是数据库连接、迁移和应用上下文测试，尚未补交接入数据库后的 HTTP 请求结果。
- 应用健康状态不能代表 Router 或 vLLM 已接入或健康。

详见 [环境记录](../docs/ENVIRONMENT.md)、[验收记录](../docs/ACCEPTANCE.md) 和 [开发数据库部署说明](../deploy/README.md)。
