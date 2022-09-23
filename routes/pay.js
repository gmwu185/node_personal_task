const express = require('express');
const router = express.Router();
const { isAuth } = require('../middlewares/auth');
const PayController = require('../controllers/pay');

router.get(
  '/pay/ecpay',
  isAuth,
  (req, res, next) => PayController.ecpay_createPay(req, res, next)
  /** #swagger.summary = '綠界-產生訂單並要求付款',
    * #swagger.tags = ['第三方支付'],
    * #swagger.description = `<p>在資料庫先新增 pay 的紀錄，再向綠界產生訂單，並取得 form data 導向付款頁面</p>
      參數用法：
      <ul>
        <li>取得 Token 至上方 Authorize 按鈕以格式 <code>Bearer ＜Token＞</code> 加入設定，swagger 文件中鎖頭上鎖表示登入，可使用登入權限。</li>
      </ul>
      流程用法：
      <ul>
        <li>取得 form data 後，用 html 觸發 form submit</li>
        <li>測試卡號：<code>4311-9522-2222-2222</code>；安全碼：<code>222</code>；有效年月:大於當下的年月(e.g.07/28)</li>
      </ul>
    `,
    * #swagger.security = [{
      'apiKeyAuth': []
    }],
    * #swagger.responses[200] = {
      description: `取得 form data`,
      schema:"1"
    }
  */
);
router.post(
  '/pay/ecpay_tradeConfirm',
  (req, res, next) => PayController.ecpay_tradeConfirm(req, res, next)
  /** #swagger.summary = '綠界-接收回傳的 url',
    * #swag1.ger.tags = ['第三方支付'],
    * #swagger.description = `
      <ul>
        <li>接收綠界回傳的 url</li>
        <li>取得交易結果，且更新document Users 和 Pays</li>
      </ul>
    `,
  */
);
router.post(
  '/pay/ecpay_tradeRedirect',
  PayController.ecpay_tradeRedirect
  /** #swagger.summary = '綠界-接收回傳的 url 轉址前端',
    * #swagger.tags = ['第三方支付'],
    * #swagger.description = `
      <p>提供綠界回傳的 url, 導回前端頁面</p>
    `,
  */
);
router.get(
  '/pay/ecpay_tradeResult/:id',
  isAuth,
  (req, res, next) => PayController.get_ecpay_tradeResult(req, res, next)
  /** #swagger.summary = '綠界-取得付款結果',
    * #swagger.tags = ['第三方支付'],
    #swagger.description = `
      <p>取得付款結果</p>
    `,
    * #swagger.security = [{
        'apiKeyAuth': []
      }],
    * #swagger.parameters['id'] = {
        in: 'path',
        description:'pay id',
        type: 'string',
        required: true,
      },
    #swagger.responses[200] = {
      description: `取得單筆付款結果`,
      schema: {
        "status": "success",
        "data": {
          "_id": "629719ace801357b6d843506",
          "tradeNo": "MWW6zvo77p3m0",
          "tradeType": "creditonetime",
          "totalAmount": 1000,
          "tradeDesc": "會員費用",
          "itemName": "會員費用",
          "tradeStatus": 0,
          "user": {
            "_id": "628a53f86e242867112a2321",
            "userName": "大明123"
          },
          "ecPayRtnMsg": "交易成功"
        }
      }
    }
  */
);

module.exports = router;
