# PureGlim — 服务器部署手册

## 服务器信息

| 项目 | 值 |
|------|----|
| SSH 别名 | `projects-server` |
| 部署根目录 | `/opt/pureglim/` |
| 线上访问端口 | `8088` (nginx 反代) |
| GitHub 仓库 | `https://github.com/RugeeFan/pureglim.git` |
| 生产分支 | `feature/partner-discount-commission`（目前，后续改 main） |

## 目录结构

```
/opt/pureglim/
├── bin/
│   ├── up.sh         # 重新 build + 启动容器
│   ├── restart.sh    # 不重新 build，仅重启
│   ├── logs.sh       # tail 容器日志
│   ├── status.sh     # docker compose ps
│   └── rollback.sh   # 回滚到指定 release
├── releases/
│   ├── 20260419-050455/   # 历史 release（git clone）
│   └── 20260424-224728/   # 当前 release
├── current -> releases/20260424-224728/   # 软链接，指向当前 release
└── shared/
    └── .env           # 生产环境变量（所有 release 共享，永远不提交到 git）
```

## 容器组成

`deploy/docker-compose.prod.yml` 定义了三个容器：

| 容器 | 作用 |
|------|------|
| `pureglim-db-1` | PostgreSQL 16，数据卷 `pureglim_postgres_data` |
| `pureglim-app-1` | Next.js app，启动时自动运行 `prisma migrate deploy` |
| `pureglim-proxy-1` | nginx 反代，监听 8088，转发到 app:3000 |

## 标准部署流程（有代码变更）

```bash
# 1. 本地：提交并推送到 GitHub
git add <files>
git commit -m "描述"
git push origin feature/partner-discount-commission

# 2. SSH 进服务器，创建新 release
ssh projects-server

RELEASE_DIR="/opt/pureglim/releases/$(date -u +%Y%m%d-%H%M%S)"
git clone --branch feature/partner-discount-commission --depth 1 \
  https://github.com/RugeeFan/pureglim.git "$RELEASE_DIR"

# 3. 链接共享 .env（release 内部的 shared/ 目录）
mkdir -p "$RELEASE_DIR/shared"
ln -sfn /opt/pureglim/shared/.env "$RELEASE_DIR/shared/.env"

# 4. 切换 current 软链接到新 release
ln -sfn "$RELEASE_DIR" /opt/pureglim/current

# 5. 重新 build 并启动（会自动运行 prisma migrate deploy）
/opt/pureglim/bin/up.sh
```

> **注意**：步骤 3 链接的是 `$RELEASE_DIR/shared/.env`，但 `docker-compose.prod.yml`
> 里 `env_file` 写的是 `../../shared/.env`（相对于 `deploy/` 子目录），指向的是
> `/opt/pureglim/shared/.env`，所以实际环境变量来源是那里，**不是**步骤 3 建的链接。
> 步骤 3 只是为了让部分脚本能找到文件，可以跳过。

## 仅重启（不更新代码）

```bash
ssh projects-server
/opt/pureglim/bin/restart.sh
```

## 查看日志

```bash
ssh projects-server
/opt/pureglim/bin/logs.sh
# 或只看 app 容器
sudo docker logs pureglim-app-1 --tail 50 -f
```

## 回滚到上一个 release

```bash
ssh projects-server
ls /opt/pureglim/releases/          # 查看可用 release
/opt/pureglim/bin/rollback.sh 20260419-050455   # 替换为目标 release 名
```

## 修改生产环境变量

```bash
ssh projects-server
sudo nano /opt/pureglim/shared/.env   # 编辑
/opt/pureglim/bin/restart.sh          # 重启使其生效（无需重新 build）
```

当前 `.env` 包含的关键变量：

```
ADMIN_USERNAME=pureglim-admin
ADMIN_PASSWORD=PgAdm-Z4jPUMIchwIT6zJv   # 首次登录后在 /admin/settings 改密码
ADMIN_JWT_SECRET=...
PARTNER_JWT_SECRET=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_VERIFY_SERVICE_SID=...
DATABASE_URL=...
SMTP_*=...
```

## Prisma 迁移说明

迁移**无需手动执行**。`Dockerfile` 的 CMD 是：
```
npx prisma migrate deploy && npx next start
```
每次容器启动都会自动应用所有 pending migration。

如需手动检查迁移状态：
```bash
ssh projects-server
sudo docker exec pureglim-app-1 npx prisma migrate status
```

## 保留多少个 release

目前没有自动清理。手动清理旧 release：
```bash
ssh projects-server
# 保留最近 3 个，删除其余
ls -dt /opt/pureglim/releases/*/ | tail -n +4 | xargs sudo rm -rf
```
