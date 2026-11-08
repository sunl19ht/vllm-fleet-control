# 数据库与迁移

## 当前范围

M0 已接入 PostgreSQL 17.11、Flyway 12.4.0 和 PostgreSQL JDBC 42.7.14。
MyBatis-Plus 3.5.18 使用 Boot 4 专用 Starter，目前只验证基础装配，没有业务 Mapper。
Router、Host、Instance 等业务表留到 M1 设计。

## 迁移来源

唯一 SQL 迁移来源为 backend/src/main/resources/db/migration/。

| 文件 | 内容 |
| --- | --- |
| V1__init_schema.sql | 创建 app_metadata，并插入 application 与 stage 两条工程元数据 |

app_metadata 的字段：

- metadata_key：VARCHAR(64)，主键。
- metadata_value：VARCHAR(255)，非空。
- created_at：TIMESTAMPTZ，非空，默认当前时间。

Flyway 自行维护 public.flyway_schema_history；该表不另建手工 SQL。
已验证空 schema 首次应用 V1，后续应用上下文启动校验版本 1 且不再应用迁移。

## 运行约定

- 构建测试和应用启动均需要可连接的开发数据库及 DB_PASSWORD。
- 当前 Mac 通过 SSH 隧道连接远端数据库，步骤见 [后端说明](../backend/README.md)。
- spring.sql.init.mode=never，建表统一交由 Flyway。
- spring.flyway.baseline-on-migrate=false，不自动将未知的非空 schema 标记为基线。
- spring.flyway.clean-disabled=true，禁用 Flyway clean。
- 已应用的 V1 文件保持不变；后续结构调整新增 V2、V3 等版本迁移。
- 数据库容器的初始化流程不负责本项目业务迁移，不复制另一套 V1 SQL 到部署目录。

## 连接配置

非敏感默认值为 DB_HOST=127.0.0.1、DB_PORT=15432、DB_NAME=fleet_control、DB_USER=fleet_control。
实际用户名与数据库名应匹配部署环境，密码通过 DB_PASSWORD 提供，不写入已跟踪文件。
.env.example 不由 Spring Boot 自动加载；IDEA 和终端分别配置环境变量。

## 已验证与待验证

首次迁移和重复校验已由 Owner 提供日志，详见 [验收记录](ACCEPTANCE.md)。
业务 Mapper、升级迁移、迁移失败恢复和数据卷备份恢复尚未验证；不能将当前结果视为完整数据库恢复方案。
