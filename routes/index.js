var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/posts', function(req, res, next) {
  console.log('GET /posts');
  res.end();
});
router.post('/posts', function(req, res, next) {
  console.log('POST /posts');
  res.end();
});

module.exports = router;
