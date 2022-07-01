const sizeOf = require('image-size');

const appError = require('../customErr/appError');
const handleErrorAsync = require('../handStates/handleErrorAsync');
const { handleSuccess } = require('../handStates/handles');
const uploadImg = require('../service/image');
const User = require('../model/users');

module.exports = {
  upLoadImgFile: handleErrorAsync(async (req, res, next) => {
    const {
      file,
      query: { type },
      userID,
    } = req;

    /** 多檔 multer 的 .any() 方法 */
    // if (req.files) { ... }

    /** 單檔 multer 的 .single() 方法 */
    if (!file) return appError(400, '請選擇檔案', next);
    if (file.fieldname !== 'image')
      return appError(400, '欄位 name / KEY 請帶上 image', next);
    if (type === 'avatar') {
      const dimensions = sizeOf(file.buffer);
      if (dimensions.width !== dimensions.height) {
        return appError(400, '圖片寬高比必需為 1:1，請重新輸入', next);
      }
    }

    /** 寫入 imgUrl 圖床 storge */
    const imgUrlLink = await uploadImg(file.buffer);
    if (!imgUrlLink) return appError(400, 'imgUrl 建立資料不成功', next);

    handleSuccess(res, imgUrlLink);
  }),
};
