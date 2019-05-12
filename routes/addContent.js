const express=require("express");
const router=express.Router();
const pool=require("../pool");


/**
 * 添加内容
 */
router.post('/addcontent', (req, res) => {
  let data = req.body
  let obj = {
    openid: data.openid,
    content: data.content,
    ctime: new Date().getTime(),
    is_phase: data.id
  }
  pool.query('INSERT INTO content SET ?', obj, (err, result) => {
    if(err) throw err
    res.send({code: 1})
  })
})

/**
 * 查询所有数据
 */
router.get('/content', (req, res) => {
  var index = req.query.index
  var output = {
    pno: 1,
    pageSize: 10,
    count: 0,
    pageCount: 0,
    products: []
  }
  if (req.query.pno !== undefined)
    output.pno = parseInt(req.query.pno)
  if(index == 1){
    var sql = 'SELECT a.id, a.openid, a.content, a.comment, a.praise, a.ctime, b.uname, b.uimg FROM content AS a, ts_user AS b WHERE a.openid = b.openid ORDER BY a.id DESC'
  } else if(index == 2) {
    var sql = 'SELECT a.id, a.openid, a.content, a.comment, a.praise, a.ctime, b.uname, b.uimg FROM content AS a, ts_user AS b WHERE a.openid = b.openid AND a.is_phase = 2 ORDER BY a.id DESC'
  } else if(index == 3) {
    var sql = 'SELECT a.id, a.openid, a.content, a.comment, a.praise, a.ctime, b.uname, b.uimg FROM content AS a, ts_user AS b WHERE a.openid = b.openid AND a.is_phase = 3 ORDER BY a.id DESC'
  } else if(index == 4) {
    var sql = 'SELECT a.id, a.openid, a.content, a.comment, a.praise, a.ctime, b.uname, b.uimg FROM content AS a, ts_user AS b WHERE a.openid = b.openid AND a.is_phase = 4 ORDER BY a.id DESC'
  } else if(index == 5) {
    var sql = 'SELECT a.id, a.openid, a.content, a.comment, a.praise, a.ctime, b.uname, b.uimg FROM content AS a, ts_user AS b WHERE a.openid = b.openid AND a.is_phase = 5 ORDER BY a.id DESC'
  } else if(index == 6) {
    var sql = 'SELECT a.id, a.openid, a.content, a.comment, a.praise, a.ctime, b.uname, b.uimg FROM content AS a, ts_user AS b WHERE a.openid = b.openid AND a.is_phase = 6 ORDER BY a.id DESC'
  } else {
    res.send({code: 201})
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
module.exports=router;