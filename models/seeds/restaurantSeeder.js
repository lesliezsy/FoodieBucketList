const Restaurant = require('../restaurant')
const db = require('../../config/mongoose')

// 載入預設餐廳資料
const restList = require('./restaurant.json');

db.once('open', () => {
    console.log("restList:", restList)
    
    for (i = 0; i < restList.results.length; i++) {
        Restaurant.create(restList.results[i]);
      }
    console.log('done')
  })