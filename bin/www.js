const http = require('http');
const requestListener = require('../server');

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);
