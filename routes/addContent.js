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


/* 导出 */
module.exports=router;