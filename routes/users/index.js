var express = require('express');
var router = express.Router();

const { isAuth } = require('../../middlewares/auth');
const UsersControllers = require('../../controllers/users');

router.post(
  '/user/sign-in',
  /** #swagger.summary = '登入會員'
    * #swagger.tags = ['會員功能']
    * #swagger.parameters['body'] = {
      in: "body",
      type: "object",
      required: "success",
      description: ``,
      schema: {
        "$email": "aa@mail.com",
        "$password": "a12345678"
      }
    },
    * #swagger.responses[200] = {
      description: '',
      schema: {
        "status": "success",
        "data": {
          "token": "<Token>",
          "wholeToken": "Bearer <Token>",
          "userName": "aa",
          "premiumMember": true
        }
      },
    }
  */
  (req, res, next) => UsersControllers.signIn(req, res, next)
);
router.post(
  '/user/sign-up',
  /** #swagger.summary = '註冊會員'
    * #swagger.tags = ['會員功能']
    * #swagger.parameters['body'] = {
      in: "body",
      type: "object",
      required: "success",
      description: ``,
      schema: {
        "$userName": "aa",
        "$email": "aa@mail.com",
        "$password": "a12345678",
        "$confirmPassword": "a12345678"
      }
    },
    * #swagger.responses[200] = {
      description: '',
      schema: {
        "status": "success",
        "data": {
          "token": "<Token>",
          "wholeToken": "Bearer <Token>",
          "userName": "cc"
        }
      },
    }
  */
  (req, res, next) => UsersControllers.signUp(req, res, next)
);
router.patch(
  '/user/update-password',
  isAuth,
  /** #swagger.summary = '重設密碼'
    * #swagger.tags = ['會員功能']
    * #swagger.security = [{
      'apiKeyAuth': []　
    }],
    * #swagger.parameters['body'] = {
      in: "body",
      type: "object",
      required: "success",
      description: ``,
      schema: {
        "$newPassword": "a11223344",
        "$confirmNewPassword": "a11223344"
      }
    },
    * #swagger.responses[200] = {
      description: '',
      schema: {
        "status": "success",
        "data": {
          "token": "<Token>",
          "wholeToken": "Bearer <Token>",
          "userName": "cc"
        }
      },
    }
  */
  (req, res, next) => UsersControllers.updatePassword(req, res, next)
);
router.get(
  '/user/profile',
  isAuth,
  /** #swagger.summary = '取得個人資料'
    * #swagger.tags = ['會員功能']
    * #swagger.security = [{
      'apiKeyAuth': []　
    }],
    * #swagger.parameters['queryUser'] = {
      required: false,
      description: `
        網址參數 <code>queryUser</code>
        <ul>
          <li>指定追蹤對象的 <code>user.id</code>。</li>
          <li><code>queryUser</code> 如果沒由網址傳入 userID (空值或未定義)，就會是登入使用者的 userID</li>
        </ul>
      `
    },
    * #swagger.responses[200] = {
      description: '',
      schema: {
        "status": true,
        "data": {
          "gender": "",
          "_id": "629a24a903a87b6101044846",
          "userName": "userName",
          "email": "dd@mail.com",
        }
      },
    }
  */
  (req, res, next) => UsersControllers.getProfile(req, res, next)
);
router.patch(
  '/user/profile',
  isAuth,
  /** #swagger.summary = '更新個人資料'
    * #swagger.tags = ['會員功能']
    * #swagger.security = [{
      'apiKeyAuth': []　
    }],
    * #swagger.parameters['body'] = {
      in: "body",
      type: "object",
      required: "success",
      description: ``,
      schema: {
        "$userName": "newPatchUserName",
        "avatarUrl": "https://...",
        "gender": "",
      }
    },
    * #swagger.responses[200] = {
      description: '',
      schema: {
        "status": true,
        "data": {
          "_id": "629a3dae000fcec3e68c92c7",
          "userName": "newPatchUserName",
          "email": "aa@mail.com",
          "gender": "",
          "avatarUrl": "https://..."
        }
      },
    }
  */
  (req, res, next) => UsersControllers.patchProfile(req, res, next)
);
router.get(
  '/user/like-list',
  isAuth,
  /** #swagger.summary = '取得個人按讚列表',
  * #swagger.tags = ['會員按讚追蹤動態'],
  * #swagger.security = [{
    'apiKeyAuth': []
  }]
 */
  (req, res, next) => UsersControllers.getMyLikeList(req, res, next)
);
router.post(
  '/user/:id/follow',
  isAuth,
  /** #swagger.summary = '追蹤朋友',
    * #swagger.tags = ['會員按讚追蹤動態'],
    * #swagger.security = [{
      'apiKeyAuth': []
    }],
    * #swagger.parameters['id'] = {
      description: `網址參數 <code>:id</code> 指定追蹤對象的 <code>user.id</code>。`
    },
    * #swagger.responses[200] = {
      schema: {
        "status": "success",
        "data": {
          "message": "您已成功將 628a629b1c4b458a51db745b 加入追蹤！"
        }
      }
    }
   */
  (req, res, next) => UsersControllers.addFollow(req, res, next)
);
router.delete(
  '/user/:id/follow',
  isAuth,
  /** #swagger.summary = '取消追蹤朋友',
    * #swagger.tags = ['會員按讚追蹤動態'],
    * #swagger.security = [{
        'apiKeyAuth': []
      }],
    * #swagger.parameters['id'] = {
        description: `網址參數 <code>:id</code> 指定追蹤對象的 <code>user.id</code>。`
      },
    * #swagger.responses[200] = {
      schema: {
        "status": "success",
        "data": {
          "message": "您已成功將 628a629b1c4b458a51db745b 取消追蹤！"
        }
      }
    }
  */
  (req, res, next) => UsersControllers.unFollow(req, res, next)
);
router.get(
  '/user/following',
  isAuth,
  /** #swagger.summary = '取得個人追蹤名單',
    * #swagger.tags = ['會員按讚追蹤動態'],
    * #swagger.security = [{
        'apiKeyAuth': []
      }],
    * #swagger.responses[200] = {
      schema: {
        "status": true,
        "data": [
          {
            "userData": {
              "_id": "629a24a903a87b6101044846",
              "userName": "newPatchUserName",
              "following": []
            },
            "_id": "62a4899c3ae436726f403729",
            "createdAt": "2022-06-11T12:25:00.412Z"
          },
        ]
      }
    }
  */
  (req, res, next) => UsersControllers.getUserFollow(req, res, next)
);

module.exports = router;
