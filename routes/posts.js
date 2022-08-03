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
    * #swagger.parameters['timeSort'] = {
      in: 'query',
      type: 'string',
      required: false,
      description: `
        <code>timeSort</code> 參數：
        <ul>
          <li>預設新到舊</li>
          <li>是否有 <code>asc</code> 值？，有值有舊到新；沒值有新到舊。</li>
        </ul>
      `,
    },
    * #swagger.parameters['q'] = {
      in: 'query',
      type: 'string',
      required: false,
      description: `
        <code>q</code> 參數：
        <ul>
          <li>查找物件中的留言 <code>discussContent</code>。</li>
          <li>用正則表達式以 JS 轉 mongDB 語法 <code>.find( parName: /<查尋字串>/)</code>。</li>
        </ul>
      `,
    },
    * #swagger.parameters['queryUser'] = {
      in: 'query',
      type: 'string',
      required: false,
      description: `
        <code>queryUser</code> 參數：
        <ul>
          <li>查找 <code>userData</code> 指定 user id。</li>
        </ul>
      `,
    },
    * #swagger.parameters['pageNum'] = {
      in: 'query',
      type: 'string',
      required: false,
      description: `
        <code>pageNum</code> 參數：取頁面資料筆數長度 (目前分頁數 <code>0</code> 為第一頁)
        <ul>
          <li>判斷網址參數 <code>pageSize</code> 是否有值，若無值會段 <code>0</code> 取出所有資料。</li>
          <li>參數以 <code>1</code> 累計。</li>
        </ul>
      `,
    },
    * #swagger.parameters['pageSize'] = {
      in: 'query',
      type: 'string',
      required: false,
      description: `
        <code>pageSize</code> 參數：取頁面資料區間 (分頁中每頁的資料筆數)
        <ul>
          <li>由第 <code>0</code> 筆數位置做為 <code>1</code> 開始計算。</li>
          <li>參數以由 <code>1</code> 以累計。</li>
          <li>網址參數 <code>pageSize * pageNum = 頁面數</code> 做為計算結果。</li>
        </ul>
      `,
    },
    * #swagger.responses[200] = {
      description: '取得所有貼文',
      schema: {
        "status": true,
        "data": [
          {
            "_id": "629a2b0df97cf49063a259cd",
            "userData": {
              "_id": "629a24a903a87b6101044846",
              "userName": "newPatchUserName",
              "email": "gg@mail.com",
              "createAt": "2022-06-03T15:11:37.281Z",
              "followers": [
                {
                  "userData": "629a3dae000fcec3e68c92c7",
                  "_id": "62a489ab3ae436726f403732",
                  "createdAt": "2022-06-11T12:25:15.257Z"
                }
              ],
              "following": []
            },
            "content": "newPost__外面看起來就超冷…\n\r我決定回被窩繼續睡…>.<-大明二  123",
            "tags": [
              "感情2"
            ],
            "type": "person",
            "image": "http://",
            "createAt": "2022-06-03T15:38:53.190Z",
            "likes": [
              {
                "_id": "629a21143742640bf2686ece",
                "userName": "小明123",
                "following": [
                  {
                    "userData": {
                      "_id": "629a36279ff4cca699138272",
                      "userName": "小明-sign_up",
                      "followers": [
                        {
                          "userData": "629a21143742640bf2686ece",
                          "_id": "62a489ef3ae436726f403740",
                          "createdAt": "2022-06-11T12:26:23.561Z"
                        }
                      ],
                      "following": []
                    },
                    "_id": "62a489ef3ae436726f40373e",
                    "createdAt": "2022-06-11T12:26:23.559Z"
                  },
                  {
                    "userData": {
                      "_id": "629a3a460257543f897c4136",
                      "userName": "cc",
                      "followers": [
                        {
                          "userData": "629a21143742640bf2686ece",
                          "_id": "62a489f53ae436726f403746",
                          "createdAt": "2022-06-11T12:26:29.097Z"
                        }
                      ],
                      "following": []
                    },
                    "_id": "62a489f53ae436726f403744",
                    "createdAt": "2022-06-11T12:26:29.096Z"
                  },
                  {
                    "userData": {
                      "_id": "629a3dae000fcec3e68c92c7",
                      "userName": "aa_gmwu",
                      "avatarUrl": "https://avatars.githubusercontent.com/u/42748910?v=4",
                      "following": [
                        {
                          "userData": {
                            "_id": "629a24a903a87b6101044846",
                            "userName": "newPatchUserName",
                            "followers": [
                              {
                                "userData": "629a3dae000fcec3e68c92c7",
                                "_id": "62a489ab3ae436726f403732",
                                "createdAt": "2022-06-11T12:25:15.257Z"
                              }
                            ],
                            "following": []
                          },
                          "_id": "62a489ab3ae436726f403730",
                          "createdAt": "2022-06-11T12:25:15.256Z"
                        }
                      ],
                      "followers": [
                        {
                          "userData": "629a21143742640bf2686ece",
                          "_id": "62e562c810e9414e747b669f",
                          "createdAt": "2022-07-30T16:56:40.726Z"
                        }
                      ]
                    },
                    "_id": "62e562c810e9414e747b669d",
                    "createdAt": "2022-07-30T16:56:40.725Z"
                  }
                ],
                "avatarUrl": "https://i.imgur.com/hYlhp1V.jpg",
                "followers": []
              }
            ],
            "comments": [
              {
                "_id": "62a4706dc8d2c03c05396a47",
                "comment": "new comment",
                "commentUser": {
                  "_id": "629a21143742640bf2686ece",
                  "userName": "小明123",
                  "email": "min@mail.com",
                  "createAt": "2022-06-03T14:56:20.317Z",
                  "following": [
                    {
                      "userData": {
                        "_id": "629a36279ff4cca699138272",
                        "userName": "小明-sign_up",
                        "followers": [
                          {
                            "userData": "629a21143742640bf2686ece",
                            "_id": "62a489ef3ae436726f403740",
                            "createdAt": "2022-06-11T12:26:23.561Z"
                          }
                        ],
                        "following": []
                      },
                      "_id": "62a489ef3ae436726f40373e",
                      "createdAt": "2022-06-11T12:26:23.559Z"
                    },
                    {
                      "userData": {
                        "_id": "629a3a460257543f897c4136",
                        "userName": "cc",
                        "followers": [
                          {
                            "userData": "629a21143742640bf2686ece",
                            "_id": "62a489f53ae436726f403746",
                            "createdAt": "2022-06-11T12:26:29.097Z"
                          }
                        ],
                        "following": []
                      },
                      "_id": "62a489f53ae436726f403744",
                      "createdAt": "2022-06-11T12:26:29.096Z"
                    },
                    {
                      "userData": {
                        "_id": "629a3dae000fcec3e68c92c7",
                        "userName": "aa_gmwu",
                        "avatarUrl": "https://avatars.githubusercontent.com/u/42748910?v=4",
                        "following": [
                          {
                            "userData": {
                              "_id": "629a24a903a87b6101044846",
                              "userName": "newPatchUserName",
                              "followers": [
                                {
                                  "userData": "629a3dae000fcec3e68c92c7",
                                  "_id": "62a489ab3ae436726f403732",
                                  "createdAt": "2022-06-11T12:25:15.257Z"
                                }
                              ],
                              "following": []
                            },
                            "_id": "62a489ab3ae436726f403730",
                            "createdAt": "2022-06-11T12:25:15.256Z"
                          }
                        ],
                        "followers": [
                          {
                            "userData": "629a21143742640bf2686ece",
                            "_id": "62e562c810e9414e747b669f",
                            "createdAt": "2022-07-30T16:56:40.726Z"
                          }
                        ]
                      },
                      "_id": "62e562c810e9414e747b669d",
                      "createdAt": "2022-07-30T16:56:40.725Z"
                    }
                  ],
                  "avatarUrl": "https://i.imgur.com/hYlhp1V.jpg",
                  "followers": []
                },
                "post": "629a2b0df97cf49063a259cd",
                "createAt": "2022-06-11T10:37:33.636Z"
              }
            ],
            "id": "629a2b0df97cf49063a259cd"
          }
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
              "avatarUrl": "https://avatars.githubusercontent.com/u/42748910?v=4",
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
        "status": true,
        "data": {
          "_id": "62eab40480f19d4a8ad332c8",
          "comment": "555 這是留言在貼文裡的一段話",
          "commentUser": {
            "_id": "629a3dae000fcec3e68c92c7",
            "userName": "aa_gmwu",
            "email": "aa@mail.com",

            "createAt": "2022-06-03T16:58:22.592Z",
            "avatarUrl": "https://avatars.githubusercontent.com/u/42748910?v=4",
            "following": [
              {
                "userData": {
                  "_id": "629a24a903a87b6101044846",
                  "userName": "newPatchUserName",
                  "followers": [
                    {
                      "userData": "629a3dae000fcec3e68c92c7",
                      "_id": "62a489ab3ae436726f403732",
                      "createdAt": "2022-06-11T12:25:15.257Z"
                    }
                  ],
                  "following": []
                },
                "_id": "62a489ab3ae436726f403730",
                "createdAt": "2022-06-11T12:25:15.256Z"
              }
            ],
            "followers": []
          },
          "post": "62bc05bb71cb3303534b2834",
          "createAt": "2022-08-03T17:44:36.382Z"
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
    * #swagger.security = [{
      'apiKeyAuth': []
    }]
    * #swagger.parameters['id'] = {
      in: 'path',
      type: 'string',
      required: true,
      description: `Params path Variables <code>:id</code> (user ID)`
    },
    * #swagger.parameters['timeSort'] = {
      in: 'query',
      type: 'string',
      required: false,
      description: `
        <code>timeSort</code> 參數：
        <ul>
          <li>預設新到舊</li>
          <li>是否有 <code>asc</code> 值？，有值有舊到新；沒值有新到舊。</li>
        </ul>
      `,
    },
    * #swagger.parameters['post_id'] = {
      in: 'query',
      type: 'string',
      required: false,
      description: `
        <code>post_id</code> 參數：
        <ul>
          <li>基於特定 user ID 下專屬單筆 post，查詢單筆 post ID。</li>
          <li>可不帶上參數空值，帶出 user ID 所有 post。</li>
        </ul>
      `,
    },
    * #swagger.parameters['q'] = {
      in: 'query',
      type: 'string',
      required: false,
      description: `
        <code>q</code> 參數：
        <ul>
          <li>查找物件中的留言 <code>discussContent</code>。</li>
          <li>用正則表達式以 JS 轉 mongDB 語法 <code>.find( parName: /<查尋字串>/)</code>。</li>
        </ul>
      `,
    },
    #swagger.responses[200] = {
      description: `新增貼文留言功能`,
      schema: {
        "status": true,
        "data": [
          {
            "_id": "62bbef6b47d0affc2226336a",
            "userData": {
              "_id": "629a21143742640bf2686ece",
              "userName": "小明123",
              "email": "min@mail.com",
              "createAt": "2022-06-03T14:56:20.317Z",
              "following": [
                {
                  "userData": {
                    "_id": "629a36279ff4cca699138272",
                    "userName": "小明-sign_up",
                    "followers": [
                      {
                        "userData": "629a21143742640bf2686ece",
                        "_id": "62a489ef3ae436726f403740",
                        "createdAt": "2022-06-11T12:26:23.561Z"
                      }
                    ],
                    "following": []
                  },
                  "_id": "62a489ef3ae436726f40373e",
                  "createdAt": "2022-06-11T12:26:23.559Z"
                },
                {
                  "userData": {
                    "_id": "629a3a460257543f897c4136",
                    "userName": "cc",
                    "followers": [
                      {
                        "userData": "629a21143742640bf2686ece",
                        "_id": "62a489f53ae436726f403746",
                        "createdAt": "2022-06-11T12:26:29.097Z"
                      }
                    ],
                    "following": []
                  },
                  "_id": "62a489f53ae436726f403744",
                  "createdAt": "2022-06-11T12:26:29.096Z"
                },
                {
                  "userData": {
                    "_id": "629a3dae000fcec3e68c92c7",
                    "userName": "aa_gmwu",
                    "avatarUrl": "https://avatars.githubusercontent.com/u/42748910?v=4",
                    "following": [
                      {
                        "userData": {
                          "_id": "629a24a903a87b6101044846",
                          "userName": "newPatchUserName",
                          "followers": [
                            {
                              "userData": "629a3dae000fcec3e68c92c7",
                              "_id": "62a489ab3ae436726f403732",
                              "createdAt": "2022-06-11T12:25:15.257Z"
                            }
                          ],
                          "following": []
                        },
                        "_id": "62a489ab3ae436726f403730",
                        "createdAt": "2022-06-11T12:25:15.256Z"
                      }
                    ],
                    "followers": [
                      {
                        "userData": "629a21143742640bf2686ece",
                        "_id": "62e562c810e9414e747b669f",
                        "createdAt": "2022-07-30T16:56:40.726Z"
                      }
                    ]
                  },
                  "_id": "62e562c810e9414e747b669d",
                  "createdAt": "2022-07-30T16:56:40.725Z"
                }
              ],
              "avatarUrl": "https://i.imgur.com/hYlhp1V.jpg",
              "followers": []
            },
            "content": "newPost003__外面看起來就超冷…\n\r我決定回被窩繼續睡…>.<-大明二",
            "tags": [
              "感情2"
            ],
            "type": "person",
            "image": "http://",
            "likes": [],
            "createAt": "2022-06-29T06:21:31.448Z",
            "comments": [],
            "id": "62bbef6b47d0affc2226336a"
          }
        ]
      }
    }
  */
  (req, res, next) => PostsControllers.getMyPostList(req, res, next)
);

module.exports = router;
