var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  /** #swagger.tags = ['index (首頁)']
    ** #swagger.description = 'index GET API'
  */
  res.render('index', { title: 'Express' });
});
router.options('/', (req, res, next) => {
  /** #swagger.tags = ['index (首頁)']
    *? #swagger.description = 'index OPTIONS API'
  */
  res.status(200).end()
});

module.exports = router;
