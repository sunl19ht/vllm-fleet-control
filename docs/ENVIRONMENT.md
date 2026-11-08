# 开发环境

更新日期：2026-11-08（Asia/Shanghai）。仅记录脱敏后的开发环境信息。
证据来自 Owner 的终端日志、页面截图与确认，以及助手的临时前端构建和 IDEA 配置恢复验证；各项来源在验收记录中分开说明。

## Mac 开发机

| 工具 | 已记录版本 | 验证来源 |
| --- | --- | --- |
| 系统 / 架构 | macOS 27.0.1 / ARM64 | 系统信息与 Maven 日志 |
| Git | 2.54.0（Apple Git-157） | Owner 的版本检查 |
| JDK | Homebrew OpenJDK 21.0.13.0.3 | Maven 与 IDEA 日志；pom.xml 目标为 Java 21 |
| Spring Boot | 4.1.2 | pom.xml 父工程与启动日志 |
| Maven / Wrapper | 3.10.0 / 3.3.4 | Wrapper 配置与构建日志 |
| Node.js / npm | 24.22.2 / 11.19.1 | Owner 的版本检查；前端临时构建使用 Node.js 24 |
| pnpm | 11.25.0 | Owner 安装及构建日志；packageManager 固定版本 |

后端构件版本为 0.0.1-SNAPSHOT。构建入口为 ./mvnw。

## 前端组件与构建

| 组件 | 实际安装版本 | 来源 |
| --- | --- | --- |
| Vue | 3.5.45 | 安装日志与本机依赖清单 |
| Vite | 8.3.6 | 安装及构建日志 |
| TypeScript / vue-tsc | 6.0.3 / 3.3.14 | 安装日志与本机依赖清单 |
| Tailwind CSS / @tailwindcss/vite | 4.3.5 / 4.3.5 | package.json 与本机依赖清单 |
| Reka UI | 2.11.0 | 安装日志与本机依赖清单 |
| Lucide（@lucide/vue） | 1.70.0 | 本机依赖清单 |

shadcn/vue 使用生成后纳入 Git 的组件源码，选项保存在 components.json：New York、Neutral、Geist、Lucide。
包依赖由 pnpm-lock.yaml 定位，pnpm 使用 packageManager 固定为 11.25.0。
当前不再使用 Element Plus，选型变更见 [决策记录](decisions/0001-frontend-ui.md)。
前端通过 127.0.0.1:5173 的 /api 代理访问后端 127.0.0.1:8080。

## 数据库与持久化组件

| 组件 | 已验证版本 | 验证范围 |
| --- | --- | --- |
| PostgreSQL | 17.11 | 容器就绪、JDBC 连接、首次及重复迁移 |
| Flyway | 12.4.0 | 初始空 schema 应用 V1；后续校验并确认无需迁移 |
| PostgreSQL JDBC | 42.7.14 | IDEA 类路径与成功连接日志 |
| MyBatis-Plus | 3.5.18 | Boot 4 Starter 基础装配；尚无业务 Mapper 或 CRUD 验证 |

Flyway 和 JDBC 版本由 Spring Boot 4.1.2 管理；MyBatis-Plus 显式固定为 3.5.18。
后端默认通过 Mac 127.0.0.1:15432 的 SSH 转发连接数据库，密码从 DB_PASSWORD 获取。

## Fedora 容器主机

- 系统：Fedora Linux 44 Workstation，x86_64。
- Podman：5.8.9；podman-compose：1.6.0。
- 普通用户环境曾验证 Rootless 为 true；本次 PostgreSQL 实际由 sudo podman compose 创建，使用 root 权限环境。
- 实际工作目录：/opt/postgres；实际配置文件：podman-compose.yaml。
- 实际容器：postgres_postgres_1；容器状态 healthy。
- 实际运行镜像：docker.1ms.run/library/postgres:17.11-bookworm，依据 Owner 的 ps 输出。
- 仓库 Compose 示例使用 docker.io/library/postgres:17.11-bookworm，镜像来源与实际部署不同；未将仓库示例的干净部署记为通过。
- Fedora 端发布地址为 127.0.0.1:5432；Mac 不要求安装本地 Podman。
- 容器版本、就绪检查和数据库运行状态依据 Owner 提供的输出，未在此验证第三方镜像与官方镜像的内容一致性。

## 待验证

- 按仓库 Compose 示例在干净环境部署、数据卷恢复及备份流程。
- MyBatis-Plus 的实际 Mapper 查询、参数校验和业务事务。
- 前端在 CI 与干净环境中的冻结锁文件安装、构建及生产反向代理。
- CI 使用独立数据库服务的构建与迁移检查。
- Router 的项目与 API 能力，以及 vLLM、Prometheus、systemd 的实际集成。

不在本文件记录真实密码、SSH 私钥或远端服务地址。
