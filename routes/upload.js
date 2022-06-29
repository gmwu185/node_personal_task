const express = require('express');

const UploadControllers = require('../controllers/upload');

const router = express.Router();

const { isAuth } = require('../middlewares/auth');
const upload = require('../service/image');

router.post(
  '/upload/avatar',
  isAuth,
  upload,
  /** #swagger.summary = '上傳大頭照'
    * #swagger.tags = ['上傳檔案']
    * #swagger.description = '上傳大頭照',
    * #swagger.security = [{
      'apiKeyAuth': []
    }],
    * #swagger.parameters['singleFile'] = {
      in: 'formData',
      type: 'file',
      required: 'true',
      description: `
        <ul>
          <li>圖片不得大於 1024 * 1024</li>
          <li>僅限上傳 jpg、jpeg 與 png 格式。</li>
          <li>圖片長寬不符合 1:1 尺寸</li>
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
  (req, res, next) => UploadControllers.upLoadAvatarImg(req, res, next)
);

module.exports = router;
