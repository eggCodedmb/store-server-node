const { SpecGroup, SpecOption, ProductSpecRel } = require("../model/index");
const sequelize = require("../db/seq");

class SpecController {
  async findAll(ctx) {
    try {
      const res = await SpecGroup.findAll({
        include: [
          {
            model: SpecOption,
            attributes: ["id", "name", "price_delta", "is_default"],
          },
        ],
      });
      ctx.body = {
        code: 0,
        message: "获取规格列表成功",
        result: res,
      };
    } catch (error) {
      console.error(error);
      ctx.app.emit("error", { code: 500, message: "获取规格失败" }, ctx);
    }
  }

  async create(ctx) {
    const { name, select_type, is_required, options } = ctx.request.body;
    try {
      const group = await SpecGroup.create({ name, select_type, is_required });
      if (options && options.length > 0) {
        const specOptions = options.map((opt) => ({
          name: opt.name,
          price_delta: opt.price_delta || 0,
          is_default: opt.is_default || false,
          group_id: group.id,
        }));
        await SpecOption.bulkCreate(specOptions);
      }
      ctx.body = {
        code: 0,
        message: "创建公共规格成功",
        result: group,
      };
    } catch (error) {
      console.error(error);
      ctx.app.emit("error", { code: 500, message: "创建规格失败" }, ctx);
    }
  }

  async update(ctx) {
    const { id } = ctx.params;
    const { name, select_type, is_required, options } = ctx.request.body;
    const transaction = await sequelize.transaction();
    try {
      await SpecGroup.update(
        { name, select_type, is_required },
        { where: { id }, transaction }
      );

      // 先删除旧选项，再创建新选项（简单粗暴但有效）
      await SpecOption.destroy({
        where: { group_id: id },
        force: true,
        transaction,
      });

      if (options && options.length > 0) {
        const specOptions = options.map((opt) => ({
          name: opt.name,
          price_delta: opt.price_delta || 0,
          is_default: opt.is_default || false,
          group_id: id,
        }));
        await SpecOption.bulkCreate(specOptions, { transaction });
      }

      await transaction.commit();
      ctx.body = {
        code: 0,
        message: "修改公共规格成功",
        result: true,
      };
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      ctx.app.emit("error", { code: 500, message: "修改规格失败" }, ctx);
    }
  }

  async delete(ctx) {
    const { id } = ctx.params;
    try {
      // 检查是否有商品正在引用该规格
      const count = await ProductSpecRel.count({ where: { group_id: id } });
      if (count > 0) {
        return ctx.body = {
          code: 400,
          message: `删除失败，该规格正在被 ${count} 个商品使用，请先解绑或删除相关商品`,
        };
      }

      await SpecGroup.destroy({ where: { id }, force: true });
      await SpecOption.destroy({ where: { group_id: id }, force: true });
      
      ctx.body = {
        code: 0,
        message: "删除公共规格成功",
        result: true,
      };
    } catch (error) {
      console.error(error);
      ctx.app.emit("error", { code: 500, message: "删除规格失败" }, ctx);
    }
  }
}

module.exports = new SpecController();
