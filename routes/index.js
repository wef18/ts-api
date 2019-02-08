const express=require("express");
const router=express.Router();
const pool=require("../pool");

//首页数据
router.get("/index",(req,res)=>{
	var output = {};
	var sql = `SELECT id,pic FROM ts_carousel;
						 SELECT lid,names,img_url FROM ts_poet;`
	pool.query(sql,(err,result)=>{
		if(err) throw err;
		output.carousel = result[0];
		output.poetItems = result[1];
		res.send(output)
	})
})

//诗人数据/poet
router.get("/poet",(req,res)=>{
	var id = req.query.id;
	var sql = `SELECT did,title,(SELECT img_url FROM ts_poet WHERE id_family = lid) AS pic,(SELECT names FROM ts_poet WHERE id_family = lid) AS name FROM ts_data WHERE id_family = ? `
	pool.query(sql,id,(err,result)=>{
		if(err) throw err;
		res.send(result)
	})
})

router.get("/detail",(req,res)=>{
	var id = req.query.id;
	var sql = `SELECT *,(SELECT names FROM ts_poet WHERE id_family = lid) AS name,(SELECT poet_brief FROM ts_poet WHERE id_family = lid) AS brief,(SELECT poet_represent FROM ts_poet WHERE id_family = lid) AS represent FROM ts_data WHERE did = ?`
	pool.query(sql,id,(err,result)=>{
		if(err) throw err;
		res.send(result)
	})
})

//搜索功能
router.get("/search",(req,res)=>{
	var kword = req.query.kword;
	var id = req.query.id;
	if(id == 1){
		var sql3 = `SELECT did,title,(SELECT img_url FROM ts_poet WHERE id_family = lid) AS pic,(SELECT names FROM ts_poet WHERE id_family = lid) AS name FROM ts_data WHERE title LIKE ?`
		pool.query(sql3,[`%${kword}%`],(err,result)=>{
			if(err) throw err
			res.send(result)
		})
	}else{
		var sql = `SELECT name FROM ts_poet WHERE names LIKE ?`
		pool.query(sql,[`%${kword}%`],(err,result)=>{
			if(err) throw err;
			if(result.length > 0){
				var name = result[0].name
				var sql1 = `SELECT lid FROM ts_poet WHERE name = ?`
				pool.query(sql1,[name],(err,result)=>{
					if(err) throw err;
					var lid = result[0].lid;
					var sql2 = `SELECT did,title,(SELECT img_url FROM ts_poet WHERE id_family = lid) AS pic,(SELECT names FROM ts_poet WHERE id_family = lid) AS name FROM ts_data WHERE id_family = ?`
					pool.query(sql2,[lid],(err,result)=>{
						if(err) throw err;
						res.send(result)
					})
				})
			}
		})	
	}
})




/* 导出 */
module.exports=router;