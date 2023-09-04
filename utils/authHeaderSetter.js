function authHeaderSetter(res, token, logout) {
  res.cookie('Authorization', token, {
    httpOnly: true,
    maxAge: logout ? 0 : 3600000 * 24 * 7, // 7 days
    // secure: true,    // If using HTTPS
    sameSite: 'strict'
  });
}

module.exports = {
  authHeaderSetter
};