 const { createProxyMiddleware } = require('http-proxy-middleware');
 
 module.exports = function(app) {
   app.use(
     '/api',
     createProxyMiddleware({
       target: 'https://mtreports.mandasadevelopment.com/',
       changeOrigin: true,
     })
   );
 };