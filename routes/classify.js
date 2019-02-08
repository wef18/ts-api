const express=require("express");
const router=express.Router();
const pool=require("../pool");

router.get("/classify",(req,res)=>{
	var output = {}
	var sql = `SELECT lid,name FROM ts_poet`
	pool.query(sql,(err,result)=>{
		if(err) throw err
		output.myName = result;
		res.send(output)
	})
})

router.get("/classify/demand",(req,res)=>{
	var id = req.query.id;
	var output = {};
	if(id != undefined){
		var sql = `SELECT did,title,(SELECT img_url FROM ts_poet WHERE id_family = lid) AS pic,(SELECT poet_brief FROM ts_poet WHERE id_family = lid) AS brief FROM ts_data WHERE id_family = ?`
		pool.query(sql,id,(err,result)=>{
			if(err) throw err
			output.myPoem = result;
			res.send(output)
		})
	}else{
		var sql =`SELECT did,title,(SELECT img_url FROM ts_poet WHERE id_family = lid) AS pic,(SELECT poet_brief FROM ts_poet WHERE id_family = lid) AS brief FROM ts_data`
		pool.query(sql,(err,result)=>{
			if(err) throw err
			output.myPoem = result;
			res.send(output)
		})
	}
})


/* 导出 */
module.exports=router;