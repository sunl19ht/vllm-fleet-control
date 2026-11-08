# 开发数据库部署

本目录保存 PostgreSQL 的开发 Compose 示例，后端和前端当前仍在 Mac 上运行。

## 仓库配置

compose.dev.yml 使用 docker.io/library/postgres:17.11-bookworm，将容器 5432 发布到部署主机的 127.0.0.1:5432。
命名卷 postgres_data 挂载至 /var/lib/postgresql/data；Compose 实际卷名通常包含项目名前缀。
密码由同目录 .env 中的 DB_PASSWORD 提供，.env 已由根忽略规则排除。

部署变量为 DB_NAME、DB_USER、DB_PASSWORD；示例格式见根目录 .env.example。
数据库名称和用户默认采用 fleet_control，真实密码需在部署机器本地配置。

在部署配置目录中，准备好 .env 后可运行：

```bash
sudo podman compose -f compose.dev.yml up -d
sudo podman compose -f compose.dev.yml ps
sudo podman compose -f compose.dev.yml exec -T postgres sh -c 'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

以上是仓库示例路径，尚未在另一套干净环境完整复现。

## 当前 Owner 已验证环境

- 工作目录：/opt/postgres。
- 实际配置文件：podman-compose.yaml。
- 运行方式：sudo podman compose，使用 root 权限环境。
- 实际镜像来源：docker.1ms.run/library/postgres:17.11-bookworm，与仓库示例不同。
- 已验证容器 healthy、服务接受连接，以及 Mac 后端通过 15432 转发端口成功连接和执行迁移。

维护当前这套环境时，在 Fedora 原目录使用实际文件名：

```bash
cd /opt/postgres
sudo podman compose -f podman-compose.yaml ps
sudo podman compose -f podman-compose.yaml logs --tail=30 postgres
sudo podman compose -f podman-compose.yaml exec -T postgres sh -c 'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

停止这套数据库可执行：

```bash
sudo podman compose -f podman-compose.yaml stop
```

操作现有数据时沿用同一个项目目录、配置文件及 sudo 环境，保持原有容器和数据卷的关联。
普通用户 Podman 与 sudo Podman 使用不同的存储环境；最初的 Rootless 检查不能代表本数据库使用 Rootless。

## Mac 连接

通过 SSH 将 Mac 的 127.0.0.1:15432 转发至 Fedora 的 127.0.0.1:5432。
具体命令及后端环境变量见 [后端说明](../backend/README.md)，不在仓库记录真实 SSH 目标或密码。

数据库业务结构由后端 Flyway 迁移管理，部署目录不保存重复建表 SQL。
当前尚未验证数据卷备份恢复、重建部署和生产运行方案。
