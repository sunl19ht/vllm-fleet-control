# 开发文档

- [当前执行手册](vllm-fleet-control-v0.1-two-person-handbook.md)：原始开发基线；该文件自述为文档重建版，后续已接受的选型变更见技术决策。
- [环境记录](ENVIRONMENT.md)：已验证版本、部署差异及待验证集成。
- [验收记录](ACCEPTANCE.md)：各 Issue 的证据、跳过项和遗留事项。
- [数据库说明](DATABASE.md)：V1 元数据表、Flyway 迁移与连接约定。
- [技术决策](decisions/README.md)：重要选型的背景、结论与验证结果。
- [前端 UI 决策](decisions/0001-frontend-ui.md)：shadcn/vue + Tailwind CSS 的选型与影响。
- [后端开发入口](../backend/README.md)：配置、构建、启动和接口说明。
- [前端开发入口](../frontend/README.md)：依赖安装、构建、代理和 API 联调。
- [开发数据库部署](../deploy/README.md)：仓库 Compose 示例与现有 Fedora 环境。

当前处于 M0，前后端与数据库基础链路已验证；下一项为 Issue #05：CI 与干净环境复现。
