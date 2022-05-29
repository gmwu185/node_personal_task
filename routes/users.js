var express = require('express');
var router = express.Router();

const UsersControllers = require('../controllers/users');

router.post('/', UsersControllers.createdUser);
router.post('/signUp', (req, res, next) =>
  UsersControllers.signUp(req, res, next)
);

module.exports = router;
