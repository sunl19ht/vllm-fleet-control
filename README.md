# vLLM Fleet Control

用于登记 vLLM 推理资源、检查健康、查询监控并追踪受控操作的管理平台。

## 当前状态

M0 工程初始化阶段，尚未发布可用版本。
后端已通过基础构建、应用上下文测试与最小 API 验收；前端、数据库和 CI 尚未初始化，M0 尚未完成。

## 技术方向

- 后端：JDK 21、Spring Boot、Maven
- 前端：Vue 3、TypeScript、Element Plus、pnpm
- 数据库：PostgreSQL、Flyway
- 容器环境：独立 Fedora 主机上的 Podman

后端已验证 Spring Boot 4.1.2、JDK 21 与 Maven 3.10.0；Maven 版本由 Wrapper 固定，Spring Boot 版本由后端 pom.xml 固定。其他组件将在接入时验证并锁定。

## 开发入口

- [后端构建、启动与接口检查](backend/README.md)
- [已验证的环境版本](docs/ENVIRONMENT.md)
- [验收结果与未验证项](docs/ACCEPTANCE.md)
- [开发文档索引](docs/README.md)

## 目录

- backend/：管理 API 与后台任务
- frontend/：管理控制台
- docs/：开发文档、决策与验收记录
- deploy/：容器配置与部署说明
- .github/：协作模板与 CI

## 本地配置

.env.example 仅提供配置格式，不包含真实凭据。
后续使用的 .env 文件不纳入版本管理。

## 许可证

待项目 Owner 确认，当前尚未授予开源许可证。
