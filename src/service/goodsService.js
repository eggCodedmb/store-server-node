const { Op, fn, col, literal, QueryTypes, where } = require("sequelize");
const Goods = require("../model/product/goods");
const OrderItem = require("../model/order/orderItem");
const { setData, getData, delKeyAll } = require("../utils/redis");
const sequelize = require("../db/seq");

class GoodsService {
  async createGoods(goodsData) {
    const transaction = await sequelize.transaction();
    try {
      const { specs, ...goodsBase } = goodsData;
      const { SpecGroup, SpecOption, ProductSpecRel } = require("../model/index");

      const res = await Goods.create(goodsBase, { transaction });
      const product_id = res.id;

      if (specs && Array.isArray(specs)) {
        for (const spec of specs) {
          if (!spec.name || spec.name.trim() === "") continue;

          let group_id = spec.id;
          if (!group_id) {
            const group = await SpecGroup.create(
              {
                name: spec.name,
                select_type: spec.select_type || "single",
                is_required:
                  spec.is_required !== undefined ? spec.is_required : true,
              },
              { transaction }
            );
            group_id = group.id;
            if (spec.options && Array.isArray(spec.options)) {
              const options = spec.options
                .filter((opt) => opt.name && opt.name.trim() !== "")
                .map((opt) => ({
                  group_id: group_id,
                  name: opt.name,
                  price_delta: opt.price_delta,
                  is_default: opt.is_default || false,
                }));
              if (options.length > 0) {
                await SpecOption.bulkCreate(options, { transaction });
              }
            }
          }

          await ProductSpecRel.create({ product_id, group_id }, { transaction });
        }
      }

      await transaction.commit();
      await delKeyAll("product:*");
      return res.dataValues;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async updateGoods(id, data) {
    const transaction = await sequelize.transaction();
    try {
      const { specs, ...goodsData } = data;
      const res = await Goods.update(goodsData, { where: { id }, transaction });

      if (specs && Array.isArray(specs)) {
        const { SpecGroup, SpecOption, ProductSpecRel } = require("../model/index");

        // 1. 先记录旧的关联 ID，用于后续清理
        const oldRels = await ProductSpecRel.findAll({
          where: { product_id: id },
          transaction,
        });
        const oldGroupIds = [...new Set(oldRels.map((rel) => rel.group_id))];

        // 2. 解除当前商品的所有规格关联
        await ProductSpecRel.destroy({ where: { product_id: id }, transaction });

        // 3. 建立新的关联（如果规格已存在则重用，不存在则创建）
        for (const spec of specs) {
          if (!spec.name || spec.name.trim() === "") continue;

          let group_id = spec.id;
          if (!group_id) {
            // 自定义规格：创建新记录
            const group = await SpecGroup.create(
              {
                name: spec.name,
                select_type: spec.select_type || "single",
                is_required:
                  spec.is_required !== undefined ? spec.is_required : true,
              },
              { transaction }
            );
            group_id = group.id;
            if (spec.options && Array.isArray(spec.options)) {
              const options = spec.options
                .filter((opt) => opt.name && opt.name.trim() !== "")
                .map((opt) => ({
                  group_id: group_id,
                  name: opt.name,
                  price_delta: opt.price_delta,
                  is_default: opt.is_default || false,
                }));
              if (options.length > 0) {
                await SpecOption.bulkCreate(options, { transaction });
              }
            }
          }
          
          // 重新建立关联
          await ProductSpecRel.create(
            { product_id: id, group_id },
            { transaction }
          );
        }

        // 4. 最后一步：清理真正的“孤儿”数据
        // 只有那些在新的关联建立后，依然没有任何商品引用的规格组，才会被删除
        for (const oldGroupId of oldGroupIds) {
          const count = await ProductSpecRel.count({ where: { group_id: oldGroupId }, transaction });
          if (count === 0) {
            await SpecGroup.destroy({ where: { id: oldGroupId }, force: true, transaction });
            await SpecOption.destroy({ where: { group_id: oldGroupId }, force: true, transaction });
          }
        }
      }

      await transaction.commit();
      await delKeyAll("product:*");
      return res[0] > 0 ? true : false;
    } catch (error) {
      await transaction.rollback();
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
        ids = Array.isArray(payload.id) ? payload.id : [payload.id];
      }

      if (ids.length === 0) return;

      const result = await Goods.update({ status: 0 }, { where: { id: { [Op.in]: ids } } });
      await delKeyAll("product:*");
      return result;
    } catch (error) {
      throw error;
    }
  }

  async restoreGoods(arr) {
    try {
      let ids = [];
      if (Array.isArray(arr)) {
        ids = arr;
      } else if (arr && Array.isArray(arr.ids)) {
        ids = arr.ids;
      } else if (arr && arr.id) {
        ids = Array.isArray(arr.id) ? arr.id : [arr.id];
      }
      if (ids.length === 0) return;
      const result = await Goods.update({ status: 1 }, { where: { id: { [Op.in]: ids } } });
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
          status = "",
        stockFilter = "",
        sortField = "id",
        sortOrder = "DESC",
        categoryId = "",
        storeId = "",
      } = queryParams;

      const whereOpt = {};
      if (status !== "") {
          whereOpt.status = status;
        }
        if (name) {
        whereOpt.goods_name = { [Op.like]: `%${name}%` };
      }
      if (storeId) {
        if (Array.isArray(storeId)) {
          whereOpt.store_id = { [Op.in]: storeId };
        } else if (typeof storeId === "string" && storeId.includes(",")) {
          whereOpt.store_id = { [Op.in]: storeId.split(",") };
        } else {
          whereOpt.store_id = storeId;
        }
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

  async getRemoveGoods(pageNum = 1, pageSize = 10, storeId = "") {
    try {
      const offset = (pageNum - 1) * pageSize;
      const whereOpt = { status: 0 };
      if (storeId) {
        if (Array.isArray(storeId)) {
          whereOpt.store_id = { [Op.in]: storeId };
        } else if (typeof storeId === "string" && storeId.includes(",")) {
          whereOpt.store_id = { [Op.in]: storeId.split(",") };
        } else {
          whereOpt.store_id = storeId;
        }
      }
      const { count, rows } = await Goods.findAndCountAll({
        where: whereOpt,
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
        attributes: [
          "id",
          "goods_name",
          "goods_price",
          "goods_num",
          "goods_img",
          "goods_detail",
          "store_id",
          "status",
        ],
        where: { id: { [Op.in]: arr } },
      });
      return res ? res : null;
    } catch (error) {
      throw error;
    }
  }

  async searchGoodsByName(name, number = 10, storeId = "") {
    try {
      const whereOpt = { goods_name: { [Op.like]: `%${name}%` }, status: 1 };
      if (storeId) {
        if (Array.isArray(storeId)) {
          whereOpt.store_id = { [Op.in]: storeId };
        } else if (typeof storeId === "string" && storeId.includes(",")) {
          whereOpt.store_id = { [Op.in]: storeId.split(",") };
        } else {
          whereOpt.store_id = storeId;
        }
      }
      const res = await Goods.findAll({
        where: whereOpt,
        limit: +number,
      });
      return res ? res : null;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async queryNewGoogdsAll(pageNum = 1, pageSize = 10, storeId = "") {
    try {
      const offset = (pageNum - 1) * pageSize;
      const whereOpt = { status: 1 };
      if (storeId) {
        if (Array.isArray(storeId)) {
          whereOpt.store_id = { [Op.in]: storeId };
        } else if (typeof storeId === "string" && storeId.includes(",")) {
          whereOpt.store_id = { [Op.in]: storeId.split(",") };
        } else {
          whereOpt.store_id = storeId;
        }
      }
      const count = await Goods.count({ where: whereOpt });
      const res = await Goods.findAll({
        where: whereOpt,
        offset: +offset,
        limit: +pageSize,
        order: [["createdAt", "DESC"]],
      });
      return { pageNum: +pageNum, pageSize: +pageSize, total: count, list: res };
    } catch (error) {
      throw error;
    }
  }

  async getGoodsWithTotalSales(pageNum = 1, pageSize = 10, order = "ASC", storeId = "") {
    try {
      const offset = (pageNum - 1) * pageSize;
      let sql = `
        SELECT goods.*, COALESCE(SUM(order_items.quantity), 0) AS totalSales
        FROM goods
        LEFT JOIN order_items ON goods.id = order_items.goods_id
        WHERE goods.status = 1
      `;
      if (storeId) {
        if (Array.isArray(storeId)) {
          sql += ` AND goods.store_id IN (${storeId.map(id => sequelize.escape(id)).join(",")})`;
        } else if (typeof storeId === "string" && storeId.includes(",")) {
          sql += ` AND goods.store_id IN (${storeId.split(",").map(id => sequelize.escape(id.trim())).join(",")})`;
        } else {
          sql += ` AND goods.store_id = ${sequelize.escape(storeId)}`;
        }
      }
      sql += `
        GROUP BY goods.id
        ORDER BY totalSales ${order}
        LIMIT ${pageSize}
        OFFSET ${offset}
      `;
      
      const whereOpt = {};
      if (storeId) {
        if (Array.isArray(storeId)) {
          whereOpt.store_id = { [Op.in]: storeId };
        } else if (typeof storeId === "string" && storeId.includes(",")) {
          whereOpt.store_id = { [Op.in]: storeId.split(",") };
        } else {
          whereOpt.store_id = storeId;
        }
      }
      
      const [res, count] = await Promise.all([
        sequelize.query(sql, { type: QueryTypes.SELECT }),
        Goods.count({ where: whereOpt }),
      ]);
      return { pageNum: +pageNum, pageSize: +pageSize, total: count, list: res };
    } catch (error) {
      throw error;
    }
  }

  async productInventory(id, quantity, transaction) {
    try {
      const product = await Goods.findOne({ 
        where: { id }, 
        transaction,
        lock: transaction.LOCK.UPDATE 
      });
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

  async getGoodsDetailById(id) {
    const { SpecGroup, SpecOption, Store } = require("../model/index");
    const res = await Goods.findOne({
      where: { id },
      include: [
        {
          model: require("../model/product/category"),
          through: { attributes: [] },
        },
        {
          model: Store,
          attributes: ["id", "name"],
        },
        {
          model: SpecGroup,
          through: { attributes: [] },
          include: [
            {
              model: SpecOption,
              attributes: ["id", "name", "price_delta", "is_default"],
            },
          ],
          attributes: ["id", "name", "select_type", "is_required"],
        },
      ],
    });
    return res;
  }
}

module.exports = new GoodsService();
