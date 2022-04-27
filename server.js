const routes = require('./routes');
require('./connections'); // or require('./connections/index');

const requestListener = async (req, res) => {
  console.log(req.url, req.method); // 查看 client 使用路徑與 API 方法
  routes(req, res); // or 不提前行少處執行可直接使用引入模組 require('./routes')(req, res);
};

module.exports = requestListener;
