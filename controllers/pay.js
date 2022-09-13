const { Merchant, CreditOneTimePayment } = require('node-ecpay-aio');
const dayjs = require('dayjs');

const handleErrorAsync = require('../handStates/handleErrorAsync');

module.exports = {
  createPay: handleErrorAsync(async (req, res, next) => {
    const merchant = new Merchant('Test', {
      // 必填
      MerchantID: process.env.ECPAY_MERCHANTID,
      HashKey: process.env.ECPAY_HASHKEY,
      HashIV: process.env.ECPAY_HASHIV,
      ReturnURL: process.env.ECPAY_RETURNURL,
      // 選填
      OrderResultURL: process.env.ECPAY_ORDERRESULTURL,
      ClientBackURL: process.env.ECPAY_CLIENTBACKURL, // 訂單付款時有錯返回網址
    });

    const payment = await merchant.createPayment(
      CreditOneTimePayment,
      {
        MerchantTradeNo: `NEANo${Date.now()}`, // 訂單編號，上綠界時如果重覆送出一樣會較有新單號 (會進 db)
        MerchantTradeDate: dayjs('2022-06-01T02:16:11.955+00:00').format(
          'YYYY/MM/DD HH:mm:ss'
        ), // 進 db 訂單成立時間
        TotalAmount: 500, // 字串不行，只能使用純數值
        TradeDesc: '交易描述',
        ItemName: '商品名稱',
        OrderResultURL: process.env.ECPAY_ORDERRESULTURL,
        ClientBackURL: process.env.ECPAY_CLIENTBACKURL, // 訂單付款時有錯返回網或是完成結帳導向網址
      },
      {
        // 皆為選填
        BindingCard: 1, // 記憶信用卡: 1 (記) | 0 (不記)
        MerchantMemberID: '2000132u001', // 記憶卡片需加註識別碼: MerchantId+廠商會員編號
        Language: 'undefined', // 語系: undefined(繁中) | 'ENG' | 'KOR' | 'JPN' | 'CHI'
        Redeem: 'Y', // 紅利折抵: undefined(不用) | 'Y' (使用)
        UnionPay: 2, // [需申請] 銀聯卡: 0 (可用, default) | 1 (導至銀聯網) | 2 (不可用)
      }
    );

    const htmlRedirectPostForm = await payment.checkout();
    res.status(200).json({ resHTML: htmlRedirectPostForm });
    res.end();
  }),
  tradeConfirm: handleErrorAsync(async (req, res, next) => {
    console.log('tradeConfirm req.body', req.body);
    // const { MerchantTradeNo, RtnMsg, RtnCode, TradeNo, TradeDate } = req.body;
    // const confirmOrderData = { MerchantTradeNo, RtnMsg, RtnCode, TradeNo, TradeDate };
    // console.log('confirmOrderData', confirmOrderData);
    res.status(200).send('OK');
  }),
  tradeRedirect: handleErrorAsync(async (req, res, next) => {
    res.redirect(process.env.FRONTEND_MEMBER_URL);
  }),
};
