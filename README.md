# vLLM Fleet Control

用于登记 vLLM 推理资源、检查健康、查询监控并追踪受控操作的管理平台。

## 当前状态

M0 工程初始化阶段，尚未发布可用版本。
当前仅建立仓库结构，前后端及数据库尚未初始化。

## 技术方向

- 后端：JDK 21、Spring Boot、Maven
- 前端：Vue 3、TypeScript、Element Plus、pnpm
- 数据库：PostgreSQL、Flyway
- 容器环境：独立 Fedora 主机上的 Podman

具体工程依赖将在后续初始化时验证并锁定。

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
