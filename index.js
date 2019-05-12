/** 引入第三方模块 **/
const PORT = 5050
const fs = require('fs')
const https = require('https')
const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const session=require('express-session')
/** 引入路由模块 **/ 
const index = require("./routes/index")
const classify = require("./routes/classify")
const login = require('./routes/login')
const addContent = require('./routes/addContent')

// var options = {
//   key: fs.readFileSync('./ssl/1964386_tsapi.xyz.key'),
//   ca: fs.readFileSync('./ssl/1964386_tsapi.xyz_chain.crt'),
//   cert: fs.readFileSync('./ssl/1964386_tsapi.xyz_public.crt')
// }

var server = express();

server.listen(PORT, () => {
  // console.log("监听在 " + PORT)
})

// server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
  extended:false
}));
  //托管静态文件到public目录
server.use(express.static(__dirname+"/public"));

/** 解决跨域问题 **/
server.use(cors({
	'credentials': true
  // 'origin': "http://127.0.0.1:3088"
}))

// 使用 session 中间件
// server.use(session({
//     secret :  'secret', // 对session id 相关的cookie 进行签名
//     resave : true,
//     saveUninitialized: false, // 是否保存未初始化的会话
//     cookie : {
//         maxAge : 1000 * 60 * 3, // 设置 session 的有效时间，单位毫秒
//     },
// }));

/** 使用路由器来管理路由 **/
server.use(index)
server.use(classify)
server.use(login)
server.use(addContent)