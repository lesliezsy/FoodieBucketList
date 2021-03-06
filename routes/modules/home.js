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
    const userId = req.user._id 
    
    Restaurant.find({ userId }) // 取出 Restaurant model 裡屬於某user的所有餐廳資料
        .lean() // 把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列
        .then(restaurants => {
            res.render('index', { // res.render() 指令，要求渲染一個叫 index 的頁面
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
        // 可使用餐廳的中文名、英文名、類別搜尋
        const restaurants = await Restaurant.find({
            $or: [
              { name: eval('/'+keyword+'/i') },
              { name_en: eval('/'+keyword+'/i') },
              { category: eval('/'+keyword+'/i') }
            ]
          }).lean()
        // const restaurants = await allRestaurants.filter(restaurant => restaurant.name.toLowerCase().includes(keyword.toLowerCase()) || restaurant.name_en.toLowerCase().includes(keyword.trim().toLowerCase()))
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

// 匯出路由模組
module.exports = router