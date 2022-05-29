var express = require('express');
var router = express.Router();

const UsersControllers = require('../controllers/users');

router.post('/', (req, res, next) =>
  /** #swagger.description = '新增使用者'
   * #swagger.tags = ['users (使用者)'],
   * #swagger.parameters['body'] = {
      in: "body",
      type: "object",
      required: true,
      description: "資料格式查看必填欄位，點按下方 Model 切換後，屬性欄位名稱的後方紅色的*",
      schema: {
        "$userName": "jimmyWu",
        "$email": "gg@mail.com",
        "$password": "123456",
        "avatarUrl": "https://avatars.githubusercontent.com/u/42748910?v=4"
      }
    }
   */
  UsersControllers.createdUser(req, res, next)
);
router.post('/signUp', (req, res, next) =>
  UsersControllers.signUp(req, res, next)
);

module.exports = router;
