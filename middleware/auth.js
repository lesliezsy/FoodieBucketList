module.exports = {
  authenticator: (req, res, next) => {
    // 如果有登入就繼續下個動作，沒登入就導回 login
    if (req.isAuthenticated()) { // Passport.js 提供的函式，根據 request 的登入狀態回傳 true 或 false
      return next()
    }
    req.flash('warning_msg', 'Please log in first.') 
    res.redirect('/users/login')
  }
}