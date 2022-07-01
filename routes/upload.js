const express = require('express');
const router = express.Router();

const UploadControllers = require('../controllers/upload');
const { isAuth } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

router.post(
  '/upload/image',
  // upload.any(),
  // upload.single(),
  upload.single('image'),
  isAuth,
  /** #swagger.summary = '上傳大頭照'
    * #swagger.tags = ['上傳檔案']
    * #swagger.description = '上傳大頭照',
    * #swagger.security = [{
      'apiKeyAuth': []
    }],
    #swagger.parameters['type'] = {
      in: 'query',
      description: `
        <ul>
          <li>上傳類型，<code>avatar</code> 為會員頭像選填，圖片長寬不符合 1:1 尺寸</li>
          <li>預設不填不限比例</li>
        </ul>  
      `,
      type: 'string',
    }
    * #swagger.consumes = ['multipart/form-data']
    * #swagger.parameters['image'] = {
      in: 'formData',
      type: 'file',
      required: 'true',
      description: `
        <ul>
          <li>圖片不得大於 1024 * 1024</li>
          <li>僅限上傳 jpg、jpeg 與 png 格式。</li>
        </ul>
      `,
    }
    * #swagger.responses[200] = {
      description: '圖片上傳成功回應',
      schema: {
        "status": true,
        "data": "https://i.imgur.com/xxxxx.jpg",
      }
    }
   */
  (req, res, next) => UploadControllers.upLoadImgFile(req, res, next)
);

/** multer 的 .any() 方法
 * req.files 以陣列進行傳遞，可用於多選檔案
 * fileFilter() 的參數 file 會是 undefined
 */
/** multer 的 .single() 方法，指定與不指定字串參數
 * postman 於 Body form-data KEY 指定值，以下例帶入 'avatar' 就需在 KEY 帶入，相對沒有都要沒有
 * 相對於網頁上 input 元素屬性 (name)
 * 單選一張圖片並對 KEY 與 main 進行驗証
 * fileFilter() 函式屬性，所傳入參數 file 會取得檔案資訊
 */
/** 參考資料：
 * https://www.npmjs.com/package/multer#usage
 * https://medium.com/麥克的半路出家筆記/筆記-使用-multer-實作大頭貼上傳-ee5bf1683113
 */

module.exports = router;
