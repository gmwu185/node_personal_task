require('./connections'); // or require('./connections/index');

const requestListener = async (req, res) => {
  require('./routes')(req, res);
};

module.exports = requestListener;
