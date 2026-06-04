const checkinService = require("../service/checkinService");
const {
  checkinFormError,
  checkinAlreadyDoneError,
  checkinRewardConfigError,
} = require("../constant/errType");

class CheckinController {
  /**
   * 获取用户签到状态（小程序端）
   */
  async getStatus(ctx) {
    try {
      const userId = ctx.state.user.id;
      const res = await checkinService.getStatus(userId);
      ctx.body = { code: 0, message: "查询成功", result: res };
    } catch (error) {
      console.error(error);
      ctx.body = { code: 500, message: error.message };
    }
  }

  /**
   * 执行签到（小程序端）
   */
  async doCheckin(ctx) {
    try {
      const userId = ctx.state.user.id;
      const res = await checkinService.doCheckin(userId);
      ctx.body = { code: 0, message: "签到成功", result: res };
    } catch (error) {
      console.error(error);
      if (error.message === "今日已签到，请勿重复") {
        checkinAlreadyDoneError.message = error.message;
        ctx.app.emit("error", checkinAlreadyDoneError, ctx);
      } else {
        checkinFormError.message = error.message;
        ctx.app.emit("error", checkinFormError, ctx);
      }
    }
  }

  /**
   * 查询签到奖励配置（管理端）
   */
  async getRewards(ctx) {
    try {
      const res = await checkinService.getRewards();
      ctx.body = { code: 0, message: "查询成功", result: res };
    } catch (error) {
      console.error(error);
      ctx.body = { code: 500, message: error.message };
    }
  }

  /**
   * 更新签到奖励配置（管理端）
   */
  async updateRewards(ctx) {
    try {
      const { rewards } = ctx.request.body;
      const res = await checkinService.updateRewards(rewards);
      ctx.body = { code: 0, message: "更新成功", result: res };
    } catch (error) {
      console.error(error);
      checkinRewardConfigError.message = error.message;
      ctx.app.emit("error", checkinRewardConfigError, ctx);
    }
  }

  /**
   * 查询签到记录（管理端）
   */
  async getRecords(ctx) {
    try {
      const { pageNum, pageSize, user_id, start_date, end_date } = ctx.query;
      const res = await checkinService.getRecords(
        { user_id, start_date, end_date },
        pageNum,
        pageSize
      );
      ctx.body = { code: 0, message: "查询成功", result: res };
    } catch (error) {
      console.error(error);
      ctx.body = { code: 500, message: error.message };
    }
  }
}

module.exports = new CheckinController();
