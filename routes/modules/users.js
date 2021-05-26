const express = require('express')
const router = express.Router()
const User = require('../../models/user') // 引入User 
const passport = require('passport')
const bcrypt = require('bcryptjs')

router.get('/login', (req, res) => {
  res.render('login')
})

// login時，用 Passport 提供的 authenticate 方法執行認證
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  // 檢查表單資料
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: 'Please complete all required fields.' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: 'Password and confirm password do not match.' })
  }
  if (errors.length) {
    return res.render('register', {
      errors,
      name,
      email,
      password,
      confirmPassword
    })
  }
  // 檢查使用者是否已經註冊
  User.findOne({ email }).then(user => {
    // 如果已經註冊：退回原本畫面
    if (user) {
      errors.push({ message: 'This user already exists.' })
      return res.render('register', {
        errors,
        name,
        email,
        password,
        confirmPassword
      })
    } 
      // 如果還沒註冊：寫入資料庫
      return bcrypt
      .genSalt(10)
      .then(salt => bcrypt.hash(password, salt))
      .then(hash => User.create({
        name,
        email,
        password: hash // 用雜湊值取代原本的使用者密碼
      }))
      .then(() => res.redirect('/'))
      .catch(err => console.log(err))
    
  })
})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You have been successfully logged out.')
  res.redirect('/users/login')
})

module.exports = router