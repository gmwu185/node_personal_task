const express = require('express');
const router = express.Router();
const { isAuth } = require('../middlewares/auth');
const PayController = require('../controllers/pay');

router.get('/pay', isAuth, (req, res, next) =>
  PayController.createPay(req, res, next)
);
router.post('/tradeConfirm', (req, res, next) =>
  PayController.tradeConfirm(req, res, next)
);
router.post('/tradeRedirect', PayController.tradeRedirect);

module.exports = router;
