const express = require('express');
const router = express.Router();
const { isAuth } = require('../middlewares/auth');
const PayController = require('../controllers/pay');

router.get('/pay', isAuth, (req, res, next) =>
  PayController.createPay(req, res, next)
);
router.post('/pay/tradeConfirm', (req, res, next) =>
  PayController.tradeConfirm(req, res, next)
);
router.post('/pay/tradeRedirect', PayController.tradeRedirect);
router.get('/pay/tradeResult/:id', isAuth, (req, res, next) =>
  PayController.getTradeResult(req, res, next)
);

module.exports = router;
