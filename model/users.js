const mongoose = require('mongoose');
const userSchema = new mongoose.Schema(
  {
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

// 若有 find 則時觸發 following 虛擬掛載
userSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'following',
    populate: {
      path: 'userData',
      model: 'user',
      select: 'userName userId',
    },
  });
  next();
});

const User = mongoose.model('user', userSchema);

module.exports = User;
