const { unsupportedFileType, fileUploadError } = require("../constant/errType");
const { FILE_TYPE } = require("../config/config.default");
const { deleteOnlineImgs } = require("../utils/upload");

const fileTypeValidator = async (ctx, next) => {
  const { file } = ctx.request.files || {}; // 获取上传的文件
  if (!file) {
    return ctx.app.emit("error", fileUploadError, ctx);
  }

  try {
    const types = [];

    if (Array.isArray(file)) {
      types.push(...file.map((item) => item.mimetype));
    } else {
      types.push(file.mimetype);
    }

    // 处理 FILE_TYPE，可能是字符串或数组
    let allowedTypes = [];
    if (Array.isArray(FILE_TYPE)) {
      allowedTypes = FILE_TYPE;
    } else if (typeof FILE_TYPE === "string") {
      // 兼容 .env 中的 ['a', 'b'] 格式 or a,b 格式
      allowedTypes = FILE_TYPE.replace(/[\[\]' ]/g, "").split(",");
    }

    const isAllValid = types.every((type) => allowedTypes.includes(type));

    if (isAllValid) {
      await next();
    } else {
      await deleteOnlineImgs(file);
      ctx.app.emit("error", unsupportedFileType, ctx);
    }
  } catch (error) {
    if (file) {
      await deleteOnlineImgs(file);
    }
    console.log(error);
    throw error;
  }
};

module.exports = { fileTypeValidator };
