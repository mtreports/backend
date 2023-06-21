const { createProxyMiddleware } = require('http-proxy-middleware');
 
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://3.6.228.94:5055/',
      changeOrigin: true,
    })
  );
};