const Parameter = require("parameter");
const parameter = new Parameter();

/**
 * 通用校验数据类型中间件
 * @param {object} customRules -- 传入校验对象类型 必选
 * @param {object} customErrType -- 传入错误对象类型 必选
 */
const validateParams = (customRules, customErrType) => {
  return async (ctx, next) => {
    try {
      if (!customRules || typeof customRules !== "object") {
        throw new Error("无效的 customRules：它必须是一个对象。");
      }
      if (!customErrType || typeof customErrType !== "object") {
        throw new Error("无效的 customErrType：它必须是一个对象。");
      }

      if (ctx.params.id) {
        ctx.params.id = parseInt(ctx.params.id);
      }
      if (ctx.query.id) {
        ctx.query.id = parseInt(ctx.query.id);
      }

      const data = {
        ...ctx.query,
        ...ctx.request.body,
        ...ctx.params,
      };

      const error = parameter.validate(customRules, data);

      if (error) {
        // 格式化错误信息，避免 [object Object]
        const errorDetails = error.map(err => `${err.field}: ${err.message}`).join(', ');
        const customError = new Error(errorDetails);
        customError.details = error;
        throw customError;
      }

      await next();
    } catch (error) {
      ctx.app.emit(
        "error",
        { ...customErrType, message: error.message || "参数验证失败" },
        ctx
      );
    }
  };
};

module.exports = {
  validateParams,
};
