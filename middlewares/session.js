const tokenParser = require("../utils/tokenParser");

module.exports = () => (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      const payload = tokenParser(token);
      req.user = payload;
      req.token = token;
    } catch (err) {
      return res.status(401).json({ errors: ['Invalid authorization token!'] });
    }
  }

  next();
};