const handleSuccess = require('../handStates/handleSuccess');
const handleError = require('../handStates/handleError');
const Posts = require('../model/posts');

module.exports = {
  async getPosts(req, res) {
    /** #swagger.tags = ['posts (貼文)']
      *? #swagger.responses[200] = {
        description: '取得<strong>全部貼文</strong>',
        schema:
        {
          "status": true,
          "data": [
            {
              "_id": "62749decc3031217a0acd924",
              "name": "test-edit333",
              "tags": [
                "感情"
              ],
              "type": "person",
              "image": "",
              "content": "test-edit333",
              "likes": 0,
              "comments": 0,
              "__v": 0
            },
          ]
        }
      }
    */
    const allPosts = await Posts.find();
    handleSuccess(res, allPosts);
  },
  async createdPost(req, res) {
    /** #swagger.tags = ['posts (貼文)']
     ** #swagger.description = '新增單筆貼文'
     */
    try {
      if (req.body.content) {
        /**
          ** #swagger.parameters['body'] = {
            in: "body",
            type: "object",
            required: true,
            description: "資料格式查看必填欄位，點按下方 Model 切換後，屬性欄位名稱的後方紅色的*",
            schema: { $ref: "#/definitions/createdPosts" }
          }
        */
        const newPost = await Posts.create({
          name: req.body.name,
          content: req.body.content,
          tags: req.body.tags,
          type: req.body.type,
        });
        /**
          ** #swagger.responses[200] = {
            description: 'Some description...',
            schema: { $ref: "#/definitions/createdPosts" }
          }
        */
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
    /** #swagger.tags = ['posts (貼文)']
     *! #swagger.description = '刪除全部貼文'
     */
    const delPosts = await Posts.deleteMany();
    handleSuccess(res, delPosts);
  },
  async delOne(req, res) {
    /** #swagger.tags = ['posts (貼文)']
     *! #swagger.description = '刪除單筆貼文'
     * #swagger.security = [{
        'apiKeyAuth': []
      }]
    */
    try {
      const findByIdAndDeletePosts = await Posts.findByIdAndDelete({
        _id: req.params.id,
      });
      findByIdAndDeletePosts
        ? handleSuccess(res, req.params.id)
        : handleError(res);
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
    /** #swagger.tags = ['posts (貼文)']
     ** #swagger.description = '更新單筆貼文'
     */
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
