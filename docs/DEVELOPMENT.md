# 完整开发启动与验收

本文用于 macOS ARM64 开发机，数据库由独立 Fedora 主机提供。按顺序启动数据库、SSH 隧道、后端和前端。安装版本见 [环境记录](ENVIRONMENT.md)。本文是执行步骤，实际结果需另记入 [验收记录](ACCEPTANCE.md)。

## 1. 准备条件

- 已有仓库工作副本；开始时终端位于仓库根目录。
- JDK 21 的 java、javac 可用，使用项目 Maven Wrapper。
- Node.js 24.22.2、pnpm 11.25.0 可用；不需要在 Mac 安装 Podman 或 PostgreSQL 服务。
- Fedora PostgreSQL 已运行；准备实际 SSH 目标、数据库名称、用户和密码。
- Mac 的 15432、8080 和 5173 端口可用。若已有本项目进程，先在其启动终端正常停止，避免两个应用竞争同一端口。

在 Mac 检查：

```bash
git status --short --branch
java -version
javac -version
node -v
pnpm -v
```

仓库已有内容不需要重新克隆，也不需要删除数据库。以下人工复现复用现有开发库，不能据此宣称完成全新数据库部署。

## 2. 确认 Fedora 数据库

维护当前已部署实例时，在 Fedora 执行：

```bash
cd /opt/postgres
sudo podman compose -f podman-compose.yaml ps
sudo podman compose -f podman-compose.yaml exec -T postgres sh -c 'pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"'
```

预期容器 healthy，pg_isready 返回 accepting connections。仓库另有 compose.dev.yml 示例；不要混用现有实例的文件名、目录和 sudo 环境。新部署步骤见 [部署说明](../deploy/README.md)。

## 3. Mac 终端 A：SSH 隧道

将占位目标替换为自己的 SSH 用户和主机：

```bash
export FLEET_DB_SSH_TARGET='your-user@your-db-host'
ssh -N -o ExitOnForwardFailure=yes -o ServerAliveInterval=30 -L 127.0.0.1:15432:127.0.0.1:5432 "$FLEET_DB_SSH_TARGET"
```

保持终端 A 运行。如果已有正常运行的同一隧道，直接复用，不重复启动。

## 4. Mac 终端 B：后端

从仓库根目录执行，按实际数据库设置名称和用户。隐藏输入命令适用于 macOS 默认 zsh：

```bash
cd backend
export DB_HOST=127.0.0.1
export DB_PORT=15432
export DB_NAME=fleet_control
export DB_USER=fleet_control
read -r -s "DB_PASSWORD?请输入数据库密码："
printf '\n'
export DB_PASSWORD

./mvnw -B -V verify
```

预期 BUILD SUCCESS。测试会连接上述数据库并执行待应用的 Flyway 迁移；现有开发库应校验 V1 并提示无需迁移。不要修改已执行的 V1。

构建成功后，在同一终端启动：

```bash
./mvnw spring-boot:run
```

预期数据库连接成功、迁移校验成功，应用监听 127.0.0.1:8080。IDEA 启动也可使用，但需要单独设置运行配置中的环境变量；终端变量不会自动同步到已打开的 IDEA。

## 5. Mac 终端 C：前端

从仓库根目录执行：

```bash
cd frontend
pnpm install --frozen-lockfile
pnpm run build
pnpm dev
```

预期类型检查与构建成功，开发服务地址为 http://127.0.0.1:5173。开发服务通过 /api 代理连接本机 8080 后端。前端不接收数据库密码。

## 6. Mac 终端 D 与浏览器：验收

```bash
curl -i http://127.0.0.1:8080/api/v1/system/info
curl -i http://127.0.0.1:8080/actuator/health
curl -i http://127.0.0.1:5173/api/v1/system/info
```

预期三个请求均为 HTTP 200；信息接口 application 为 vllm-fleet-control、stage 为 M0，health 的 status 为 UP。

浏览器打开 http://127.0.0.1:5173：

1. 页面显示管理 API 已连接、应用标识及 M0。
2. 点击重新检查，完成后显示新的最近检查时间。
3. 在终端 B 停止后端，点击页面重新检查，显示连接错误。
4. 在同一终端 B 重新运行 ./mvnw spring-boot:run，待启动完成后重新检查，页面恢复已连接。

记录执行日期、提交号、构建结果、三个 HTTP 检查和浏览器成功/错误/恢复结果，不在记录中粘贴密码或私有地址。此项为人工检查，不是自动化端到端测试。

## 7. 本次复现遇到的问题

### 后端提示 127.0.0.1:15432 connection refused

先确认终端 A 的 SSH 隧道仍在运行。隧道恢复后，在原来已设置数据库环境变量的终端 B 重试 verify。本次复现按此流程恢复成功，未修改数据库结构或密码。

### Vite 提示无法解析 .vue，或 /api 返回前端 HTML

确认当前目录为 frontend，vite.config.ts 中已启用 Vue 插件并配置 /api 代理。如果配置存在但当前运行服务没有体现配置，先在原前端终端停止旧 Vite，再从 frontend 执行 pnpm dev，然后刷新页面。本次旧服务重启后，页面和代理均恢复正常；尚未独立定位旧进程未加载配置的内部原因。

上述排查不要求删除数据库、修改 V1 或重复安装 Vue 插件。

## 8. 停止

先在终端 C 按 Control + C 停止前端，再在终端 B 停止后端，最后在终端 A 停止隧道。当前终端 B 可执行 unset DB_PASSWORD 清除变量；关闭终端也会结束其环境变量作用域。复现结束可保留开发数据库运行，不删除容器或数据卷。

CI 会在临时 PostgreSQL 空库中另外验证构建、迁移与后端启动；范围和证据见 [CI 说明](CI.md)。生产反向代理、全新 Compose 部署和备份恢复不由本文的现有环境复现覆盖。
