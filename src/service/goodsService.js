const { Op, fn, col, literal, QueryTypes, where } = require("sequelize");
const Goods = require("../model/product/goods");
const OrderItem = require("../model/order/orderItem");
const { setData, getData, delKeyAll } = require("../utils/redis");
const sequelize = require("../db/seq");

class GoodsService {
  async createGoods(goods) {
    try {
      const res = await Goods.create(goods);
      await delKeyAll("product:*");
      return res.dataValues ? res.dataValues : null;
    } catch (error) {
      throw error;
    }
  }

  async updateGoods(id, data) {
    try {
      const res = await Goods.update(data, { where: { id } });
      await delKeyAll("product:*");
      return res[0] > 0 ? true : false;
    } catch (error) {
      console.error("Error updating goods:", error);
      throw error;
    }
  }

  async removeGoods(payload) {
    try {
      let ids = [];
      if (Array.isArray(payload)) {
        ids = payload;
      } else if (payload && Array.isArray(payload.ids)) {
        ids = payload.ids;
      } else if (payload && payload.id) {
        ids = [payload.id];
      }

      if (ids.length === 0) return;
      
      const result = await Goods.destroy({ where: { id: { [Op.in]: ids } } });
      await delKeyAll("product:*");
      return result;
    } catch (error) {
      throw error;
    }
  }

  async restoreGoods(arr) {
    try {
      const promises = arr.map((item) => Goods.restore({ where: { id: item } }));
      const result = await Promise.all(promises);
      await delKeyAll("product:*");
      return result;
    } catch (error) {
      throw error;
    }
  }

  async findGoods(queryParams = {}) {
    try {
      const { 
        pageNum = 1, 
        pageSize = 10, 
        name = "", 
        stockFilter = "", 
        sortField = "id", 
        sortOrder = "DESC",
        categoryId = ""
      } = queryParams;

      const whereOpt = {};
      if (name) {
        whereOpt.goods_name = { [Op.like]: `%${name}%` };
      }

      if (stockFilter === "low") {
        whereOpt.goods_num = { [Op.lt]: 10, [Op.gt]: 0 };
      } else if (stockFilter === "out_of_stock") {
        whereOpt.goods_num = 0;
      } else if (stockFilter === "in_stock") {
        whereOpt.goods_num = { [Op.gte]: 10 };
      }

      const offset = (pageNum - 1) * pageSize;

      const include = [
        {
          model: require("../model/product/category"),
          through: { attributes: [] },
          where: categoryId ? { id: categoryId } : undefined,
          required: categoryId ? true : false,
        },
      ];

      const { count, rows } = await Goods.findAndCountAll({
        where: whereOpt,
        include,
        offset: +offset,
        limit: +pageSize,
        order: [[sortField, sortOrder]],
        distinct: true,
      });

      return {
        pageNum: +pageNum,
        pageSize: +pageSize,
        total: count,
        list: rows,
      };
    } catch (error) {
      throw error;
    }
  }

  async getRemoveGoods(pageNum = 1, pageSize = 10) {
    try {
      const offset = (pageNum - 1) * pageSize;
      const { count, rows } = await Goods.findAndCountAll({
        where: { deletedAt: { [Op.not]: null } },
        paranoid: false,
        offset: +offset,
        limit: +pageSize,
      });
      return { pageNum, pageSize, total: count, list: rows };
    } catch (error) {
      throw error;
    }
  }

  async findAllGoodsById(arr) {
    try {
      const res = await Goods.findAll({
        attributes: ["id", "goods_name", "goods_price", "goods_num", "goods_img"],
        where: { id: { [Op.in]: arr } },
      });
      return res ? res : null;
    } catch (error) {
      throw error;
    }
  }

  async searchGoodsByName(name, number = 10) {
    try {
      const res = await Goods.findAll({
        where: { goods_name: { [Op.like]: `%${name}%` }, deletedAt: null },
        limit: +number,
      });
      return res ? res : null;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async queryNewGoogdsAll(pageNum = 1, pageSize = 10) {
    try {
      const offset = (pageNum - 1) * pageSize;
      const count = await Goods.count();
      const res = await Goods.findAll({
        offset: +offset,
        limit: +pageSize,
        order: [["createdAt", "DESC"]],
      });
      return { pageNum: +pageNum, pageSize: +pageSize, total: count, list: res };
    } catch (error) {
      throw error;
    }
  }

  async getGoodsWithTotalSales(pageNum = 1, pageSize = 10, order = "ASC") {
    try {
      const offset = (pageNum - 1) * pageSize;
      const sql = `
        SELECT goods.*, COALESCE(SUM(order_items.quantity), 0) AS totalSales
        FROM goods
        LEFT JOIN order_items ON goods.id = order_items.goods_id
        WHERE goods.deletedAt IS NULL
        GROUP BY goods.id
        ORDER BY totalSales ${order}
        LIMIT ${pageSize}
        OFFSET ${offset}
      `;
      const [res, count] = await Promise.all([
        sequelize.query(sql, { type: QueryTypes.SELECT }),
        Goods.count(),
      ]);
      return { pageNum: +pageNum, pageSize: +pageSize, total: count, list: res };
    } catch (error) {
      throw error;
    }
  }

  async productInventory(id, quantity, transaction) {
    try {
      const product = await Goods.findOne({ where: { id }, transaction });
      if (!product) throw new Error("商品不存在");
      if (product.goods_num < quantity) throw new Error("库存不足");
      const updatedProduct = await product.update(
        { goods_num: product.goods_num - quantity },
        { transaction }
      );
      return updatedProduct;
    } catch (error) {
      console.error("更新库存失败:", error);
      throw error;
    }
  }

  async getProductById(id) {
    const res = await Goods.findOne({ 
      where: { id },
      include: [{
        model: require("../model/product/category"),
        through: { attributes: [] }
      }]
    });
    return res;
  }
}

module.exports = new GoodsService();
