// home 路由模組 
const express = require('express')
const router = express.Router()
// 引用 Restaurant model
const Restaurant = require('../../models/restaurant')

// 讓 view 引擎去拿 new 樣板
router.get('/new', (req, res) => {
    return res.render('new')
})


// 設定首頁路由
router.get('/', (req, res) => {
    // 使用 res.render() 指令，要求渲染一個叫 index 的頁面
    Restaurant.find() // 取出 Restaurant model 裡的所有資料
        .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
        .then(restaurants => {
            res.render('index', {
                restaurants
            })
        }) // 將資料傳給 index 樣板
        .catch(error => console.error(error)) // 錯誤處理
})

// Search 
router.get('/search', async (req, res) => {
    const keyword = req.query.keyword.trim();
    // 如果沒輸入關鍵字，就重導回首頁
    if (keyword === '') {
        return res.redirect('/');
    }

    try {
        // 如果要改用mongoDB find { name: keyword } 改寫，應如何改
        const allRestaurants = await Restaurant.find().lean()
        // 可使用餐廳的中文名或英文名搜尋
        const restaurants = await allRestaurants.filter(restaurant => restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.name_en.toLowerCase().includes(keyword.trim().toLowerCase()))

        // 如果找不到任何餐廳，就回傳無符合的查詢結果
        if (restaurants.length === 0) {
            const noResult = '無符合的查詢結果'
            return res.render('index', {
                noResult
            })
        }

        return res.render('index', {
            restaurants,
            keyword
        })

    } catch (err) {
        console.log(err);
    }
    
})

// Sort: A-Z
router.get('/nameAtoZ', (req, res) => {
    // 餐廳按照其英文名 A-Z 排列
    Restaurant.find() 
        .lean() 
        .sort({ name_en: 1 })
        .then(restaurants => {
            res.render('index', {
                restaurants
            })
        }) 
        .catch(error => console.error(error)) 
})

// Sort: Z-A
router.get('/nameZtoA', (req, res) => {
    Restaurant.find() 
        .lean() 
        .sort({ name_en: -1 })
        .then(restaurants => {
            res.render('index', {
                restaurants
            })
        })
        .catch(error => console.error(error)) // 錯誤處理
})

// Sort: Category
router.get('/category', (req, res) => {
    Restaurant.find() 
        .lean() 
        .sort({ category: 1 })
        .then(restaurants => {
            res.render('index', {
                restaurants
            })
        })
        .catch(error => console.error(error)) // 錯誤處理
})

// Sort: rating - highest to lowest
router.get('/ratingHighestToLowest', (req, res) => {
    Restaurant.find() 
        .lean() 
        .sort({ rating: -1 })
        .then(restaurants => {
            res.render('index', {
                restaurants
            })
        })
        .catch(error => console.error(error)) // 錯誤處理
})

// Sort: rating - lowest to highest 
router.get('/ratingLowestToHighest', (req, res) => {
    Restaurant.find() 
        .lean() 
        .sort({ rating: 1 })
        .then(restaurants => {
            res.render('index', {
                restaurants
            })
        })
        .catch(error => console.error(error)) // 錯誤處理
})

// 匯出路由模組
module.exports = router