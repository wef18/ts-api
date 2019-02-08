/** 引入第三方模块 **/
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const session=require('express-session');
/** 引入路由模块 **/ 
const index = require("./routes/index");
const classify = require("./routes/classify");


var server = express();
server.listen(3088);
console.log("欢迎主人");
server.use(bodyParser.urlencoded({
  extended:false
}));
  //托管静态文件到public目录
server.use(express.static(__dirname+"/public"));

/** 解决跨域问题 **/
server.use(cors({
	'credentials': true,
  'origin': "http://127.0.0.1:3088"
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
server.use(index);
server.use(classify);