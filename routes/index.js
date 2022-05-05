var express = require('express');
var router = express.Router();
// const postsControllors = require('../controllers/posts');
const PostsControllors = require('../controllers/posts');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/posts', PostsControllors.getPosts);
router.post('/posts', PostsControllors.createdPost);

module.exports = router;
