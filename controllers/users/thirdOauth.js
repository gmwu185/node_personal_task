const bcrypt = require('bcryptjs');
const User = require('../../model/users');
const { generateRedirectJWT } = require('../../middlewares/auth');
const handleErrorAsync = require('../../handStates/handleErrorAsync');

const googleCallback = handleErrorAsync(async (req, res) => {
  /** googleCallback 收 Google User 資訊過程
   * 1. 一開紿觸發函式不會有資料 ( req.use 先 undefined)
   * 2. 以 passport.js 以 profile 參數收到 Google User 資訊後，將資訊賦予在 req.user 才能在下 ._json 取得資訊
   */
  const { name, email, sub, picture } = req.user._json;
  const googleUser = { name, email, sub, picture };
  // console.log('googleCallback thirdOauth googleUser', googleUser);

  // 判斷 Google 登入所帶資料，如果其中一項沒屬性欄性沒有，就導向特定前台頁面進行註冊會員
  if (!googleUser.name || !googleUser.sub) {
    res.redirect(`${process.env.FRONTEND_URL}/register.html`);
    res.end();
  }

  let googleLoginUser = null;
  const existUserEmail = await User.findOne({ email: googleUser.email });
  console.log('existUserEmail -> null 沒註冊過', existUserEmail);
  if (existUserEmail) {
    // 查找 Google email 回傳不為 null 表示有使用 email 註冊過
    if (!existUserEmail.googleId) {
      /** 更新 google user 資訊
       * googleUser.sub (ID) 指向 user.googleId 欄位
       */
      const updateUser = await User.findByIdAndUpdate(
        existUserEmail.id,
        {
          googleId: googleUser.sub,
        },
        {
          versionKey: false,
          new: true,
        }
      );
      console.log('updateUser', updateUser);
      googleLoginUser = updateUser;
    } else {
      googleLoginUser = existUserEmail;
    }
  } else {
    /**
     * 查找 Google email 回傳 null 表示沒註冊過
     * 未建 user 帳號建立新帳號，Google User 資訊賦予建立
     * 未建 user 帳號給初始密碼
     */
    const initPassword = await bcrypt.hash(
      process.env.THIRD_DEFAULT_PASSWORD,
      12
    );
    /** initPassword
     *  使用 Firefox Developer Edition 瀏覽器，可能是測試版瀏覽器的關係，
        透過 /google/callback API 時會產生 node_modules 錯誤回應產生程式中斷
     */
    // console.log('initPassword', initPassword);
    const newUser = await User.create({
      password: initPassword,
      email: googleUser.email,
      userName: googleUser.name,
      avatarUrl: googleUser.picture,
      googleId: googleUser.sub,
    });
    googleLoginUser = newUser;
  }

  // console.log('googleLoginUser', googleLoginUser);
  // 沒有查驗過的 user 資訊或 googleId 導向註冊頁
  if (!googleLoginUser || !googleLoginUser.googleId) {
    res.redirect(`${process.env.FRONTEND_URL}/register.html`);
    res.end();
  }

  // 使用 google 登入的 user 又或是 newUser，都通過驗証會發行 Token
  generateRedirectJWT(googleLoginUser, res);
});

module.exports = {
  googleCallback,
};
