var express = require('express');
var router = express.Router();
const PostsControllers = require('../controllers/posts');

router.get('/', PostsControllers.getPosts);
router.post('/', PostsControllers.createdPost);
router.delete('/', PostsControllers.delALLPosts);
router.delete('/:id', PostsControllers.delOnePost);
router.patch('/:id', PostsControllers.upDatePost);

module.exports = router;
