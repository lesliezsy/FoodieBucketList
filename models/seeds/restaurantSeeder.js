const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
} 

const Restaurant = require('../restaurant')
const User = require('../user')
const db = require('../../config/mongoose')

// 載入預設餐廳資料
// const restList = require('./restaurant.json');
const SEED_USER = {
  name: 'Leslie',
  email: 'leslie@gmail.com',
  password: 'leslie123'
}

db.once('open', () => {
  bcrypt
    .genSalt(10)
    .then(salt => bcrypt.hash(SEED_USER.password, salt))
    .then(hash => User.create({
      name: SEED_USER.name,
      email: SEED_USER.email,
      password: hash
    }))
    .then(user => {
      const userId = user._id
      return Promise.all(Array.from(
        { length: 8 },
        (_, i) => Restaurant.create(
          { name: `Restaurant0${i}`,
            name_en: `Fine Dining Restaurant0${i}`,
            category:"Japanese",
            phone: `01234567${i}`,
            rating: 5,
            description: "Excellent! Must try!!! ",
            userId
          })
      ))
    })
    .then(() => {
      console.log('done.')
      process.exit() // 關閉這段 Node 執行程序，回到初始 command line，因為初始資料載入後，就不會再用到了
    })
    
    // for (i = 0; i < restList.results.length; i++) {
    //     Restaurant.create(restList.results[i]);
    //   }

  })