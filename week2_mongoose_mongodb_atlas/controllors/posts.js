const handleSuccess = require('../handStates/handleSuccess');
const handleError = require('../handStates/handleError');
const Posts = require('../model/posts');

module.exports = {
  async getPosts({ req, res }) {
    const allPosts = await Posts.find();
    handleSuccess(res, allPosts);
  },
  async createdPost({ req, res, body }) {
    try {
      const data = JSON.parse(body);
      if (data.content) {
        const newPost = await Posts.create({
          name: data.name,
          content: data.content,
          tags: data.tags,
          type: data.type,
        });
        handleSuccess(res, newPost);
      } else {
        handleError(res);
      }
    } catch (err) {
      handleError(res, err);
    }
  },
  async delALL({ req, res }) {
    const delPosts = await Posts.deleteMany();
    handleSuccess(res, delPosts);
  },
  async delOne({ req, res }) {
    try {
      const urlID = req.url.split('/').pop();
      const findByIdAndDeletePosts = await Posts.findByIdAndDelete({
        _id: urlID,
      });
      findByIdAndDeletePosts ? handleSuccess(res, urlID) : handleError(res);
    } catch (err) {
      console.log(
        'POST err.name => ',
        err.name,
        'POST err.message => ',
        err.message
      );
      handleError(res, err);
    }
  },
  async upDatePost({ req, res, body }) {
    try {
      const data = JSON.parse(body);
      const urlID = req.url.split('/').pop();
      if (data.content) {
        const editPost = await Posts.findByIdAndUpdate(
          urlID,
          {
            name: data.name,
            content: data.content,
            tags: data.tags,
            type: data.type,
          },
          { returnDocument: 'after' }
        );
        editPost !== null ? handleSuccess(res, editPost) : handleError(res);
      } else {
        handleError(res);
      }
    } catch (err) {
      console.log(
        'POST err.name => ',
        err.name,
        'POST err.message => ',
        err.message
      );
      handleError(res, err);
    }
  },
};