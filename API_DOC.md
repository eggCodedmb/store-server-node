# Store Server API 接口文档

本文档详细说明了商城后端系统的 API 接口。

## 基础信息
- **Base URL**: `http://127.0.0.1:8800`
- **Content-Type**: `application/json`
- **认证方式**: Bearer Token (在 Header 中携带 `Authorization: Bearer <your_token>`)

---

## 1. 用户管理 (User)

### 1.1 用户注册
- **URL**: `/user/register`
- **Method**: `POST`
- **Request Body**: `user_name`, `password`, `email`, `captcha` (验证码)

### 1.2 用户登录
- **URL**: `/user/login`
- **Method**: `POST`
- **Request Body**: `user_name`, `password`, `captcha`

### 1.3 微信登录
- **URL**: `/user/wxlogin`
- **Method**: `POST`
- **Request Body**: `code` (微信登录凭证)

### 1.4 修改用户信息
- **URL**: `/user/change-user`
- **Method**: `PATCH`
- **Auth**: Required
- **Request Body**: `nick_name`, `avatar`, `gender` 等

### 1.5 获取权限清单
- **URL**: `/user/permissions`
- **Method**: `GET`
- **Auth**: Required

---

## 2. 商品管理 (Goods)

### 2.1 获取商品列表 (分页/过滤)
- **URL**: `/goods`
- **Method**: `GET`
- **Query Params**: `pageNum`, `pageSize`, `name`, `categoryId`, `storeId`, `stockFilter` (low/out_of_stock/in_stock)

### 2.2 获取商品详情
- **URL**: `/goods/detail/:id`
- **Method**: `GET`
- **说明**: 返回包含规格组 (`SpecGroup`) 和规格选项 (`SpecOption`) 的详细信息。

### 2.3 创建商品 (管理员)
- **URL**: `/goods`
- **Method**: `POST`
- **Auth**: Required + Admin
- **Request Body**: `goods_name`, `goods_price`, `goods_num`, `goods_img`, `specs` (规格定义数组) 等

### 2.4 商品搜索
- **URL**: `/goods/search_goods`
- **Method**: `GET`
- **Query Params**: `name` (搜索关键词)

---

## 3. 订单管理 (Order)

### 3.1 获取订单列表 (后台/通用)
- **URL**: `/order`
- **Method**: `POST`
- **Request Body**: `pageNum`, `pageSize`, `userId`, `order_type`, `order_number`, `state`

### 3.2 创建新订单 (益禾堂小程序)
- **URL**: `/order/create_new`
- **Method**: `POST`
- **Request Body**: `items` (数组), `order_type` (1:自提, 2:外卖), `address_id`, `remark`

### 3.3 模拟支付
- **URL**: `/order/pay`
- **Method**: `POST`
- **Request Body**: `id` (订单ID)

### 3.4 获取“我的”订单 (小程序)
- **URL**: `/order/my`
- **Method**: `GET`
- **Query Params**: `pageNum`, `pageSize`, `order_type`, `state`

---

## 4. 地址管理 (Address)

### 4.1 获取当前用户地址列表
- **URL**: `/address/findAll`
- **Method**: `POST`
- **Auth**: Required

### 4.2 添加新地址
- **URL**: `/address`
- **Method**: `POST`
- **Request Body**: `consignee`, `phone`, `address`, `is_default`

### 4.3 修改地址
- **URL**: `/address/edit`
- **Method**: `POST`
- **Request Body**: `id`, `consignee`, `phone`, `address`, `is_default`

### 4.4 设置默认地址
- **URL**: `/address/update_default`
- **Method**: `POST`
- **Request Body**: `id`

---

## 5. 分类管理 (Category)

### 5.1 获取所有分类
- **URL**: `/category`
- **Method**: `GET`

### 5.2 获取分类下的商品
- **URL**: `/category/:id/goods`
- **Method**: `GET`

---

## 6. 权限管理 (RBAC)
*注：此模块通常供后台管理系统使用。*

### 6.1 获取角色列表
- **URL**: `/rbac/roles`
- **Method**: `GET`

### 6.2 获取权限列表
- **URL**: `/rbac/permissions`
- **Method**: `GET`

---

## 附录：状态码说明

### 订单状态 (state)
- `0`: 待支付
- `1`: 制作中 / 已支付
- `2`: 待取餐 / 配送中
- `3`: 已完成
- `4`: 已取消

### 订单类型 (order_type)
- `1`: 自提
- `2`: 外卖
