const multer = require('multer');

const upload = multer({
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    /** 多檔 multer 的 .any() 方法 */
    // if (Array.isArray(req.files)) {
    //   console.log('fileFilter req.files, Array.isArray()', req.files);
    // }

    /** 單檔 multer 的 .single() 方法 */
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      cb(new Error('檔案格式錯誤，僅限上傳 jpg、jpeg 與 png 格式。'));
    }
    cb(null, true);
  },
});

module.exports = upload;
