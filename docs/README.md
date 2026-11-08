# 开发文档

- [当前执行手册](vllm-fleet-control-v0.1-two-person-handbook.md)：原始开发基线；该文件自述为文档重建版，后续已接受的选型变更见技术决策。
- [环境记录](ENVIRONMENT.md)：已验证版本、部署差异及待验证集成。
- [验收记录](ACCEPTANCE.md)：各 Issue 的证据、跳过项和遗留事项。
- [完整开发启动](DEVELOPMENT.md)：安装前提、终端分工、启动顺序与人工验收。
- [CI 说明](CI.md)：前后端自动检查范围与运行证据。
- [数据库说明](DATABASE.md)：V1 元数据表、Flyway 迁移与连接约定。
- [技术决策](decisions/README.md)：重要选型的背景、结论与验证结果。
- [前端 UI 决策](decisions/0001-frontend-ui.md)：shadcn/vue + Tailwind CSS 的选型与影响。
- [后端开发入口](../backend/README.md)：配置、构建、启动和接口说明。
- [前端开发入口](../frontend/README.md)：依赖安装、构建、代理和 API 联调。
- [开发数据库部署](../deploy/README.md)：仓库 Compose 示例与现有 Fedora 环境。

M0 基础工程验收通过。前后端、数据库、main 的 CI 及现有开发环境启动与断开恢复均已有验收记录；仓库 Compose 的全新部署、备份恢复与生产运行仍未验证。下一阶段为 M1 资源与访问基线。
