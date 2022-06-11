const express = require('express');
const router = express.Router();
const sizeOf = require('image-size');
const { ImgurClient } = require('imgur');

const { isAuth } = require('../handStates/auth');
const upload = require('../service/image');

const appError = require('../customErr/appError');
const handleErrorAsync = require('../handStates/handleErrorAsync');
const { handleSuccess } = require('../handStates/handles');

router.post(
  '/',
  isAuth,
  upload,
  handleErrorAsync(async (req, res, next) => {
    if (!req.files.length) return appError(400, '尚未上傳檔案', next);
    const dimensions = sizeOf(req.files[0].buffer);
    if (dimensions.width !== dimensions.height)
      return appError(400, '圖片長寬不符合 1:1 尺寸。', next);
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENT_ID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });
    const response = await client.upload({
      image: req.files[0].buffer.toString('base64'),
      type: 'base64',
      album: process.env.IMGUR_ALBUM_ID,
    });
    handleSuccess(res, response.data.link);
  })
);

module.exports = router;
