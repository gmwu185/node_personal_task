const handleSuccess = require('../handStates/handleSuccess');
const handleError = require('../handStates/handleError');
const Posts = require('../model/posts');

module.exports = {
  async getPosts(req, res) {
    const allPosts = await Posts.find();
    handleSuccess(res, allPosts);
  },
  async createdPost(req, res) {
    try {
      if (req.body.content) {
        const newPost = await Posts.create({
          name: req.body.name,
          content: req.body.content,
          tags: req.body.tags,
          type: req.body.type,
        });
        handleSuccess(res, newPost);
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
  async delALL(req, res) {
    const delPosts = await Posts.deleteMany();
    handleSuccess(res, delPosts);
  },
  async delOne(req, res) {
    try {
      const findByIdAndDeletePosts = await Posts.findByIdAndDelete({
        _id: req.params.id,
      });
      findByIdAndDeletePosts ? handleSuccess(res, req.params.id) : handleError(res);
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
  async upDatePost(req, res) {
    try {
      if (req.body.content) {
        const editPost = await Posts.findByIdAndUpdate(
          req.params.id,
          {
            name: req.body.name,
            content: req.body.content,
            tags: req.body.tags,
            type: req.body.type,
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
