// home 路由模組 
const express = require('express')
const router = express.Router()
// 引用 Restaurant model
const Restaurant = require('../../models/restaurant')

// 設定首頁路由
router.get('/', (req, res) => {
    // 使用 res.render() 指令，要求渲染一個叫 index 的頁面。
    // res.render('index')

    Restaurant.find() // 取出 Restaurant model 裡的所有資料
        .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
        .then(restaurants => res.render('index', {
            restaurants
        })) // 將資料傳給 index 樣板
        .catch(error => console.error(error)) // 錯誤處理
})

// 匯出路由模組
module.exports = router