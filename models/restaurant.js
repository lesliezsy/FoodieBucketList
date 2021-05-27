const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 把想要的資料結構當成參數傳給 new Schema()
const restaurantSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  name_en: {
    type: String
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  phone: {
    type: String,
    required: true
  },
  google_map: {
    type: String
  },
  rating: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  userId: {  // 加入關聯設定: 去參照 User 的 ObjectId
    type: Schema.Types.ObjectId, // define此項目為ObjectId，會連向一個資料物件
    ref: 'User', // 要連結的參考對象是User
    index: true, // 把 userId 設定成「索引」，方便用它來查資料
    required: true // 確保每個 restaurant 一定會對應到某個 user
  }
})

// 匯出時把這份 schema 命名為 Restaurant，以後在其他的檔案直接使用 Restaurant 就可以操作有關的資料了
module.exports = mongoose.model('Restaurant', restaurantSchema)