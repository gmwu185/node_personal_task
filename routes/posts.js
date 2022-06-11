var express = require('express');
var router = express.Router();

const { isAuth } = require('../handStates/auth');

const Posts = require('../model/posts');
const PostsControllers = require('../controllers/posts');

router.get('/', isAuth, (req, res, next) =>
  /** #swagger.summary = '取得所有貼文'
    * #swagger.description = '取得所有貼文'
    * #swagger.tags = ['posts (動態貼文)']
    * #swagger.security = [{
      'apiKeyAuth': []
    }],
    * #swagger.responses[200] = {
      description: '取得<strong>全部貼文</strong>',
      schema: {
        "_id": "62924730a3cca4c1b4a52226",
        "userData": {
          "_id": "62908a8ebf85a52ce75989a5",
          "userName": "jimmyWu",
          "email": "gg@mail.com",
          "password": "123456",
          "avatarUrl": "https://avatars.githubusercontent.com/u/42748910?v=4"
        },
        "content": "test",
        "tags": [
          "感情2"
        ],
        "type": "person",
        "image": "http://",
        "likes": 0,
        "comments": 0
      },
    }
  */
  PostsControllers.getPosts(req, res, next)
);
router.post('/', isAuth, (req, res, next) =>
  /** #swagger.summary = '張貼個人動態'
    * #swagger.description = '新增單筆貼文'
    * #swagger.tags = ['posts (動態貼文)']
    * #swagger.security = [{
      'apiKeyAuth': []
    }],
    * #swagger.parameters['body'] = {
      in: "body",
      type: "object",
      required: true,
      description: `資料格式查看必填欄位，點按下方 Model 切換後，屬性欄位名稱的後方紅色的 <span>*</span>`,
      schema: { 
        "$content": "test",
        "type": "person",
        "tags": ["感情2"],
        "image": "http://"
      }
    },
    * #swagger.responses[200] = {
      description: '建立貼正正確回應',
      schema: {
        "status": true,
        "data": {
          "userData": "629a3dae000fcec3e68c92c7",
          "content": "test",
          "tags": [
            "string"
          ],
          "type": "person",
          "image": "http://",
          "likes": 0,
          "comments": 0,
          "_id": "629a3fa4f6a449c76689d3ff",
          "createAt": "2022-06-03T17:06:44.297Z"
        }
      }
    }
   */
  PostsControllers.createdPost(req, res, next)
);
router.delete('/', isAuth, (req, res, next) =>
  /** #swagger.summary = '刪除所有貼文'
    * #swagger.description = '刪除所有貼文'
    * #swagger.tags = ['posts (動態貼文)']
    * #swagger.security = [{
      'apiKeyAuth': []
    }],
   */
  PostsControllers.delALLPosts(req, res, next)
);
router.delete('/:id', isAuth, (req, res, next) =>
  /** #swagger.summary = '刪除單筆貼文'
    * #swagger.description = '刪除單筆貼文'
    * #swagger.tags = ['posts (動態貼文)']
    * #swagger.security = [{
      'apiKeyAuth': []
    }],
    * #swagger.parameters['id'] = {
      in: 'path',
      type: 'string',
      required: true,
    }
  */
  PostsControllers.delOnePost(req, res, next)
);
router.patch('/:id', isAuth, (req, res, next) =>
  /** #swagger.summary = '更新單筆貼文'
    * #swagger.tags = ['posts (動態貼文)']
    * #swagger.description = '更新單筆貼文',
    * #swagger.security = [{
      'apiKeyAuth': []
    }],
    * #swagger.parameters['id'] = {
        in: 'path',
        type: 'string',
        required: true,
      },
    * #swagger.parameters['body'] = {
      in: "body",
      type: "object",
      required: true,
      description: "Body 資料格式",
      schema: { 
        "$content": "test-edit",
        "tags": ["string-1", "string-2"],
        "type": "string",
        "image": "http://",
        "likes": 0,
        "comments": 0
      }
    },
    * #swagger.responses[200] = {
      description: '建立貼正正確回應',
      schema: {
        "status": true,
        "data": {
          "status": true,
          "data": {
            "_id": "62924fade5520c8a5493626f",
            "userData": "62924fade5520c8a5493626f",
            "content": "test-edit",
            "tags": [
              "string"
            ],
            "type": "string",
            "image": "http://",
            "likes": 0,
            "comments": 0
          }
        }
      }
    }
   */

  PostsControllers.upDatePost(req, res, next)
);

module.exports = router;
