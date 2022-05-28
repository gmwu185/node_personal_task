var express = require('express');
var router = express.Router();

const Posts = require('../model/posts');
const PostsControllers = require('../controllers/posts');

router.get('/', (req, res, next) =>
  /** #swagger.description = '取得所有貼文'
    * #swagger.tags = ['posts (貼文)']
    * #swagger.responses[200] = {
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
  PostsControllers.getPosts(req, res, next)
);
router.post('/', (req, res, next) =>
  /** #swagger.description = '新增單筆貼文'
    * #swagger.tags = ['posts (貼文)']
    * #swagger.parameters['body'] = {
      in: "body",
      type: "object",
      required: true,
      description: `資料格式查看必填欄位，點按下方 Model 切換後，屬性欄位名稱的後方紅色的*`,
      schema: { 
        $name: 'createdPost--test 加入 swagger.js 中',
        $content: 'createdPost-test',
        tags: ['string-1', 'string-2'],
        type: 'string'
      }
    },
    * #swagger.responses[400] = {
      description: '未帶上 name 的錯誤回應',
      schema: {
        "status": "false",
        "message": "Post validation failed: name: 貼文姓名未填寫"
      }
    }
   */
  PostsControllers.createdPost(req, res, next)
);
router.delete('/', (req, res, next) =>
  /** #swagger.description = '刪除所有貼文'
   * #swagger.tags = ['posts (貼文)']
   */
  PostsControllers.delALLPosts(req, res, next)
);
router.delete('/:id', (req, res, next) =>
  /** #swagger.tags = ['posts (貼文)']
   * #swagger.description = '刪除單筆貼文'
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
router.patch('/:id', (req, res, next) =>
  /** #swagger.tags = ['posts (貼文)']
   * #swagger.description = '更新單筆貼文',
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
        "name": "test-edit",
        "content": "test-edit",
        "tags": ["string-1", "string-2"],
        "type": "string"
      }
    }
   */
  PostsControllers.upDatePost(req, res, next)
);

module.exports = router;
