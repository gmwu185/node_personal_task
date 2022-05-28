const { handleSuccess } = require('../handStates/handles');
const handleErrorAsync = require('../handStates/handleErrorAsync');
const User = require('../model/users');

module.exports = {
  async createdUser(req, res) {
    /** #swagger.tags = ['users (使用者)']
     ** #swagger.description = '新增使用者'
     */
    try {
      /**
        ** #swagger.parameters['body'] = {
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
      const data = req.body;
      const user = {
        userName: data.userName,
        email: data.email,
        password: data.password,
        avatarUrl: data.avatarUrl, // 頭像
      };
      await User.create(user).then(async () => {
        const allUser = await User.find();
        handleSuccess(res, allUser);
      });
    } catch (err) {
      console.log('req error', err);
      handleErrorAsync(res, err);
    }
  },
};
