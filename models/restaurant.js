const mongoose = require('mongoose')
const Schema = mongoose.Schema
// 把想要的資料結構當成參數傳給 new Schema()
const restaurantSchema = new Schema({
  name: {
    type: String, // 資料型別是字串
    required: true // 這是個必填欄位
  }
})

// 匯出時把這份 schema 命名為 Restaurant，以後在其他的檔案直接使用 Restaurant 就可以操作有關的資料了
module.exports = mongoose.model('Restaurant', restaurantSchema)