const Category = require("../model/product/category");
const Goods = require("../model/product/goods");
const { Op } = require("sequelize");

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
  async findAllCategories() {
    return await Category.findAll();
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
  async findGoodsByCategory(categoryId, pageNum = 1, pageSize = 10) {
    const offset = (pageNum - 1) * pageSize;
    const { count, rows } = await Goods.findAndCountAll({
      include: [
        {
          model: Category,
          where: { id: categoryId },
          attributes: [],
          through: { attributes: [] },
        },
      ],
      offset: +offset,
      limit: +pageSize,
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
