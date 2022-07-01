const { ImgurClient } = require('imgur');
const appError = require('../customErr/appError');

const uploadImg = async (buffer, next) => {
  const client = new ImgurClient({
    clientId: process.env.IMGUR_CLIENT_ID,
    clientSecret: process.env.IMGUR_CLIENT_SECRET,
    refreshToken: process.env.IMGUR_REFRESH_TOKEN,
  });
  const response = await client.upload({
    image: buffer.toString('base64'),
    type: 'base64',
    album: process.env.IMGUR_ALBUM_ID,
  });

  if (response.success === false)
    return appError(
      response.status,
      'imgUrl 服務有問題或圖檔上傳過程未成功',
      next
    );
  
  return response.data.link;
};

module.exports = uploadImg;
