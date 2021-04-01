const express = require('express')
const app = express()
const port = 3000

const exphbs = require('express-handlebars');
const restaurantList = require('./restaurant.json')


app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.render('index', {
    restaurants: restaurantList.results
  })
})

app.get('/restaurants/:restaurant_id', (req, res) => {

  const restaurant = restaurantList.results.find(restaurant => restaurant.id.toString() === req.params.restaurant_id)
  res.render('show', {
    restaurant
  })

})

app.get('/search', (req, res) => {
  const keyword = req.query.keyword;

  // 當搜尋為空字串時候端會有錯誤(Cannot set headers after they are sent to the client)，其主要原因為已經response資料但程式還在執行相關操作。

  // 如果沒輸入關鍵字，就重導回首頁
  if (keyword === '') {
    return res.redirect('/');
  }

  const restaurants = restaurantList.results.filter(restaurant => {
    // 可以用餐廳的中文或英文名進行搜尋
    return restaurant.name.toLowerCase().includes(keyword.trim().toLowerCase()) || restaurant.name_en.toLowerCase().includes(keyword.trim().toLowerCase())

  })

  // 如果找不到任何餐廳，就回傳無符合的查詢結果
  if (restaurants.length === 0) {
    let noResult = '無符合的查詢結果'
    return res.render('index', {
      noResult
    })
  }

  res.render('index', {
    restaurants,
    keyword
  })

})

app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})