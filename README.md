# DayLog - 个人生活管理中心

一站式个人生活管理工具，涵盖任务、计划、快递、花费、资金、简历。

## 功能模块

| 模块 | 说明 |
|------|------|
| 每日任务 | Todo 列表，勾选完成变灰移至完成栏，拖拽排序 |
| 近期任务 | 自定义时间范围过滤，可转为每日任务 |
| 短期计划 | 看板视图（周/10天/月/年），拖拽卡片跨列移动 |
| 快递追踪 | 寄/取双标签，快递状态管理 |
| 花费记录 | 早/午/晚/小食分类，饼图+柱状图可视化 |
| 资金汇总 | 多账户余额聚合，攒钱目标进度条 |
| 简历 | 目标职位 vs 现有技能/经验对比 |

## 技术栈

- **框架**: Next.js 14 (App Router) + TypeScript
- **样式**: Tailwind CSS
- **数据库**: SQLite (Drizzle ORM) — 本地 better-sqlite3，生产可迁 Turso
- **认证**: NextAuth v5 (Credentials Provider + JWT)
- **拖拽**: @dnd-kit/core + @dnd-kit/sortable
- **图表**: Recharts
- **校验**: Zod
- **图标**: Lucide React

## 架构

```
Server Component (RSC) → 直接查 SQLite → 渲染 JSX
Client Component → Server Action ("use server") → 写 DB → revalidatePath()
                 → useOptimistic 即时 UI 反馈
                 → router.refresh() 拉取最新数据
```

无 REST API 层，无 GraphQL。读写全通过 Drizzle ORM + Server Actions。

## 本地开发

### 环境要求

- Node.js 18+
- npm 9+

### 安装启动

```bash
# 安装依赖
npm install

# 生成数据库迁移
npm run db:generate

# 推送 schema 到本地 SQLite
npm run db:push

# 创建默认用户 (admin / admin123)
npm run db:seed

# 启动开发服务器
npm run dev
```

访问 `http://localhost:3000`，登录 `admin` / `admin123`。

### 修改密码

```bash
npx tsx -e "const bcrypt = require('bcryptjs'); bcrypt.hash('你的密码', 12).then(console.log)"
```

将输出的 hash 更新 `.env` 中的 `AUTH_PASSWORD_HASH`，然后重新运行 `npm run db:seed`。

## 部署

### Vercel（推荐，免费）

1. 将项目推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入仓库
3. 设置环境变量（见 `.env.example`）
4. 数据库需改用 Turso（见下方配置）

### 自建服务器

```bash
npm run build
npm run start
```

默认监听 `http://localhost:3000`，可用 Nginx 反向代理。

### 数据库迁移到 Turso（云端）

1. 注册 [Turso](https://turso.tech)，创建数据库
2. 更新 `.env`:
   ```
   DATABASE_URL=libsql://your-db.turso.io
   TURSO_AUTH_TOKEN=your-token
   ```
3. 修改 `src/db/index.ts` 使用 `@libsql/client` 替代 `better-sqlite3`
4. `npm run db:push` 推送 schema 到 Turso

## 环境变量

```bash
DATABASE_URL=file:./daylog.db    # 本地 SQLite 文件
AUTH_SECRET=your-random-secret   # openssl rand -base64 32
AUTH_USERNAME=admin              # 登录用户名
AUTH_PASSWORD_HASH=bcrypt-hash   # bcrypt 加密后的密码
OCR_API_KEY=                     # OCR API Key（可选，快递面单识别）
```

## 项目结构

```
src/
├── app/              # Next.js App Router 页面
│   ├── (auth)/       # 登录页（无侧栏）
│   └── (main)/       # 认证页面（带侧栏）
├── components/
│   ├── ui/           # 通用 UI 组件
│   ├── layout/       # Sidebar, AppShell
│   ├── tasks/        # 任务组件
│   ├── plans/        # 看板组件
│   ├── packages/     # 快递组件
│   ├── expenses/     # 花费组件
│   ├── money/        # 资金组件
│   └── resume/       # 简历组件
├── db/               # Drizzle schema + 客户端
├── actions/          # Server Actions
├── lib/              # 工具函数 + 常量
└── middleware.ts      # 路由守卫
```

## 修改日志

### 2026-07-13 — 初版
- 初始化项目，11 张数据表，7 个功能模块
- NextAuth v5 单用户认证
- 极简 UI，深色侧栏 + 浅色内容区

### 2026-07-13 — Bug 修复
- 修复所有业务组件中 `useState(props)` 导致操作后页面不更新的问题
- 改为直接消费 props + `router.refresh()` 模式
