const { createProxyMiddleware } = require('http-proxy-middleware');

const pathRewrite = {}
pathRewrite[`^${process.env.REACT_APP_PORTAL_API_PREFIX}`] = '';

module.exports = function(app) {
  app.use(
    process.env.REACT_APP_PORTAL_API_PREFIX,
    createProxyMiddleware({
      target: 'https://portalapi2.uwaterloo.ca/v2',
      "pathRewrite": pathRewrite,
      changeOrigin: true,
    })
  );
};