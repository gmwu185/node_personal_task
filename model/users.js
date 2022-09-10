const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
    googleId: String,
    facebookId: String,
    userName: {
      type: String,
      required: [true, '名字必填'],
    },
    email: {
      type: String,
      required: [true, 'email必填'],
    },
    password: {
      type: String,
      required: [true, 'password必填'],
      select: false,
    },
    avatarUrl: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      required: false,
      enum: ['male', 'female', ''],
      default: '',
    },
    followers: [
      {
        userData: { type: mongoose.Schema.ObjectId, ref: 'user' },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    following: [
      {
        userData: { type: mongoose.Schema.ObjectId, ref: 'user' },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    createAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  {
    versionKey: false, // 移除預設欄位 __v
  }
);

/** 若有 find 則時觸發 following 虛擬掛載
 * 在 .populate() 所傳物件屬性 path，只能指定一個 document 做為關連對象
 * 11. 多层级填充 (https://itbilu.com/nodejs/npm/HkAKMTECm.html)
 */
userSchema.pre(/^find/, function (next) {
  /** 寫法一：
   * 一張表能掛載進 2 個 document，
   * populate 屬性使用只能用於一個 document (這裡指給 following)
   * userData following 可關聯，帶 id 部份無法關聯
   */
  this.populate({
    path: 'following',
    populate: {
      path: 'userData',
      model: 'user',
      select: 'userName createdAt avatarUrl',
    },
  }).populate('followers');

  /** 寫法二：(初步寫法)
   * 一張表只能載進 following
   * userData 帶 id 部份成功關聯
   */
  // this.populate({
  //   path: 'following', // deep-populate 深關聯 collection 一個 document
  //   populate: {
  //     path: 'userData',
  //     model: 'user',
  //     select: 'userName',
  //   },
  // });

  next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;
