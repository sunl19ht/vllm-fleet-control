# vLLM Fleet Control

用于登记 vLLM 推理资源、检查健康、查询监控并追踪受控操作的管理平台。

## 当前状态

M0 工程初始化阶段，尚未发布可用版本。
后端、数据库迁移及 Vue 前端的真实 API 联调已通过；前端类型检查与生产构建已验证，CI 与干净环境复现仍待完成，M0 尚未完成。

## 技术方向

- 后端：JDK 21、Spring Boot、Maven
- 前端：Vue 3、TypeScript、shadcn/vue、Tailwind CSS、pnpm
- 数据库：PostgreSQL、Flyway
- 容器环境：独立 Fedora 主机上的 Podman

后端已验证 Spring Boot 4.1.2、JDK 21 与 Maven 3.10.0；Maven 版本由 Wrapper 固定，Spring Boot 版本由后端 pom.xml 固定。数据库链路已验证 PostgreSQL 17.11、Flyway 12.4.0、PostgreSQL JDBC 42.7.14 和 MyBatis-Plus 3.5.18 的基础装配；业务 Mapper 尚未实现。其他组件将在接入时验证并锁定。

## 开发入口

- [后端构建、启动与接口检查](backend/README.md)
- [前端安装、构建与联调](frontend/README.md)
- [前端 UI 选型记录](docs/decisions/0001-frontend-ui.md)
- [数据库与迁移说明](docs/DATABASE.md)
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

.env.example 仅提供配置格式，不包含真实凭据；Spring Boot 不会自动读取此文件。
后端通过环境变量接收数据库配置，DB_PASSWORD 必须在终端或 IDEA 运行配置中提供。构建测试也会连接开发数据库并检查迁移。
本地 .env 文件不纳入版本管理，连接和启动步骤见后端说明。

## 许可证

待项目 Owner 确认，当前尚未授予开源许可证。
