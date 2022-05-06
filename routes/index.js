var express = require('express');
var router = express.Router();
const PostsControllers = require('../controllers/posts');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/posts', PostsControllers.getPosts);
router.post('/posts', PostsControllers.createdPost);
router.delete('/posts', PostsControllers.delALL);
router.delete('/posts/:id', PostsControllers.delOne);
router.patch('/posts/:id', PostsControllers.upDatePost);
router.options('/', (req, res, next) => res.status(200).end());

module.exports = router;
