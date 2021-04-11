const mongoose = require('mongoose')
const Restaurant = require('../restaurant')
// 仔入預設餐廳資料
const restList = require('./restaurant.json');


mongoose.connect('mongodb://localhost/restaurant-list', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
    console.log('mongodb connected!')
    for (i = 0; i < restList.results.length; i++) {
        Restaurant.create(restList.results[i]);
      }
    console.log('done')
  })