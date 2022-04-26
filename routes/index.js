const postsControllors = require('../controllors/posts');
const HttpControllors = require('../controllors/http');

module.exports = async (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  });
  if (req.url === '/posts' && req.method === 'GET') {
    postsControllors.getPosts({ req, res });
  } else if (req.url === '/posts' && req.method === 'POST') {
    req.on('end', () => postsControllors.createdPost({ body, req, res }));
  } else if (req.method === 'OPTIONS') {
    HttpControllors.cors(req, res);
  } else {
    HttpControllors.notFound(req, res);
  }
};
