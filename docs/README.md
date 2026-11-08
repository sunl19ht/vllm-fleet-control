# 开发文档

- [当前执行手册](vllm-fleet-control-v0.1-two-person-handbook.md)：当前开发基线；该文件自述为文档重建版。
- [环境记录](ENVIRONMENT.md)：已验证版本、部署差异及待验证集成。
- [验收记录](ACCEPTANCE.md)：各 Issue 的证据、跳过项和遗留事项。
- [数据库说明](DATABASE.md)：V1 元数据表、Flyway 迁移与连接约定。
- [技术决策](decisions/README.md)：重要选型的背景、结论与验证结果。
- [后端开发入口](../backend/README.md)：配置、构建、启动和接口说明。
- [开发数据库部署](../deploy/README.md)：仓库 Compose 示例与现有 Fedora 环境。

当前处于 M0，后端与数据库基础链路已验证；后续继续 Issue #04 前端与 Issue #05 CI。
