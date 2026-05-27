const User = require("./user/user");
const Goods = require("./product/goods");
const Cart = require("./cart/cart");
const Address = require("./address/address");
const Order = require("./order/order");
const OrderItem = require("./order/orderItem");
const Category = require("./product/category");
const GoodsCategory = require("./product/goodsAndCategory");

// RBAC Models
const Role = require("./rbac/Role");
const Permission = require("./rbac/Permission");
const { UserRole, RolePermission } = require("./rbac/Mapping");

// 用户和订单关联关系
User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

// 订单与订单项关联关系
Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

// 用户和地址关联关系
User.hasMany(Address, { foreignKey: "user_id" });
Address.belongsTo(User, { foreignKey: "user_id" });

// 用户和购物车关联关系
User.hasMany(Cart, { foreignKey: "user_id" });
Cart.belongsTo(User, { foreignKey: "user_id" });

// 购物车和商品关联关系
Goods.hasMany(Cart, { foreignKey: "goods_id" });
Cart.belongsTo(Goods, { foreignKey: "goods_id", as: "product" });

// 订单项和商品关联关系
OrderItem.belongsTo(Goods, {
  foreignKey: "goods_id",
  as: "product",
  sourceKey: "id",
});
Goods.hasMany(OrderItem, { foreignKey: "goods_id", targetKey: "id" });

// 地址和订单关系
Address.hasMany(Order, { foreignKey: "address_id" });
Order.belongsTo(Address, { foreignKey: "address_id" });

// 商品和分类关联关系 (多对多)
Goods.belongsToMany(Category, {
  through: GoodsCategory,
  foreignKey: "goods_id",
});
Category.belongsToMany(Goods, {
  through: GoodsCategory,
  foreignKey: "category_id",
});

/**
 * RBAC 关联关系
 */
// 1. 用户与角色 (多对多)
User.belongsToMany(Role, { through: UserRole, foreignKey: "userId" });
Role.belongsToMany(User, { through: UserRole, foreignKey: "roleId" });

// 2. 角色与权限 (多对多)
Role.belongsToMany(Permission, { through: RolePermission, foreignKey: "roleId" });
Permission.belongsToMany(Role, { through: RolePermission, foreignKey: "permissionId" });

module.exports = {
  User,
  Goods,
  Cart,
  Address,
  Order,
  OrderItem,
  Role,
  Permission,
  UserRole,
  RolePermission,
  Category,
  GoodsCategory,
};
