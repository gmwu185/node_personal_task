const handleSuccess = require('../handStates/handleSuccess');
const handleError = require('../handStates/handleError');
const Posts = require('../model/posts');
// const Users = require('../model/users');

module.exports = {
  async getPosts(req, res) {
    /** #swagger.tags = ['posts (貼文)']
      *? #swagger.responses[200] = {
        description: '取得<strong>全部貼文</strong>',
        schema: {
          "status": true,
          "data": [
            {
              "_id": "123456789",
              "name": "string",
              "tags": [ "string-1", "string-2" ],
              "type": "string",
              "image": "",
              "content": "string",
              "likes": 0,
              "comments": 0,
              "__v": 0
            },
          ]
        }
      }
    */
    await Posts.find()
      .populate('userData') // 指向 user DB ID 做關連
      .then((result) => handleSuccess(res, result))
      .catch((err) => handleError(res, err));
  },
  async createdPost(req, res) {
    /** #swagger.tags = ['posts (貼文)']
     ** #swagger.description = '新增單筆貼文'
     */
    const { userData, content, tags, type, image } = req.body;
    try {
      if (content) {
        /**
          ** #swagger.parameters['body'] = {
            in: "body",
            type: "object",
            required: true,
            description: "資料格式查看必填欄位，點按下方 Model 切換後，屬性欄位名稱的後方紅色的*",
            schema: { $ref: "#/definitions/createdPosts" }
          }
        */

        if (image) {
          if (!image.startsWith('https://') && !image.startsWith('http://')) {
            return handleError(res, {
              message: '請使用 https 或 http 開頭的圖片網址',
            });
          }
          const newPost = await Posts.create({
            userData: '62826721c9caa8e6fac74ef1', // 取 user id 關連
            content,
            tags,
            type,
            image,
          });
          handleSuccess(res, newPost);
        }
      } else {
        /** mongoose 會先依 model 設定格式檔下錯誤，實際上用不到。
          ** #swagger.responses[400] = {
            description: '未帶上 name 的錯誤回應',
            schema: { 
              "status": "false",
              "message": "Post validation failed: name: 貼文姓名未填寫"
            }
          }
        */
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
  async delALLPosts(req, res) {
    /** #swagger.tags = ['posts (貼文)']
     *! #swagger.description = '刪除所有貼文'
     */
    // 網址 / 沒接參數判斷錯誤，才能正確執行刪除單筆
    if (req.originalUrl === '/posts/')
      return handleError(res, { message: `無此網站路由` }); 
    const delPosts = await Posts.deleteMany();
    handleSuccess(res, delPosts);
  },
  async delOnePost(req, res) {
    /** #swagger.tags = ['posts (貼文)']
     *! #swagger.description = '刪除單筆貼文'
     * #swagger.security = [{
        'apiKeyAuth': []
      }]
    */
    const { id } = req.params;
    try {
      /**
        *! #swagger.parameters['id'] = {
          in: 'path',
          type: 'string',
          required: true,
        }
      */
      if (id) {
        await Posts.findByIdAndDelete({
          _id: id,
        })
          .then((result) => {
            if (result === null)
              return handleError(res, {
                message: `無 ${id} 此 id，請重新確認`,
              });
            if (typeof result === 'object') return handleSuccess(res, result);
          })
          .catch((err) =>
            handleError(res, { message: `無 ${id} 此 id，請重新確認` })
          );
      } else {
        handleError(res, { message: `${id} 未正常帶入或格式不正確` });
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
  async upDatePost(req, res) {
    /** #swagger.tags = ['posts (貼文)']
     ** #swagger.description = '更新單筆貼文'
     *! #swagger.parameters['id'] = {
          in: 'path',
          type: 'string',
          required: true,
        }
     */
    const { userData, content, tags, type, image } = req.body;
    try {
      if (content) {
        /**
          ** #swagger.parameters['body'] = {
            in: "body",
            type: "object",
            required: true,
            description: "Body 資料格式",
            schema: { 
              "name": "test-edit",
              "content": "test-edit",
              "tags": ["string-1", "string-2"],
              "type": "string"
            }
          }
        */
        const editPost = await Posts.findByIdAndUpdate(
          req.params.id,
          {
            userData,
            content,
            tags,
            type,
            image,
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
