const express = require('express')
const session = require('express-session')
const exphbs = require('express-handlebars')
const {
  urlencoded
} = require("body-parser")
const methodOverride = require('method-override')
const flash = require('connect-flash')
const routes = require('./routes')
const usePassport = require('./config/passport')

require('./config/mongoose')

const app = express()

app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}))
app.set('view engine', 'hbs')

app.use(session({
  secret: 'ThisIsMyTopSecret', // session 用來驗證 session id 的字串，這組字串由伺服器設定，不會洩露給客戶端
  resave: false, // 決定是否每一次與使用者互動後，強制把 session 更新到 session store 裡
  saveUninitialized: true // 強制將未初始化的 session 存回 session store。未初始化表示這個 session 是新的且沒被修改過，例如未登入的使用者的 session
}))

app.use(urlencoded({
  extended: true
}))

app.use(methodOverride('_method'))
app.use(express.static('public'))

usePassport(app)
app.use(flash())

app.use((req, res, next) => {
  // 這裡的req是從 passport (auth.js)來的
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg') 
  next()
})

app.use(routes)


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`)
})