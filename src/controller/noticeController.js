const {
  createNotice,
  updateNotice,
  removeNotice,
  findAllNotice,
  findNoticeById,
} = require("../service/noticeService");
const { NOTICE_ICONS } = require("../constant/noticeIcons");

class NoticeController {
  async getIcons(ctx) {
    ctx.body = {
      code: 0,
      message: "获取图标列表成功",
      result: NOTICE_ICONS,
    };
  }

  async create(ctx) {
    try {
      const notice = ctx.request.body;
      const res = await createNotice(notice);
      ctx.body = {
        code: 0,
        message: "发布公告成功",
        result: res,
      };
    } catch (error) {
      console.error(error);
      ctx.app.emit("error", { code: "10701", message: "发布公告失败" }, ctx);
    }
  }

  async update(ctx) {
    try {
      const id = ctx.params.id;
      const notice = ctx.request.body;
      const res = await updateNotice(id, notice);
      if (res) {
        ctx.body = {
          code: 0,
          message: "更新公告成功",
          result: "",
        };
      } else {
        ctx.app.emit("error", { code: "10702", message: "更新公告失败" }, ctx);
      }
    } catch (error) {
      console.error(error);
      ctx.app.emit("error", { code: "10702", message: "更新公告失败" }, ctx);
    }
  }

  async deleteNotice(ctx) {
    try {
      const id = ctx.params.id;
      const res = await removeNotice(id);
      if (res) {
        ctx.body = {
          code: 0,
          message: "删除公告成功",
          result: "",
        };
      } else {
        ctx.app.emit("error", { code: "10703", message: "删除公告失败" }, ctx);
      }
    } catch (error) {
      console.error(error);
      ctx.app.emit("error", { code: "10703", message: "删除公告失败" }, ctx);
    }
  }

  async findAll(ctx) {
    try {
      const { pageNum, pageSize, title } = ctx.request.body;
      const res = await findAllNotice(pageSize, pageNum, title);
      ctx.body = {
        code: 0,
        message: "获取公告列表成功",
        result: res,
      };
    } catch (error) {
      console.error(error);
      ctx.app.emit("error", { code: "10704", message: "获取公告列表失败" }, ctx);
    }
  }

  async getDetail(ctx) {
    try {
      const id = ctx.params.id;
      const res = await findNoticeById(id);
      if (res) {
        ctx.body = {
          code: 0,
          message: "获取公告详情成功",
          result: res,
        };
      } else {
        ctx.app.emit("error", { code: "10705", message: "公告不存在" }, ctx);
      }
    } catch (error) {
      console.error(error);
      ctx.app.emit("error", { code: "10705", message: "获取公告详情失败" }, ctx);
    }
  }
}

module.exports = new NoticeController();
