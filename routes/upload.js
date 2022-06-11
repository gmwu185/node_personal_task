const express = require('express');

const UploadControllers = require('../controllers/upload');

const router = express.Router();

const { isAuth } = require('../handStates/auth');
const upload = require('../service/image');

router.post('/', isAuth, upload, (req, res, next) =>
  UploadControllers.upLoadAvatarImg(req, res, next)
);

module.exports = router;
