const corsWhiteList = process.env.URL_ORIGIN.split(' ');

module.exports = () => (req, res, next) => {
  if (corsWhiteList.indexOf(req.headers.origin) !== -1) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'HEAD, OPTIONS, GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  next();
};