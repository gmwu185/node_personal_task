var express = require('express');
var router = express.Router();

const { isAuth } = require('../handStates/auth');

const UsersControllers = require('../controllers/users');

// router.post('/', (req, res, next) =>
//   /** #swagger.summary = '新增使用者'
//    * #swagger.description = '新增使用者'
//    * #swagger.tags = ['users (使用者)'],
//    * #swagger.parameters['body'] = {
//       in: "body",
//       type: "object",
//       required: true,
//       description: "資料格式查看必填欄位，點按下方 Model 切換後，屬性欄位名稱的後方紅色的*",
//       schema: {
//         "$userName": "jimmyWu",
//         "$email": "gg@mail.com",
//         "$password": "123456",
//         "avatarUrl": "https://avatars.githubusercontent.com/u/42748910?v=4"
//       }
//     }
//    */
//   UsersControllers.createdUser(req, res, next)
// );
router.post(
  '/signIn',
  /** #swagger.summary = '登入'
    * #swagger.tags = ['users (使用者)']
    * #swagger.security = [{
      'apiKeyAuth': []　
    }],
    * #swagger.parameters['body'] = {
      in: "body",
      type: "object",
      required: "success",
      description: ``,
      schema: {
        "$email": "aa@mail.com",
        "$password": "12345678"
      }
    },
    * #swagger.responses[200] = {
      description: '',
      schema: {
        "status": "success",
        "data": {
          "token": "<Token>",
          "wholeToken": "Bearer <Token>",
          "userName": "aa"
        }
      },
    }
  */
  (req, res, next) => UsersControllers.signIn(req, res, next)
);
router.post(
  '/signUp',
  /** #swagger.summary = '註冊'
    * #swagger.tags = ['users (使用者)']
    * #swagger.security = [{
      'apiKeyAuth': []　
    }],
    * #swagger.parameters['body'] = {
      in: "body",
      type: "object",
      required: "success",
      description: ``,
      schema: {
        "$userName": "aa",
        "$email": "aa@mail.com",
        "$password": "12345678",
        "$confirmPassword": "12345678"
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
  '/updatePassword',
  isAuth,
  /** #swagger.summary = '重設密碼'
    * #swagger.tags = ['users (使用者)']
    * #swagger.security = [{
      'apiKeyAuth': []　
    }],
    * #swagger.parameters['body'] = {
      in: "body",
      type: "object",
      required: "success",
      description: ``,
      schema: {
        "$newPassword": "11223344",
        "$confirmNewPassword": "11223344"
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
  '/profile',
  isAuth,
  /** #swagger.summary = '取得個人資料'
    * #swagger.tags = ['users (使用者)']
    * #swagger.security = [{
      'apiKeyAuth': []　
    }],
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
  '/profile',
  isAuth,
  /** #swagger.summary = '更新個人資料'
    * #swagger.tags = ['users (使用者)']
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

module.exports = router;
