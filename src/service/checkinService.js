const CheckinReward = require("../model/checkin/checkinReward");
const CheckinRecord = require("../model/checkin/checkinRecord");
const CouponTemplate = require("../model/coupon/couponTemplate");
const UserCoupon = require("../model/coupon/userCoupon");
const User = require("../model/user/user");
const seq = require("../db/seq");
const { Op } = require("sequelize");

class CheckinService {
  /**
   * 获取今天的日期字符串 (YYYY-MM-DD)
   */
  getToday() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  /**
   * 获取昨天的日期字符串 (YYYY-MM-DD)
   */
  getYesterday() {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, "0");
    const d = String(now.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  /**
   * 查询签到奖励配置（7天）
   * @returns {Promise<Array>}
   */
  async getRewards() {
    const rewards = await CheckinReward.findAll({
      order: [["day_number", "ASC"]],
      include: [
        {
          model: CouponTemplate,
          attributes: ["id", "name", "type", "value", "min_spend", "end_time"],
        },
      ],
    });
    return rewards;
  }

  /**
   * 批量更新签到奖励配置
   * @param {Array} rewardsArray - [{ day_number, template_id }, ...]
   * @returns {Promise<Array>}
   */
  async updateRewards(rewardsArray) {
    const transaction = await seq.transaction();
    try {
      const results = [];
      for (const item of rewardsArray) {
        // 校验优惠券模板存在且启用
        const template = await CouponTemplate.findByPk(item.template_id, {
          transaction,
        });
        if (!template || template.status !== 1) {
          throw new Error(
            `优惠券模板 ID=${item.template_id} 不存在或已停用`
          );
        }

        // upsert: 查找或创建
        const [record, created] = await CheckinReward.findOrCreate({
          where: { day_number: item.day_number },
          defaults: { template_id: item.template_id },
          transaction,
        });

        if (!created) {
          await record.update({ template_id: item.template_id }, { transaction });
        }

        results.push(record);
      }

      await transaction.commit();

      // 返回完整配置（含模板信息）
      return this.getRewards();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 获取用户签到状态
   * @param {number} userId
   * @returns {Promise<Object>}
   */
  async getStatus(userId) {
    const today = this.getToday();

    // 检查今天是否已签到
    const todayRecord = await CheckinRecord.findOne({
      where: { user_id: userId, checkin_date: today },
    });

    // 计算当前连续签到天数
    const streak = await this.getStreak(userId);

    // 当前签到天数（今天已签到时）
    const currentDayNumber =
      todayRecord && streak > 0 ? ((streak - 1) % 7) + 1 : 0;

    // 下次签到的天数
    let nextDayNumber;
    if (todayRecord) {
      // 今天已签到，下次签到是明天
      nextDayNumber = (streak % 7) + 1;
    } else if (streak > 0) {
      // 今天未签到但有连续记录（昨天签到了）
      nextDayNumber = (streak % 7) + 1;
    } else {
      nextDayNumber = 1;
    }

    // 查询近7条签到记录
    const history = await CheckinRecord.findAll({
      where: { user_id: userId },
      order: [["checkin_date", "DESC"]],
      limit: 7,
      attributes: ["checkin_date", "day_number", "streak"],
    });

    // 查询7天奖励配置
    const rewards = await this.getRewards();

    return {
      streak,
      todayCheckedIn: !!todayRecord,
      todayRecord: todayRecord || null,
      currentDayNumber,
      nextDayNumber,
      history,
      rewards,
    };
  }

  /**
   * 计算用户连续签到天数
   * @param {number} userId
   * @returns {Promise<number>}
   */
  async getStreak(userId) {
    const records = await CheckinRecord.findAll({
      where: { user_id: userId },
      order: [["checkin_date", "DESC"]],
      limit: 30,
      attributes: ["checkin_date"],
    });

    if (records.length === 0) return 0;

    const today = this.getToday();
    const yesterday = this.getYesterday();

    // 如果最近一条记录不是今天也不是昨天，连续签到已断
    const latestDate = records[0].checkin_date;
    if (latestDate !== today && latestDate !== yesterday) {
      return 0;
    }

    // 从最近记录开始，连续计算天数
    let streak = 0;
    let expectedDate = new Date(latestDate);

    for (const record of records) {
      const recordDate = record.checkin_date;
      const y = expectedDate.getFullYear();
      const m = String(expectedDate.getMonth() + 1).padStart(2, "0");
      const d = String(expectedDate.getDate()).padStart(2, "0");
      const expected = `${y}-${m}-${d}`;

      if (recordDate === expected) {
        streak++;
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * 执行签到
   * @param {number} userId
   * @returns {Promise<Object>} { record, coupon }
   */
  async doCheckin(userId) {
    const today = this.getToday();
    const transaction = await seq.transaction();

    try {
      // 1. 检查今天是否已签到
      const existing = await CheckinRecord.findOne({
        where: { user_id: userId, checkin_date: today },
        transaction,
      });
      if (existing) {
        throw new Error("今日已签到，请勿重复");
      }

      // 2. 计算连续签到天数
      const lastRecord = await CheckinRecord.findOne({
        where: { user_id: userId },
        order: [["checkin_date", "DESC"]],
        transaction,
      });

      let newStreak = 1;
      if (lastRecord) {
        const yesterday = this.getYesterday();
        if (lastRecord.checkin_date === yesterday) {
          newStreak = lastRecord.streak + 1;
        }
      }

      // 3. 计算签到天数 (1-7 循环)
      const dayNumber = ((newStreak - 1) % 7) + 1;

      // 4. 查询奖励配置
      const rewardConfig = await CheckinReward.findOne({
        where: { day_number: dayNumber },
        transaction,
      });

      let userCoupon = null;
      let couponInfo = null;

      // 5. 如果有奖励配置，发放优惠券
      if (rewardConfig && rewardConfig.template_id) {
        const template = await CouponTemplate.findByPk(
          rewardConfig.template_id,
          { transaction, lock: true }
        );

        if (template && template.status === 1) {
          const now = new Date();
          const startTime = new Date(template.start_time);
          const endTime = new Date(template.end_time);

          // 校验时间范围
          if (now >= startTime && now <= endTime) {
            // 校验库存
            if (
              template.total_count === -1 ||
              template.claimed_count < template.total_count
            ) {
              // 创建用户优惠券（签到奖励跳过 per_user_limit 检查）
              userCoupon = await UserCoupon.create(
                {
                  user_id: userId,
                  template_id: template.id,
                  status: 0,
                  claimed_at: now,
                },
                { transaction }
              );

              // 更新已领取数量
              template.claimed_count += 1;
              await template.save({ transaction });

              couponInfo = {
                id: userCoupon.id,
                template_id: template.id,
                template_name: template.name,
                template_type: template.type,
                template_value: template.value,
              };
            }
          }
        }
      }

      // 6. 创建签到记录
      const record = await CheckinRecord.create(
        {
          user_id: userId,
          checkin_date: today,
          day_number: dayNumber,
          streak: newStreak,
          coupon_id: userCoupon ? userCoupon.id : null,
        },
        { transaction }
      );

      await transaction.commit();

      return {
        record: {
          id: record.id,
          user_id: record.user_id,
          checkin_date: record.checkin_date,
          day_number: record.day_number,
          streak: record.streak,
          coupon_id: record.coupon_id,
        },
        coupon: couponInfo,
      };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * 管理端查询签到记录（分页）
   * @param {Object} filters - { user_id, start_date, end_date }
   * @param {number} pageNum
   * @param {number} pageSize
   * @returns {Promise<Object>}
   */
  async getRecords(filters = {}, pageNum = 1, pageSize = 20) {
    const where = {};

    if (filters.user_id) {
      where.user_id = filters.user_id;
    }

    if (filters.start_date && filters.end_date) {
      where.checkin_date = {
        [Op.between]: [filters.start_date, filters.end_date],
      };
    } else if (filters.start_date) {
      where.checkin_date = { [Op.gte]: filters.start_date };
    } else if (filters.end_date) {
      where.checkin_date = { [Op.lte]: filters.end_date };
    }

    const offset = (pageNum - 1) * pageSize;
    const { count, rows } = await CheckinRecord.findAndCountAll({
      where,
      offset,
      limit: +pageSize,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "nick_name", "user_name", "avatar"],
        },
        {
          model: UserCoupon,
          as: "coupon",
          include: [
            {
              model: CouponTemplate,
              as: "template",
              attributes: ["id", "name", "type", "value"],
            },
          ],
        },
      ],
      distinct: true,
    });

    return {
      pageNum: +pageNum,
      pageSize: +pageSize,
      total: count,
      list: rows,
    };
  }
}

module.exports = new CheckinService();
