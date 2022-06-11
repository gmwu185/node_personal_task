const { handleSuccess } = require('../handStates/handles');
const handleErrorAsync = require('../handStates/handleErrorAsync');
const appError = require('../customErr/appError');

const Posts = require('../model/posts');

module.exports = {
  getPosts: handleErrorAsync(async (req, res, next) => {
    const { q, timeSort } = req.query;
    const posts = await Posts.find(q ? { content: new RegExp(q) } : {})
      .sort(timeSort === 'asc' ? 'createAt' : '-createAt')
      .populate({
        path: 'userData',
        select: 'email userPhoto userName createAt',
      })
      .catch((err) => handleErrorAsync(res, err));
    handleSuccess(res, posts);
  }),
  createdPost: handleErrorAsync(async (req, res, next) => {
    const userID = req.user.id;
    const { userData, content, tags, type, image } = req.body;

    if (!content) return appError(400, '內容必填', next);
    if (image) {
      if (!image.startsWith('https://') && !image.startsWith('http://'))
        return appError(400, '請使用 https:// 或 http:// 開頭的圖片網址', next);
    }
    const newPost = await Posts.create({
      userData: userID,
      content,
      tags,
      type,
      image,
    }).catch((err) => console.log('newPost err', err));
    handleSuccess(res, newPost);
  }),
  delALLPosts: handleErrorAsync(async (req, res, next) => {
    // 網址 / 沒接參數判斷錯誤，才能正確執行刪除單筆
    if (req.originalUrl === '/posts/')
      return appError(400, `無此網站路由`, next);
    await Posts.deleteMany();
    handleSuccess(res, []);
  }),
  delOnePost: handleErrorAsync(async (req, res, next) => {
    const { id } = req.params;
    if (!id) return appError(400, `無 ${id} 此 id，請重新確認`, next);

    const delOnePost = await Posts.findByIdAndDelete({
      _id: id,
    }).catch((err) => appError(400, `無 ${id} 此 id，請重新確認`, next));
    console.log('delOnePost', delOnePost);
    !delOnePost
      ? appError(400, `刪除失敗，請重新確認 ${id} id 是否正確`, next)
      : handleSuccess(res, `id ${id} 刪除成功`);
  }),
  upDatePost: handleErrorAsync(async (req, res, next) => {
    const { id } = req.params;
    const { content, tags, type, image } = req.body;

    if (!content) return appError(400, '內容必填', next);

    const editPost = await Posts.findByIdAndUpdate(
      { _id: id },
      {
        content,
        tags,
        type,
        image,
      },
      { returnDocument: 'after' }
    ).catch((err) => appError(400, `無 ${id} 此 id，請重新確認`, next));
    !editPost
      ? appError(400, `更新失敗，請重新確認內容或 ${id} 是否正確`, next)
      : handleSuccess(res, editPost);
  }),
  toggleLike: handleErrorAsync(async (req, res, next) => {
    const postID = req.params.id;
    const userID = req.user.id;
    const findPost = await Posts.findById({
      _id: postID,
    }).catch((err) => appError(400, `無此貼文 ${postID} ID`, next));
    // 判斷貼文按讚欄位與值判斷
    if (findPost.like)
      return appError(400, `此貼文沒有 likes 欄位`, next);
    // 貼文按讚的 user id 判斷
    if (findPost.likes.includes(userID)) {
      const pullLike = await Posts.findOneAndUpdate(
        { _id: postID },
        {
          $pull: { likes: userID },
        },
        { new: true } // 回傳最新改過
      )
        .populate('likes')
        .exec((err, likes) => {
          if (err)
            return appError(400, `刪除失敗，請查明貼文 ${postID} ID`, next);
          handleSuccess(res, likes);
        });
    } else {
      const newLike = await Posts.findOneAndUpdate(
        { _id: postID },
        {
          $push: { likes: userID },
        },
        { new: true } // 回傳最新改過
      )
        .populate('likes')
        .exec((err, likes) => {
          if (err)
            return appError(400, `新增失敗，請查明貼文 ${postID} ID`, next);
          handleSuccess(res, likes);
        });
    }
  }),
};
