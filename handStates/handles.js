module.exports = {
  handleSuccess: (res, data) => {
    res.json({
      status: true,
      data,
    });
    res.end();
  },
  handlerError: (
    res,
    statusCode = 400,
    message = '產生錯誤',
    status = 'false'
  ) => {
    res.status(statusCode).json({
      status: status,
      message,
    });
    res.end();
  },
};
