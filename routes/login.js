const express = require("express");
const http = require('https')
const router = express.Router();
const pool = require("../pool");

// function conversion(t) {
//   if (t < 10) {
//     return '0' + t
//   }
//   return t;
// }

// function transformTime(db_time) {
//   let time = new Date(db_time);
//   let Y = time.getFullYear();
//   let M = conversion(time.getMonth() + 1);
//   let D = conversion(time.getDate());
//   let H = conversion(time.getHours());
//   let Mi = conversion(time.getMinutes());
//   let S = conversion(time.getSeconds());
//   return Y + '-' + M + '-' + D + ' ' + H + ':' + Mi + ':' + S
// }

//判断用户
router.get("/login", (req, res) => {
  var code = req.query.code
  var appid = 'wxead39e0dad6a9021'
  var secret = 'd7e2056610dfd06d14a6b4c467e997cc'
  var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appid + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code'
  var openid
  http.get(url, (eq, es) => {
    eq.on('data', (data) => {
      openid = JSON.parse(data)
      pool.query('SELECT openid,utime FROM ts_user WHERE openid = ? LIMIT 1', openid.openid, (err, result) => {
        if (err) throw err
        if (result.length > 0) {
          res.send({ code: 1, msg: '有', openid: openid.openid, data: result })
        } else {
          // let date =  new Date()
          // var data = {
          //   openid: openid.openid,
          //   utime: date
          //  }
          let date = new Date().getTime()
          // let itme = transformTime(date)
          var data = {
            openid: openid.openid,
            utime: date
          }
          pool.query('INSERT INTO ts_user SET ?', data, (err, result) => {
            if (err) throw err
            //  if(result.affectedRows == 0){
            res.send({ code: 1, msg: '没有', openid: openid.openid })
            //  }
          })
        }
      })
    })
  })
})

//更新用户数据
router.get('/user_save', (req, res) => {
  var data = req.query
  var openid = data.openid
  var uname = data.nickName
  var uimg = data.avatarUrl
  pool.query("UPDATE ts_user SET uname = ?, uimg = ? WHERE openid = ?", [uname, uimg, openid], (err, result) => {
    if (err) throw err
    res.send({ code: 1 })
  })
})

/**
 * 推荐数据
 */
router.get('/recommend', (req, res) => {
  var output = {};
  var sql = `SELECT * FROM nursery_rhyme ORDER BY RAND() LIMIT 10;
             SELECT * FROM story ORDER BY RAND() LIMIT 8;
             SELECT * FROM poem ORDER BY RAND() LIMIT 5;`
  pool.query(sql, (err, result) => {
    if (err) throw err
    output.nursery_rhyme = result[0]
    output.story = result[1]
    output.poem = result[2]
    res.send(output)
  })
})

/**
 * 分类音频数据
 */
router.get('/list', (req, res) => {
  var num = req.query.num
  var output = {
    pno: 1,
    pageSize: 10,
    count: 0,
    pageCount: 0,
    products: []
  }
  if (req.query.pno !== undefined)
    output.pno = parseInt(req.query.pno)
  if (num == 0) {
    var sql = 'SELECT * FROM nursery_rhyme WHERE genre = 0 ORDER BY nid DESC'
  } else if (num == 1) {
    var sql = 'SELECT * FROM story ORDER BY nid DESC'
  } else if (num == 2) {
    var sql = 'SELECT * FROM poem ORDER BY nid DESC'
  } else if (num == 3) {
    var sql = 'SELECT * FROM nursery_rhyme WHERE genre = 1 ORDER BY nid DESC'
  } else {
    res.send({ code: 201 })
    return
  }
  pool.query(sql, (err, result) => {
    if (err) throw err
    var count = result.length;
    var pageCount = Math.ceil(count / output.pageSize);
    output.count = count;
    output.pageCount = pageCount;
    var starti = output.pno * output.pageSize;
    output.products = result.slice(starti, starti + output.pageSize);
    res.send(output)
  })
})



/* 导出 */
module.exports = router;