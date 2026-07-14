const {
  fileUploadError,
  localServrError,
  onlineServrError,
  minioServrError,
} = require("../constant/errType");
const { minioUpload } = require("../utils/upload/minioUpload");
const {
  deleteOnlineImgs,
  queryFileName,
  renameFile,
} = require("../utils/upload");
const {
  UPLOAD_TYPE,
} = require("../config/config.default");
const UUID = require("../utils/uuid");
const sendResponse = require("../utils/response");
const path = require("path");

class uploadController {
  /**
   * 图片上传
   */
  async upload(ctx) {
    const { file } = ctx.request.files || {};
    if (!file) {
      return ctx.app.emit("error", fileUploadError, ctx);
    }

    try {
      const fileNames = [];

      // 文件重命名
      if (Array.isArray(file)) {
        for (let item of file) {
          const newFileName = `${UUID()}${path.extname(item.originalFilename)}`;
          item.filepath = await renameFile(item.filepath, newFileName);
        }
      } else {
        const newFileName = `${UUID()}${path.extname(file.originalFilename)}`;
        file.filepath = await renameFile(file.filepath, newFileName);
      }

      const mames = queryFileName(file);

      // 返回相对路径，包含上传类型子目录，不拼接完整 URL
      fileNames.push(...mames.map((name) => `/${UPLOAD_TYPE}/${name}`));

      switch (UPLOAD_TYPE) {
        case "local":
        case "online":
          sendResponse(ctx, 0, "上传成功", fileNames);
          break;
        case "minio":
          const minioList = []; // 初始化minioList
          if (Array.isArray(file)) {
            for (let item of file) {
              const minioRes = await minioUpload(item.filepath);
              if (!minioRes) {
                throw new Error("MinIO upload failed");
              }
              // 返回相对路径，包含 bucket 前缀
              minioList.push(minioRes);
            }
          } else {
            const minioRes = await minioUpload(file.filepath);
            if (!minioRes) {
              throw new Error("MinIO upload failed");
            }
            // 返回相对路径，包含 bucket 前缀
            minioList.push(minioRes);
          }
          sendResponse(ctx, 0, "上传成功", minioList);
          break;
        default:
          fileUploadError.message = "上传类型不支持";
          ctx.app.emit("error", fileUploadError, ctx);
          break;
      }
    } catch (error) {
      switch (UPLOAD_TYPE) {
        case "local":
          ctx.app.emit("error", localServrError, ctx);
          break;
        case "online":
          ctx.app.emit("error", onlineServrError, ctx);
          break;
        case "minio":
          ctx.app.emit("error", minioServrError, ctx);
          break;
        default:
          fileUploadError.message = "上传类型不支持";
          ctx.app.emit("error", fileUploadError, ctx);
          break;
      }

      await deleteOnlineImgs(file);
      console.log(error);
      throw error;
    }
  }
}

module.exports = new uploadController();
