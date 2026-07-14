const Cart = require("../model/cart/cart");
const Goods = require("../model/product/goods");
const { Op } = require("sequelize");

class CartService {
  /**
   * 创建或更新购物车条目
   * @param {number} user_id - 用户ID
   * @param {number} goods_id - 商品ID
   * @param {string} specs - 商品规格快照
   * @returns {Promise<Object>} - 返回创建或更新的购物车条目
   */
  async createOrUpdate(user_id, goods_id, specs = null, store_id = null) {
    try {
      const goods = await Goods.findByPk(goods_id);
      if (!goods) {
        const error = new Error("商品不存在");
        error.code = "10205";
        throw error;
      }
      if (store_id && goods.store_id !== store_id) {
        const error = new Error("该商品不在当前选中门店");
        error.code = "10305";
        throw error;
      }
      if (goods.goods_num <= 0) {
        const error = new Error("该商品已售罄或库存不足");
        error.code = "10306";
        throw error;
      }

      const res = await Cart.findOne({
        where: {
          [Op.and]: {
            user_id,
            goods_id,
            specs: specs || null,
          },
        },
      });
      if (res) {
        // 检查加 1 后的库存是否足够
        if (goods.goods_num < res.number + 1) {
          const error = new Error("该商品库存不足");
          error.code = "10306";
          throw error;
        }
        // 已经存在一条记录，增加数量
        await res.increment("number");
        return await res.reload(); // 返回更新后的记录
      } else {
        return await Cart.create({ user_id, goods_id, specs });
      }
    } catch (error) {
      throw error;
    }
  }
  /**
   *
   * @param {number} id 购物车id
   * @returns {Promise<Object>} - 返回一条购物车
   */
  async oneUserCart(id, user_id) {
    try {
      const res = await Cart.findOne({
        where: { id, user_id },
        include: { model: Goods, as: "product" },
      });

      return res;
    } catch (error) {
      throw error;
    }
  }

  async oneUserCarts(user_id, pageNum = 1, pageSize = 5, store_id = null) {
    try {
      const offset = (pageNum - 1) * pageSize;
      const { count, rows } = await Cart.findAndCountAll({
        where: { user_id },
        offset: +offset,
        limit: +pageSize,
        order: [["createdAt", "DESC"]],
        include: {
          model: Goods,
          as: "product",
        },
      });

      // 如果提供了 store_id，进行库存和门店匹配校验
      if (store_id && rows.length > 0) {
        // 找出所有不在当前门店的商品名称 (去重)
        const otherStoreProductNames = [
          ...new Set(
            rows
              .filter((r) => r.product && r.product.store_id != store_id)
              .map((r) => r.product.goods_name)
          ),
        ];

        let matchingMap = new Map();
        if (otherStoreProductNames.length > 0) {
          const matchingProducts = await Goods.findAll({
            where: {
              goods_name: { [Op.in]: otherStoreProductNames },
              store_id: store_id,
            },
          });
          matchingProducts.forEach((p) => matchingMap.set(p.goods_name, p));
        }

        rows.forEach((row) => {
          if (!row.product) {
            row.setDataValue("is_available", false);
            row.setDataValue("selected", false); // 不加入购物车计算
            return;
          }

          if (row.product.store_id == store_id) {
            // 在当前门店，只需检查库存
            const available = row.product.goods_num > 0;
            row.setDataValue("is_available", available);
            if (!available) {
              row.setDataValue("selected", false); // 不加入购物车计算
            }
          } else {
            // 不在当前门店，检查是否有同名商品且有库存
            const match = matchingMap.get(row.product.goods_name);
            if (match && match.goods_num > 0) {
              row.setDataValue("is_available", true);
              row.setDataValue("matching_product", match);
            } else {
              row.setDataValue("is_available", false);
              row.setDataValue("selected", false); // 不加入购物车计算
            }
          }
        });
      }

      const totalPages = Math.ceil(count / pageSize);
      pageNum = Math.min(pageNum, totalPages);
      return {
        pageNum,
        pageSize: +pageSize,
        total: totalPages,
        list: rows,
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 选中的购物车条目
   * @param {number} user_id  用户ID
   * @param {Array} ids  购物车条目ID数组
   * @returns
   */
  async updateChecke(userId, ids) {
    try {
      // 如果没有选中任何条目，则将所有条目的 selected 设置为 false
      if (ids.length === 0) {
        new CartService().selectALllCarts(userId, false);
        return 0;
      }
      // 使用事务保证两个更新操作的原子性
      const result = await Cart.sequelize.transaction(async (t) => {
        // 1. 先将所有条目的 selected 设置为 false
        await Cart.update(
          { selected: false },
          {
            where: { user_id: userId },
            transaction: t,
          }
        );

        // 2. 再将指定条目的 selected 设置为 true
        const res = await Cart.update(
          { selected: true },
          {
            where: {
              id: {
                [Op.in]: ids,
              },
              user_id: userId,
            },
            transaction: t,
          }
        );
        
        return res;
      });

      return result;
    } catch (error) {
      throw error;
    }
  }

  async updateNumber(id, number, store_id = null) {
    try {
      const cart = await Cart.findByPk(id, {
        include: { model: Goods, as: "product" }
      });
      if (!cart) {
        const error = new Error("购物车记录不存在");
        error.code = "10304";
        throw error;
      }
      if (!cart.product) {
        const error = new Error("商品不存在");
        error.code = "10205";
        throw error;
      }
      if (store_id && cart.product.store_id !== store_id) {
        const error = new Error("该商品不在当前选中门店");
        error.code = "10305";
        throw error;
      }
      if (cart.product.goods_num < number) {
        const error = new Error("库存不足");
        error.code = "10306";
        throw error;
      }
      const res = await Cart.update(
        { number },
        {
          where: {
            id,
          },
        }
      );
      return res;
    } catch (error) {
      throw error;
    }
  }

  async removeCarts(ids) {
    const res = await Cart.destroy({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
    });
    return res;
  }

  async selectALllCarts(user_id, isSelect) {
    return await Cart.update(
      { selected: isSelect },
      {
        where: {
          user_id,
        },
      }
    );
  }

  /**
   * 计算购物车选中商品的总价
   * @param {number} user_id 用户ID
   * @returns {Promise<string>} 总价
   */
  async calculateTotal(user_id) {
    try {
      const carts = await Cart.findAll({
        where: {
          user_id,
          selected: true,
        },
        include: {
          model: Goods,
          as: "product",
          attributes: ["goods_price"],
        },
      });

      let total = 0;
      carts.forEach((item) => {
        if (item.product) {
          total += item.product.goods_price * item.number;
        }
      });

      return total.toFixed(2);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new CartService();
