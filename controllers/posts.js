const { handleSuccess } = require('../handStates/handles');
const handleErrorAsync = require('../handStates/handleErrorAsync');
const appError = require('../customErr/appError');

const mongoose = require('mongoose');
const Posts = require('../model/posts');
const Comment = require('../model/comments');

module.exports = {
  getPosts: handleErrorAsync(async (req, res, next) => {
    const { q, timeSort, pageNum, pageSize, queryUser } = req.query;
    const filterTimeSort = timeSort === 'asc' ? 'createAt' : '-createAt';
    const filterQueryObj = {};
    if (q) {
      const regExpQ = new RegExp(q);
      filterQueryObj.content = regExpQ;
    }
    if (queryUser) {
      filterQueryObj.userData = queryUser;
    }
    function isPositiveInteger(str) {
      if (typeof str === 'number') {
        if (Number.isInteger(str) && str > 0) return true;
        return false;
      }

      if (typeof str !== 'string') return false;
      const num = Number(str);

      if (Number.isInteger(num) && num > 0) return true;
      return false;
    }
    const currentPageLimit = isPositiveInteger(pageSize) ? pageSize : 0;
    const currentPageSkip =
      isPositiveInteger(pageNum) && currentPageLimit > 0
        ? Number(pageSize) * Number(pageNum)
        : 0;
    const posts = await Posts.find(filterQueryObj)
      .populate({
        path: 'userData',
        select: 'email avatarUrl userName createAt',
      })
      .populate({
        path: 'comments',
        select: 'comment commentUser createAt',
      })
      .populate({
        path: 'likes',
        select: 'avatarUrl userName',
      })
      .limit(currentPageLimit) // 筆數長度
      .skip(currentPageSkip) // 筆數位置開始計算
      .sort(filterTimeSort)
      .catch((err) => handleErrorAsync(res, err));
    handleSuccess(res, posts);
  }),
  getPost: handleErrorAsync(async (req, res, next) => {
    if (!req.params.id || req.params.id === '')
      return next(appError(400, '未帶入 post id 或其他錯誤', next));
    // console.log('req.params.id', req.params.id);
    const findOnePost = await Posts.findOne({
      _id: req.params.id,
    })
      .populate({
        path: 'comments',
        select: 'comment commentUser createAt',
      })
      .populate({
        path: 'userData',
        select: 'email avatarUrl userName createAt',
      })
      .populate({
        path: 'likes',
        select: 'avatarUrl userName',
      })
      .catch((err) => appError(400, '無此 id 或 id 長度不足', next));
    if (findOnePost == null) return appError(400, '查無此 post id 貼文', next);
    handleSuccess(res, findOnePost);
  }),
  createdPost: handleErrorAsync(async (req, res, next) => {
    const userID = req.userID;
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
    });
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

    // 查找發文的 user id，比對登入會員 user id 是否為同一人
    const findPost = await Posts.findOne({ _id: id }).populate({
      path: 'userData',
      select: '_id',
    });
    if (findPost.userData.id !== req.userID)
      return appError(400, '更新貼文只能是會員本人的貼文', next);

    const editPost = await Posts.findByIdAndUpdate(
      { _id: id },
      {
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
  toggleLike: handleErrorAsync(async (req, res, next) => {
    const postID = req.params.id;
    const userID = req.userID;
    const findPost = await Posts.findById({
      _id: postID,
    }).catch((err) => appError(400, `無此貼文 ${postID} ID`, next));
    // 判斷貼文按讚欄位與值判斷
    if (findPost.like) return appError(400, `此貼文沒有 likes 欄位`, next);
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
        // .populate('likes')
        .populate({
          path: 'likes',
          select: 'avatarUrl userName',
        })
        .exec((err, likes) => {
          if (err)
            return appError(400, `新增失敗，請查明貼文 ${postID} ID`, next);
          handleSuccess(res, likes);
        });
    }
  }),
  createComment: handleErrorAsync(async (req, res, next) => {
    const userID = req.userID;
    const postID = req.params.id;
    const { comment } = req.body;
    if (!comment) return appError(404, 'comment 欄位未帶上', next);
    const newComment = await Comment.create({
      post: postID,
      commentUser: userID,
      comment,
    }).catch((err) =>
      next(appError(404, '貼文或留言 user 資料格式有誤', next))
    );
    handleSuccess(res, { comments: newComment });
  }),
  getMyPostList: handleErrorAsync(async (req, res, next) => {
    const { id } = req.params;
    const { q, timeSort } = req.query;
    const filterTimeSort = timeSort === 'asc' ? 'createAt' : '-createAt';

    if (!mongoose.isObjectIdOrHexString(id))
      return appError(400, '無效 id', next);
    if (!id || id === '')
      return appError(400, '未帶入 user id 或其他錯誤', next);
    
    const filterQueryObj = {};
    if (id) {
      filterQueryObj.userData = id;
    }
    if (q) {
      const regExpQ = new RegExp(q);
      filterQueryObj.content = regExpQ;
    }
    
    const userAllPosts = await Posts.find(filterQueryObj)
      .populate({
        path: 'comments',
        select: 'comment commentUser createAt',
      })
      .populate({
        path: 'userData',
        select: 'email avatarUrl userName createAt',
      })
      .populate({
        path: 'likes',
        select: 'avatarUrl userName',
      })
      .sort(filterTimeSort)
      .catch((err) => appError(404, 'user id 或其他錯誤', next));
    handleSuccess(res, userAllPosts);
  }),
};
