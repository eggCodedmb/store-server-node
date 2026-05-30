const axios = require("axios");

class UtilsClass {
  // ... (previous methods)

  /**
   * 获取北京时间的日期字符串 (YYYY-MM-DD)
   * 优先从网络 API 获取，失败则回退到本地系统时间
   */
  async getBeijingDateStr() {
    try {
      // 使用苏宁提供的公共时间接口 (中国境内访问较快)
      const response = await axios.get("https://quan.suning.com/getSysTime.do", { timeout: 2000 });
      if (response.data && response.data.sysTime2) {
        // 格式为 "2024-05-30 18:06:45"，取前 10 位
        return response.data.sysTime2.substring(0, 10);
      }
    } catch (error) {
      console.error("网络获取时间失败，回退到系统时间:", error.message);
    }

    // 回退方案：使用本地系统时间转换为北京时间
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Shanghai',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());
  }

  // 深度克隆函数
  deepClone(obj) {
    if (obj == null || typeof obj !== "object") {
      return obj;
    }
    if (Array.isArray(obj)) {
      const arrCopy = [];
      for (const item of obj) {
        arrCopy.push(this.deepClone(item));
      }
      return arrCopy;
    }

    const objCopy = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        objCopy[key] = this.deepClone(obj[key]);
      }
    }

    return objCopy;
  }

  // 生成订单号函数
  getOrderNumber(number = 16) {
    let orderNumber = "";
    for (let i = 0; i < number; i++) {
      orderNumber += Math.floor(Math.random() * 10);
    }
    return orderNumber;
  }

  /**
   * 计算总价函数
   * @param {number} price - 必填
   * @param {number} num - 选填，默认值为 1
   * @returns {number} total - 总价
   *
   *使用示例
   *    const price = 100;
   *    const total = utils.countTotal(price, 2);
   *    console.log(total); //输出 200
   */
  countTotal(price, num = 1) {
    if (typeof price !== "number" || typeof num !== "number") {
      throw new TypeError("Both price and num should be numbers");
    }
    return price * num;
  }

  /**
   * 将商品信息映射到订单项格式
   * @param {Array} items - 商品信息数组
   * @returns {Array} - 订单项数组
   */
  mapItemsToOrderItems(items) {
    return items.map((item) => ({
      goods_id: item.id,
      quantity: item.quantity,
      price: item.goods_price,
    }));
  }
}
module.exports = new UtilsClass();
