const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/~w56gao/api',
    createProxyMiddleware({
      target: 'https://portalapi2.uwaterloo.ca/v2',
      "pathRewrite": {
        "^/~w56gao/api" : ""
      },
      changeOrigin: true,
    })
  );
};