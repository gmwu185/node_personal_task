const { Merchant, CreditOneTimePayment } = require('node-ecpay-aio');
const dayjs = require('dayjs');

const Pay = require('../model/pay');
const User = require('../model/users');
const mongoose = require('mongoose');

const handleErrorAsync = require('../handStates/handleErrorAsync');
const appError = require('../customErr/appError');
const randomId = require('../helps/randomId');

module.exports = {
  ecpay_createPay: handleErrorAsync(async (req, res, next) => {
    const newPay = await Pay.create({
      tradeNo: `MWW${await randomId(10)}`,
      user: req.userID,
    });
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
        MerchantTradeNo: newPay.tradeNo,
        MerchantTradeDate: dayjs(newPay.createdAt).format(
          'YYYY/MM/DD HH:mm:ss'
        ), // 進 db 訂單成立時間
        TotalAmount: newPay.totalAmount, // 字串不行，只能使用純數值
        TradeDesc: newPay.tradeDesc,
        ItemName: newPay.itemName,
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
    const { MerchantTradeNo, RtnCode, RtnMsg, TradeDate, TradeNo } = req.body;
    // console.log('req.body', req.body);
    const updatePay = await Pay.findOneAndUpdate(
      {
        tradeNo: MerchantTradeNo,
      },
      {
        ecPayTradeNo: TradeNo,
        ecPayTradeDate: TradeDate,
        ecPayRtnMsg: RtnMsg,
        tradeStatus: RtnCode === '1' ? 0 : 1,
      },
      {
        new: true,
      }
    );
    // console.log('tradeConfirm updatePay', updatePay);
    const findPayUser = await User.findByIdAndUpdate(updatePay.user.id, {
      premiumMember: {
        paid: 1, // 1 成為付費會員 / 0 未付費
        pay: updatePay.id,
        startAt: updatePay.createdAt,
      },
    });
    // console.log('tradeConfirm findPayUser', findPayUser);
    res.status(200).send('OK'); // 需回應 OK 綠界才會中斷連線
  }),
  tradeRedirect: handleErrorAsync(async (req, res, next) => {
    res.redirect(process.env.FRONTEND_MEMBER_URL);
  }),
  getTradeResult: handleErrorAsync(async (req, res, next) => {
    const user = req.userID;
    const payId = req.params.id;
    if (!mongoose.isObjectIdOrHexString(payId)) {
      return next(appError(400, '無效id', next));
    }
    const payRecord = await Pay.findById(
      payId,
      'tradeNo tradeType totalAmount tradeDesc itemName tradeStatus ecPayRtnMsg user'
    );
    if (payRecord === null) {
      return next(appError(400, '查無資料', next));
    }
    const payUser = payRecord.user.id;
    if (payUser !== user) {
      return next(appError(400, '無權限查看', next));
    }
    res.status(200).json({
      status: 'success',
      data: payRecord,
    });
  }),
};
