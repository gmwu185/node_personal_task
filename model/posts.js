const mongoose = require('mongoose');
const postsSchema = new mongoose.Schema(
  {
    userData: {
      type: mongoose.Schema.ObjectId,
      ref: "user",
      required: [true, '貼文姓名未填寫'],
    },
    content: {
      type: String,
      required: [true, 'Content 未填寫'],
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
      select: false,
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
  },
  {
    versionKey: false, // 移除預設欄位 __v
  }
);

const posts = mongoose.model('Post', postsSchema);

module.exports = posts;
