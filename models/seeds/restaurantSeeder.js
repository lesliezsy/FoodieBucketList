const bcrypt = require('bcryptjs')
if (process.env.NODE_ENV !== 'production') require('dotenv').config()
const Restaurant = require('../restaurant')
const User = require('../user')
const db = require('../../config/mongoose')
const { results: restaurantList } = require('./restaurant.json');

const SEED_USERS = [
  {
    name: 'Leslie',
    email: 'user1@example.com',
    password: '12345678'
  },
  {
    name: 'Json',
    email: 'user2@example.com',
    password: '12345678'
  }
]

db.once('open', async () => {
  // 使用者新增兩次，新增使用者時，邊新增三筆餐廳資料
  try {
    for (const [index, user] of SEED_USERS.entries()) {
      const { name, email, password } = user
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      const { _id: userId } = await User.create({
        name,
        email,
        password: hash
      })
   
      for (let i = 0; i < 3; i++) {
        // 新增三家餐廳：第一次加 0, 1, 2 ; 第二次 3, 4, 5
        const { id, ...restaurant } = restaurantList[i + (index * 3)]
        await Restaurant.create({ ...restaurant, userId })
      }
    }
    console.log('done.')
    process.exit()
    
  } catch (err) {
    console.log(err)
    process.exit()
  }
})