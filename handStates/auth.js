const jwt = require('jsonwebtoken');
const User = require('../model/users');

module.exports = {
  // 產生 JWT token
  generateSendJWT: (user, statusCode, res) => {
    const token = jwt.sign(
      {
        id: user._id,
        userName: user.userName,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_DAY,
      }
    );
    user.password = undefined;
    res.status(statusCode).json({
      status: 'success',
      data: {
        token: token,
        wholeToken: `Bearer ${token}`,
        userName: user.userName,
      },
    });
  },
};
