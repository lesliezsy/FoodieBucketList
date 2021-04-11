// restaurant 路由模組 
const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// 讓 view 引擎去拿 new 樣板
router.get('/new', (req, res) => {
    return res.render('new')
})

// 瀏覽全部所有餐廳：寫在index.js   

// 瀏覽一家餐廳詳細資訊
router.get('/:id', (req, res) => {
    const id = req.params.id
    return Restaurant.findById(id)
        .lean()
        .then((restaurant) => {
            console.log(restaurant);
            res.render('show', { restaurant })}) // 將查找出的資料傳給 detail 這個樣板
        .catch(error => console.log(error))
})

// Create- 新增一筆餐廳資訊
// 設定接住 new頁面POST來的表單資料，並且把資料送往資料庫（跟restaurants頁面？！）
router.post('/', (req, res) => {
    const restaurant = req.body
        // 從 req.body 拿出表單裡的資料

    return Restaurant.create(restaurant) // 存入資料庫
        .then(() => res.redirect('/')) // 新增完成後導回首頁
        .catch(error => console.log(error))
})


// 修改 todo 頁面
router.get('/:id/edit', (req, res) => {
    const id = req.params.id
    return Restaurant.findById(id) // 利用id查詢資料庫的資料
        .lean()
        .then((restaurant) => res.render('edit', { restaurant })) // 若找到資料，將它傳給 edit 樣板
        .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
    const id = req.params.id
    const { name, isDone } = req.body // name 要用 req.body.name 從表單拿出來
    return Restaurant.findById(id)
        .then(restaurant => { 
            restaurant.name = name
            restaurant.isDone = isDone === 'on' // 因為 isDone === 'on' 這是判斷句，一定是回傳 boolean 值
            // 若 checkbox 有被打勾，它的回傳值會被設定為 on，若沒被「打勾」，則它不會帶任何值。
            // 運算子優先序: JavaScript 裡邏輯運算子會比普通的 = 優先執行
            return restaurant.save()
        })
        .then(() => res.redirect(`/todos/${id}`))
        .catch(error => console.log(error))
})

// 刪除
router.delete('/:id', (req, res) => {
    const id = req.params.id // 透過 req.params.id 取得網址上特定一筆資料的識別碼，用來查詢使用者想刪除的 To-do
    return Restaurant.findById(id) // 查詢資料，資料庫查詢成功以後，會把資料放進 todo 
        .then(restaurant => restaurant.remove()) // 用 restaurant.remove() 刪除這筆資料
        .then(() => res.redirect('/')) // 使用 redirect 重新呼叫首頁，此時會重新發送請求給 GET /，進入到另一條路由。
        .catch(error => console.log(error))
})

module.exports = router