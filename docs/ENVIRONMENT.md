# 开发环境

记录日期：2026-11-05（Asia/Shanghai）。仅记录脱敏后的开发环境信息。
本机执行结果依据 Owner 在协作中提供的输出；工程配置已与当前文件核对。

## Mac 开发机

| 工具 | 已记录版本 | 验证来源 |
| --- | --- | --- |
| 系统 / 架构 | macOS 27.0.1 / ARM64 | Owner 的系统信息与 Maven 日志 |
| Git | 2.54.0（Apple Git-157） | Owner 的版本检查 |
| JDK | Homebrew OpenJDK 21.0.13.0.3 | Maven 构建日志；pom.xml 目标为 Java 21 |
| Spring Boot | 4.1.2 | pom.xml 父工程及测试启动日志 |
| Maven | 3.10.0 | Wrapper 配置与构建日志 |
| Maven Wrapper | 3.3.4 | backend/.mvn/wrapper/maven-wrapper.properties |
| Node.js | 24.22.2 | Owner 的版本检查；前端构建尚未验证 |
| npm | 11.19.1 | Owner 的版本检查 |
| pnpm | 11.25.0 | Owner 的版本检查；前端构建尚未验证 |

后端版本为 `0.0.1-SNAPSHOT`。Web MVC、Validation 和 Actuator 依赖交由 Spring Boot 父工程统一管理。
构建使用 `./mvnw`，避免依赖每台开发机的全局 Maven 版本。

## 独立容器主机

- 系统：Fedora Linux 44 Workstation，x86_64。
- Podman：5.8.9。
- podman-compose：1.6.0。
- Rootless 检查：true。
- 版本与 Rootless 依据 Owner 提供的终端输出。
- 测试容器步骤后 Owner 表示完成；未提供该步骤的运行日志。
- Mac 不要求安装本地 Podman，开发数据库计划运行在独立容器主机上。

## 待配置或验证

- PostgreSQL 的版本、容器配置与 Mac 到数据库的连接方式。
- PostgreSQL、Flyway 和 MyBatis-Plus 的集成兼容性。
- 前端工程依赖、锁文件、类型检查与构建。
- Router 的项目名称、版本及真实 API 能力。
- vLLM、Prometheus 与 systemd 的测试环境和实际集成。

不在本文件记录真实凭据、SSH 私钥或远端服务地址。
