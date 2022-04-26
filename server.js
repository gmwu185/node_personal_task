// const routese = require('./routes')
require('./connections'); // or require('./connections/index');

const requestListener = async (req, res) => {
  require('./routes')(req, res);
  // routese(req, res);
};

module.exports = requestListener;
