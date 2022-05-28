const handleSuccess = require('../handStates/handleSuccess');
const handleError = require('../handStates/handleError');
const appError = require('../customErr/appError');

const Posts = require('../model/posts');

module.exports = {
  getPosts: handleError(async (req, res, next) => {
    await Posts.find()
      .populate('userData') // 指向 user DB ID 做關連
      .then((result) => handleSuccess(res, result))
      .catch((err) => handleError(res, err));
  }),
  createdPost: handleError(async (req, res, next) => {
    const { userData, content, tags, type, image } = req.body;

    if (!userData) return appError(400, 'userData 未帶入', next);
    if (!content) return appError(400, '內容必填', next);
    if (!tags) return appError(400, '標籤必填', next);
    if (!type) return appError(400, '貼文類型未填寫', next);
    if (image) {
      if (!image.startsWith('https://') && !image.startsWith('http://'))
        return appError(400, '請使用 https:// 或 http:// 開頭的圖片網址', next);
    }
    handleSuccess(
      res,
      await Posts.create({
        userData,
        content,
        tags,
        type,
        image,
      })
    );
  }),
  delALLPosts: handleError(async (req, res, next) => {
    // 網址 / 沒接參數判斷錯誤，才能正確執行刪除單筆
    if (req.originalUrl === '/posts/')
      return appError(400, `無此網站路由`, next);
    await Posts.deleteMany();
    handleSuccess(res, []);
  }),
  delOnePost: handleError(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return appError(400, `無 ${id} 此 id，請重新確認`, next);

    const delOnePost = await Posts.findByIdAndDelete({
      _id: id,
    });
    /* 接正確與錯誤流程寫法一 */
    // .then((result) => {
    //   if (result === null) return appError(res, `無 ${id} 此 id，請重新確認`, next);
    //   if (typeof result === 'object')
    //     return handleSuccess(res, `${id} 刪除成功`);
    // })
    // .catch((err) => appError(res, `無 ${id} 此 id，請重新確認`, next));
    /* /接正確與錯誤流程寫法一 */

    /* 接正確與錯誤流程寫法二 */
    // if(!delOnePost) {
    //   appError(400, `無 ${id} 此 id，請重新確認`, next)
    // } else {
    //   handleSuccess(res, `${id} 刪除成功`);
    // }
    /* /接正確與錯誤流程寫法二 */

    /* 接正確與錯誤流程寫法三 */
    !delOnePost
      ? appError(400, `無 ${id} 此 id，請重新確認`, next)
      : handleSuccess(res, `id ${id} 刪除成功`);
    /* /接正確與錯誤流程寫法三 */
  }),
  upDatePost: handleError(async (req, res, next) => {
    const { id } = req.params;
    const { userData, content, tags, type, image } = req.body;

    if (!content) return appError(400, '內容必填', next);

    const editPost = await Posts.findByIdAndUpdate(
      id,
      {
        userData: id,
        content,
        tags,
        type,
        image,
      },
      { returnDocument: 'after' }
    );
    !editPost
      ? appError(400, `更新失敗，請重新確認內容或 ${id} 是否正確`, next)
      : handleSuccess(res, editPost);
  }),
};
