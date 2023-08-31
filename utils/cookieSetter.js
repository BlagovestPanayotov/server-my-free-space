function cookieSetter(res, token, logout) {
  res.cookie('atoken', token, {
    httpOnly: true,
    maxAge: logout ? 0 : 3600000 * 24 * 7, // 7 days
    // secure: true,    // If using HTTPS
    sameSite: 'strict'
  });
}

module.exports = {
  cookieSetter
};