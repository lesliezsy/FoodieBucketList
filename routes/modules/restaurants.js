// restaurant 路由模組 
const express = require('express')
const router = express.Router()
const Restaurant = require('../../models/restaurant')

// 讓 view 引擎去拿 new 樣板
router.get('/new', (req, res) => {
    return res.render('new')
})

// View all restaurants：write in index.js   

// Read: View a restaurant's info
router.get('/:id', (req, res) => {
    const id = req.params.id
    return Restaurant.findById(id)
        .lean()
        .then((restaurant) => {
            console.log(restaurant);
            res.render('show', { restaurant })}) // 將查找出的資料傳給 detail 這個樣板
        .catch(error => console.log(error))
})

// Create: Add a new restaurant
// 設定接住 new頁面POST來的表單資料，並且把資料送往資料庫（跟restaurants頁面？！）
router.post('/', (req, res) => {
    console.log(req.body.image);
    if (!!req.body.image === false) { req.body.image = 'https://picsum.photos/400/280'}
    const restaurant = req.body // 從 req.body 拿出表單裡的資料
    return Restaurant.create(restaurant) // 存入資料庫
        .then(() => res.redirect('/')) // 新增完成後導回首頁
        .catch(error => console.log(error))
})

// Update: Edit a restaurant's info
router.get('/:id/edit', (req, res) => {
    const id = req.params.id
    return Restaurant.findById(id) // 利用id查詢資料庫的資料
        .lean()
        .then((restaurant) => res.render('edit', { restaurant })) // 若找到資料，將它傳給 edit 樣板
        .catch(error => console.log(error))
})

router.put('/:id', (req, res) => {
    const id = req.params.id
    return Restaurant.findById(id)
        .then(restaurant => { 
            restaurant = Object.assign(restaurant, req.body)
            return restaurant.save()
        })
        .then(() => res.redirect(`/restaurants/${id}`))
        .catch(error => console.log(error))
})

// Delete: Remove a restaurant's info
router.delete('/:id', (req, res) => {
    const id = req.params.id // 透過 req.params.id 取得網址上特定一筆資料的識別碼，用來查詢使用者想刪除的 To-do
    return Restaurant.findById(id) // 查詢資料，資料庫查詢成功以後，會把資料放進 todo 
        .then(restaurant => restaurant.remove()) // 用 restaurant.remove() 刪除這筆資料
        .then(() => res.redirect('/')) // 使用 redirect 重新呼叫首頁，此時會重新發送請求給 GET /，進入到另一條路由。
        .catch(error => console.log(error))
})

module.exports = router