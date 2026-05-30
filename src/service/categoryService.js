const Category = require("../model/product/category");
const Goods = require("../model/product/goods");
const { Op } = require("sequelize");
const sequelize = require("../db/seq");

class CategoryService {
  /**
   * 创建分类
   */
  async createCategory(category) {
    const res = await Category.create(category);
    return res.dataValues;
  }

  /**
   * 更新分类
   */
  async updateCategory(id, data) {
    const res = await Category.update(data, { where: { id } });
    return res[0] > 0;
  }

  /**
   * 删除分类
   */
  async removeCategory(id) {
    const res = await Category.destroy({ where: { id } });
    return res > 0;
  }

  /**
   * 获取分类列表
   */
  async findAllCategories(storeId) {
    const whereOpt = {};
    if (storeId) {
      const { Goods } = require("../model/index");
      whereOpt.id = {
        [Op.in]: sequelize.literal(`(
          SELECT DISTINCT category_id 
          FROM goods_category 
          JOIN goods ON goods.id = goods_category.goods_id 
          WHERE goods.store_id = ${sequelize.escape(storeId)}
        )`),
      };
    }

    return await Category.findAll({
      where: whereOpt,
      order: [
        ["order_num", "ASC"],
        ["createdAt", "DESC"],
      ],
    });
  }

  /**
   * 根据ID查找分类
   */
  async findCategoryById(id) {
    return await Category.findByPk(id);
  }

  /**
   * 获取分类下商品
   */
  async findGoodsByCategory(categoryId, pageNum = 1, pageSize = 10, storeId = "") {
    const offset = (pageNum - 1) * pageSize;
    const { Category } = require("../model/index");
    
    const whereOpt = {};
    if (storeId) {
      whereOpt.store_id = storeId;
    }

    const { count, rows } = await Goods.findAndCountAll({
      where: whereOpt,
      include: [
        {
          model: Category,
          where: { id: categoryId },
          through: { attributes: [] },
          required: true,
        },
      ],
      offset: +offset,
      limit: +pageSize,
      distinct: true,
    });

    return {
      pageNum: +pageNum,
      pageSize: +pageSize,
      total: count,
      list: rows,
    };
  }

  /**
   * 为商品添加分类
   */
  async addGoodsToCategory(goodsId, categoryId) {
    const category = await Category.findByPk(categoryId);
    const goods = await Goods.findByPk(goodsId);
    if (category && goods) {
      await goods.addCategory(category);
      return true;
    }
    return false;
  }

  /**
   * 从分类中移除商品
   */
  async removeGoodsFromCategory(goodsId, categoryId) {
    const category = await Category.findByPk(categoryId);
    const goods = await Goods.findByPk(goodsId);
    if (category && goods) {
      await goods.removeCategory(category);
      return true;
    }
    return false;
  }
}

module.exports = new CategoryService();
