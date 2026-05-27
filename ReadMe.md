# store-server-node

本项目是一个基于 Node.js 的商城后台管理系统，使用 Koa2 框架开发，集成了商品管理、分类管理、订单处理、微信登录及 RBAC 权限控制等核心功能。

## 一、项目安装

```sh
# 安装依赖
npm install

# 启动项目 (开发模式)
npm run dev

# 启动项目 (生产模式)
npm start
```

## 二、项目介绍

### 功能介绍

- **商品管理**：包括商品列表、详情查询、新品推荐、销量排序、商品上下架等。
- **商品分类管理**：支持商品分类 CRUD，实现商品与分类的多对多关联绑定。
- **微信小程序登录**：集成微信 `code2Session` 接口，支持小程序一键登录及自动注册。
- **订单管理**：处理订单创建、明细查询及库存自动扣减逻辑。
- **用户权限 (RBAC)**：基于 Casbin 的权限模型，支持角色管理（如超级管理员、普通用户）。
- **文件上传**：支持 Local、Minio 多种存储驱动。

### 技术栈

- **后端**：Node.js, Koa2, Sequelize (ORM), MySQL, Redis
- **认证**：JWT (Json Web Token)
- **权限**：Casbin
- **工具**：Axios, Bcrypt, Nodemon

### 项目结构

```
store-server-node
├── src
│   ├── app          # 应用配置与错误处理
│   ├── config       # 环境变量与全局配置
│   ├── constant     # 常量与错误类型定义
│   ├── controller   # 控制器层：处理业务逻辑入口
│   ├── db           # 数据库连接与初始化脚本
│   ├── middleware   # 中间件（认证、校验、上传等）
│   ├── model        # 数据模型定义
│   ├── router       # 路由定义
│   ├── service      # 服务层：数据库操作与核心业务
│   ├── utils        # 工具类（Redis, Captcha, 加密等）
│   └── main.js      # 入口文件
├── .env             # 环境变量配置文件
├── package.json     # 项目依赖与脚本
└── ReadMe.md        # 项目文档
```

## 三、项目配置 (.env)

在项目根目录下创建 `.env` 文件，并根据实际情况配置以下变量：

```env
# 启动端口
APP_PORT = '8800'

# 数据库配置
MYSQL_HOST = '127.0.0.1'
MYSQL_ROOT = 'root'
MYSQL_PASSWORD = 'your_password'
MYSQL_DB = 'store'
MYSQL_PORT = '3306'

# REDIS 配置
REDIS_HOST = '127.0.0.1'
REDIS_PORT = '6379'
REDIS_PASSWORD = ''

# 存储设置 local/minio/online
UPLOAD_TYPE = "local"

# JWT 配置
JWT_SECRET = 'your_jwt_secret'

# 微信小程序配置
WX_APPID = 'your_wx_appid'
WX_APPSECRET = 'your_wx_appsecret'
```

## 四、数据库同步与初始化

1. **表结构同步**：
   项目启动时会自动检查并同步未创建的表结构。

2. **初始化超级管理员**：
   执行以下脚本创建默认管理员账号（admin / 123456）：
   ```sh
   node src/db/initAdmin.js
   ```

3. **初始化权限数据**：
   ```sh
   node src/db/seedRbacEntity.js
   ```

## 五、文件存储说明

若 `UPLOAD_TYPE` 设置为 `local`，请确保 `src/public` 目录下存在相应的存储文件夹（如 `local`, `online` 等），系统会自动根据配置保存上传的文件。

## 六、Git 操作指南

```bash
# 提交代码
git add .
git commit -m "feat: your message"
git push origin main
```
