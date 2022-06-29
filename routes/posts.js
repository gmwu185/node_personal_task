var express = require('express');
var router = express.Router();

const { isAuth } = require('../middlewares/auth');
const { doc_getPost } = require('../middlewares/doc/posts');

const Posts = require('../model/posts');
const PostsControllers = require('../controllers/posts');

router.get('/posts', isAuth, (req, res, next) =>
  /** #swagger.summary = '取得所有貼文'
    * #swagger.description = '取得所有貼文'
    * #swagger.tags = ['動態貼文']
    * #swagger.security = [{
      'apiKeyAuth': []
    }],
    * #swagger.responses[200] = {
      description: '取得所有貼文',
      schema: {
        "status": true,
        "data": [
          {
            "_id": "62a463157ec29c5077e7921a",
            "userData": {
              "_id": "629a24a903a87b6101044846",
              "userName": "newPatchUserName",
              "email": "gg@mail.com",
              "createAt": "2022-06-03T15:11:37.281Z"
            },
            "content": "01_test",
            "tags": [
              "感情2"
            ],
            "type": "person",
            "image": "http://",
            "likes": [
              {
                "_id": "629a3dae000fcec3e68c92c7",
                "userName": "newPatchUserName"
              }
            ],
            "comments": [],
            "id": "62a463157ec29c5077e7921a"
          },
        ]
      }
    }
  */
  PostsControllers.getPosts(req, res, next)
);
router.get('/post/:id', isAuth, (req, res, next) =>
  /** #swagger.summary = '取得單一貼文',
    #swagger.description = `取得單一貼文
      <ul>
        <li>網址路由以 <code>:id</code> 傳入參數，直接針對 Posts 中的 document id 進行取得資料。</li>
      </ul>
    `,
    * #swagger.tags = ['動態貼文']
    * #swagger.security = [{
      'apiKeyAuth': []
    }],
    * #swagger.parameters['id'] = {
      in: 'path',
      type: 'string',
      required: true,
    },
    #swagger.responses[200] = {
      description: `取得單筆貼文`,
      schema: {
        "status": true,
        "data": {
          "_id": "629a2c258329aaee5f70d63e",
          "userData": {
            "_id": "629a24a903a87b6101044846",
            "userName": "newPatchUserName",
            "email": "gg@mail.com",
            "createAt": "2022-06-03T15:11:37.281Z"
          },
          "content": "03_test",
          "tags": [
            "感情2"
          ],
          "type": "person",
          "image": "http://",
          "likes": [
            {
              "_id": "629a21143742640bf2686ece",
              "userName": "小明-sign_up"
            }
          ],
          "comments": [],
          "id": "629a2c258329aaee5f70d63e"
        }
      }
    }
   */
  PostsControllers.getPost(req, res, next)
);
// router.get('/post/:id', isAuth, doc_getPost, (req, res, next) =>
//   PostsControllers.getPost(req, res, next)
// );
router.post('/post/', isAuth, (req, res, next) =>
  /** #swagger.summary = '新增貼文'
    * #swagger.description = '新增單筆貼文'
    * #swagger.tags = ['動態貼文']
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
          "likes": [],
          "_id": "62a47b276928a5e055f3978a",
          "createAt": "2022-06-11T11:23:19.090Z",
          "id": "62a47b276928a5e055f3978a"
        }
      }
    }
   */
  PostsControllers.createdPost(req, res, next)
);
router.delete('/posts/', isAuth, (req, res, next) =>
  /** #swagger.summary = '刪除所有貼文'
    * #swagger.description = '刪除所有貼文'
    * #swagger.tags = ['動態貼文']
    * #swagger.security = [{
      'apiKeyAuth': []
    }],
   */
  PostsControllers.delALLPosts(req, res, next)
);
router.delete('/post/:id', isAuth, (req, res, next) =>
  /** #swagger.summary = '刪除單筆貼文'
    * #swagger.description = '刪除單筆貼文'
    * #swagger.tags = ['動態貼文']
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
router.patch(
  '/post/:id/likes',
  isAuth,
  /** #swagger.summary = '新增與移除單筆貼文按讚',
    * #swagger.description = `
      <ul>
        <li>網址路由以 <code>:id</code> 傳入參數，直接針對 Posts 中的 postID 進行新增或移除按讚。</li>
      </ul>
    `,
    * #swagger.tags = ['會員按讚追蹤動態'],
    * #swagger.security = [{
      'apiKeyAuth': []
    }],
    * #swagger.parameters['id'] = {
      in: 'path',
      type: 'string',
      required: true,
    },
    * #swagger.responses[200] = {
      description: `
        新增與移除單筆貼文按讚資料格式
      `,
      schema: {
        "status": "success",
        "data": {
          "_id": "62930bf5f09683041ecd0b3a",
          "userData": "6290f87ed5f22368e79e666e",
          "discussContent": "測試github方面",
          "discussPhoto": "",
          "tag": "標籤 string",
          "likes": [
            {
              "_id": "628a53f86e242867112a2321",
              "userName": "大明123",
              "userPhoto": "https://avatars.githubusercontent.com/u/42748910?v=4",
              "email": "min-@mail.com",
              "gender": "male"
            }
          ],
          "createAt": "2022-05-29T06:00:21.753Z",
          "id": "62930bf5f09683041ecd0b3a"
        }
      }
    }
  */
  (req, res, next) => PostsControllers.toggleLike(req, res, next)
);
router.patch('/post/:id', isAuth, (req, res, next) =>
  /** #swagger.summary = '更新單筆貼文'
    * #swagger.tags = ['動態貼文']
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
router.post(
  '/post/:id/comment',
  isAuth,
  /** #swagger.summary = '新增一則貼文的留言',
    * #swagger.tags = ['動態貼文']
    * #swagger.description = `
      <ul>
        <li>Heders Token 指定留言 user (<code>commentUser</code>)。</li>
        <li>網址路由 <code>:id</code> 傳入 post id 在特定貼文中留言。</li>
        <li>成功留言將資料寫入 <code>Comment</code> collection 中建出 document。</li>
      </ul>
    `,
    * #swagger.parameters['id'] = {
        in: 'path',
        type: 'string',
        required: true,
        description: `Params path Variables <code>:id</code> (posts ID)`
      }
    * #swagger.security = [{
      'apiKeyAuth': []
    }],
    * #swagger.parameters['body'] = {
      in: "body",
      type: "object",
      required: true,
      description: `Body 資料格式`,
      schema: {
        "$comment": "這是留言在貼文裡的一段話"
      },
    },
    #swagger.responses[200] = {
      description: `新增貼文留言功能`,
      schema: {
        "status": "success",
        "data": {
          "comments": {
            "comment": "這是留言在貼文裡的一段話 - swagger",
            "commentUser": "628a629b1c4b458a51db745b",
            "post": "628c367b714bc9f6a8e17857",
            "_id": "628c6607e6b23dcb0832041d",
            "createAt": "2022-05-24T04:58:47.058Z",
          }
        }
      }
    }
  */
  (req, res, next) => PostsControllers.createComment(req, res, next)
);
router.get(
  '/posts/user/:id',
  isAuth,
  /** #swagger.summary = '取得個人所有貼文列表',
    * #swagger.tags = ['動態貼文']
    * #swagger.description = `
      <ul>
        <li>網址路由 <code>:id</code> 傳入 user id 做為查詢對象，向 posts DB 查詢。</li>
      </ul>
    `,
    * #swagger.parameters['id'] = {
        in: 'path',
        type: 'string',
        required: true,
        description: `Params path Variables <code>:id</code> (user ID)`
      }
    * #swagger.security = [{
      'apiKeyAuth': []
    }]
    #swagger.responses[200] = {
      description: `新增貼文留言功能`,
      schema: {
        "status": true,
        "data": [
          {
            "_id": "62a48066144c37745976f6dc",
            "userData": {
              "_id": "629a21143742640bf2686ece",
              "userName": "小明-sign_up",
              "email": "min@mail.com",
              "createAt": "2022-06-03T14:56:20.317Z"
            },
            "content": "03_test",
            "tags": [
              "感情2"
            ],
            "type": "person",
            "image": "http://",
            "likes": [],
            "comments": [
              {
                "_id": "62a48487c1b5d0d55ef3979b",
                "comment": "new comment",
                "commentUser": {
                  "_id": "629a21143742640bf2686ece",
                  "userName": "小明-sign_up",
                  "email": "min@mail.com",
                  "createAt": "2022-06-03T14:56:20.317Z"
                },
                "post": "62a48066144c37745976f6dc",
                "createAt": "2022-06-11T12:03:19.117Z"
              }
            ],
            "id": "62a48066144c37745976f6dc"
          }
        ]
      }
    }
  */
  (req, res, next) => PostsControllers.getMyPostList(req, res, next)
);

module.exports = router;
