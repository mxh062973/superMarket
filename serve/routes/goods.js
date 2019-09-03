/*
	商品模块路由
*/ 
var express = require('express');
var router = express.Router();
/* 统一设置响应头解决跨域 */ 
router.all('*', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'authorization') // 允许携带的头
	
	next() // 放行
})


/*--- 验证token --- 开始 */ 
const expressJwt = require('express-jwt');
const secret = 'itsource';
router.use(expressJwt ({
    secret 
}).unless({
    path: ['/login/checklogin']  //除了这些地址，其他的URL都需要验证
}));
router.use(function (err, req, res, next) {
    //当token验证失败时会抛出如下错误
    if (err.name === 'UnauthorizedError') {   
        //这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
        res.status(401).send('invalid token...');
    }
})
/*--- 验证token -- 结束 ---*/ 

// 引入数据库连接模块
const connection = require('./js/conn')

/* 商品添加 */ 
router.post('/goodsadd', (req, res) => {
	// 接收参数
	let {category, barCode, goodsName, costPrice, salePrice, marketPrice, stockCount, goodsWeight, goodsUnit, vipDiscount, promotion, goodsDesc} = req.body;

	// 构造sql
	const sqlStr = `insert into goods(category, barCode, goodsName, costPrice, salePrice, marketPrice, stockCount, goodsWeight, goodsUnit, vipDiscount, promotion, goodsDesc) values(?,?,?,?,?,?,?,?,?,?,?,?)` 
	// 参数
	const sqlParams = [category, barCode, goodsName, costPrice, salePrice, marketPrice, stockCount, goodsWeight, goodsUnit, vipDiscount, promotion, goodsDesc]

	// 执行sql
	connection.query(sqlStr, sqlParams, (err, data) => {
		if (err) throw err;
		// 判断
		if (data.affectedRows > 0) {
			res.send({code: 0, reason: '添加商品成功'}) // 响应成功的数据给前端
		} else {
			res.send({code: 1, reason: '添加商品失败'}) // 响应失败的数据给前端
		}
	})
})

/* 商品列表 */ 
router.get('/goodslistbypage', (req, res) => {

	// 接收参数
	let {pageSize, currentPage, category, keyWord } = req.query;

	// 构造sql
	let sqlStr = `select * from goods where 1=1`

	// 定义变量 保存数总条数
	let total;

	// 如果分类不等于空 且 不等于全部
	if (category !== '' && category !== '全部分类') {
		// 拼接第一个查询条件
		sqlStr += ` and category='${category}'`;
	}

	// 如果第二个关键字不为空 那么就拼接sql
	if (keyWord !== '') {
		sqlStr += ` and (goodsName like '%${keyWord}%' or barCode like '%${keyWord}%')`
	}

	// 拼接排序
	sqlStr += ` order by ctime desc`

	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		total = data.length;   // 总数据条数(查询过后的总条数)
	})

	// 拼接分页sql
	let n = (currentPage - 1) * pageSize;
	sqlStr += ` limit ${n}, ${pageSize}`;

	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		res.send({ total, data })
	})
})

/* 商品高级查询 */ 

/*
	router.get('/search', (req, res) => {
		// 接收查询参数
		let {category, keyWord} = req.query;

		// 构造sql
		let sqlStr = `select * from goods where 1=1`;

		// 如果分类不等于空 且 不等于全部
		if (category !== '' && category !== '全部分类') {
			// 拼接第一个查询条件
			sqlStr += ` and category='${category}'`;
		}

		// 如果第二个关键字不为空 那么就拼接sql
		if (keyWord !== '') {
			sqlStr += ` and (goodsName like '%${keyWord}%' or barCode like '%${keyWord}%')`
		}

		// 执行sql
		connection.query(sqlStr, (err, data) => {
			if (err) throw err;
			res.send({ data }) // 把查询结果响应给前端浏览器
		})
	})
*/ 


router.get('/selldata', (req, res) => {
	res.send({
		category: ['19-06-30', '19-07-1', '19-07-2', '19-07-03', '19-07-04', '19-07-05', '19-07-06'],
		value:  [1000, 1500, 8001, 2434, 2000, 1330, 3300]
	})
})


module.exports = router;