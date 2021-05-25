// 總路由器
const express = require('express')
const router = express.Router()

// 引入 restaurants 模組程式碼
const home = require('./modules/home') // 引入 home 模組程式碼
const restaurants = require('./modules/restaurants')
const users = require('./modules/users')
const { authenticator } = require('../middleware/auth')
// 將網址結構符合 /restaurants 字串開頭的 request 導向 restaurants 模組 
// 直接在總路由器檢查網址前綴是否以 /restaurants 開頭，有的話才分流到 restaurants 模組裡，
// 因此在設定 restaurants 模組時，裡面的路由清單不再需要處理前綴詞 /restaurants
router.use('/restaurants', authenticator, restaurants)
router.use('/users', users)
// 將網址結構符合 / 字串的 request 導向 home 模組 
router.use('/', authenticator, home)

// 匯出路由器
module.exports = router
