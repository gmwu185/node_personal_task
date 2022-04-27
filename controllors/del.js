const handleSuccess = require('../handStates/handleSuccess');
const handleError = require('../handStates/handleError');
const Posts = require('../model/posts');

module.exports = {
  async delALL({ req, res }) {
    const delPosts = await Posts.deleteMany();
    handleSuccess(res, delPosts);
    res.end();
  },
  async delOne({ req, res }) {
    try {
      const urlID = req.url.split('/').pop();
      const findByIdAndDeletePosts = await Posts.findByIdAndDelete({
        _id: urlID,
      });
      console.log('findByIdAndDeletePosts', findByIdAndDeletePosts);
      findByIdAndDeletePosts
        ? (handleSuccess(res, urlID), res.end())
        : (handleError(res), res.end());
    } catch (err) {
      console.log(
        'POST err.name => ',
        err.name,
        'POST err.message => ',
        err.message
      );
      handleError(res, err);
      res.end();
    }
  },
};
