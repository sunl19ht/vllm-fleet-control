# 后端

Spring Boot 管理 API，目前提供最小信息接口与应用健康检查。
数据库、登录鉴权及 vLLM 集成尚未接入，仅用于本地开发。

## 已验证版本

- JDK：Homebrew OpenJDK 21.0.13.0.3；工程目标为 Java 21。
- Spring Boot：4.1.2，由 pom.xml 的父工程版本固定。
- Maven：3.10.0，由 Maven Wrapper 固定。
- Maven Wrapper：3.3.4。
- 当前后端构件版本：0.0.1-SNAPSHOT，不代表已发布 v0.1.0。

## 构建与测试

在仓库根目录进入后端，执行：

```bash
cd backend
./mvnw -B -V verify
```

首次运行会下载 Maven 和依赖，需要网络连接。
打包产物为 `target/fleet-control-backend-0.0.1-SNAPSHOT.jar`，不纳入 Git。

## 启动与停止

在 backend/ 目录执行：

```bash
./mvnw spring-boot:run
```

当前配置监听 `127.0.0.1:8080`，仅供本机访问。
在启动终端按 Control + C 停止服务。

## 接口检查

保持后端运行，在另一个终端执行：

```bash
curl -i http://127.0.0.1:8080/api/v1/system/info
curl -i http://127.0.0.1:8080/actuator/health
```

两次请求均应返回 HTTP 200。

- 信息接口返回 `application` 为 `vllm-fleet-control`、`stage` 为 `M0`；JSON 字段顺序不影响结果。
- 健康接口返回 `status` 为 `UP`，响应可能还包含健康分组。
- 当前仅开放 Actuator 的 health 端点，不展示健康明细。
- 此时的健康检查不代表 PostgreSQL、Router 或 vLLM 已接入或健康。

数据库将在 Issue #03 接入。根目录 `.env.example` 目前仅为格式草案，后端尚未读取这些变量。
环境版本与验证证据见 [环境记录](../docs/ENVIRONMENT.md) 和 [验收记录](../docs/ACCEPTANCE.md)。
