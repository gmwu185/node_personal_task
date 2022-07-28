const mongoose = require('mongoose');
const postsSchema = new mongoose.Schema(
  {
    userData: {
      type: mongoose.Schema.ObjectId,
      ref: 'user',
      required: [true, '貼文姓名未填寫'],
    },
    content: {
      type: String,
      required: [true, 'Content 未填寫'],
      trim: true,
    },
    tags: [
      {
        type: String,
        required: false,
      },
    ],
    type: {
      type: String,
      enum: ['group', 'person'],
      required: false,
    },
    image: {
      type: String,
      default: '',
    },
    createAt: {
      type: Date,
      default: Date.now,
      select: true, // 設定回傳時間呈現
    },
    likes: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'user', // id 要去找 user 的那張表的 ID
      },
    ],
  },
  {
    versionKey: false, // 移除預設欄位 __v
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

postsSchema.virtual('comments', {
  ref: 'Comment', // 指向 Comment Model
  foreignField: 'post', // 指向 DB posts collection
  localField: '_id',
});
const posts = mongoose.model('Post', postsSchema);

module.exports = posts;
