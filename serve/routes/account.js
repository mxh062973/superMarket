/*
	账号管理模块路由
*/ 
var express = require('express');
var router = express.Router();

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

/* 统一设置响应头解决跨域 */ 
router.all('*', (req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Headers', 'authorization') // 允许携带的头
	
	next() // 放行
})

// 引入数据库连接模块
const connection = require('./js/conn')

router.get('/', (req, res) => {
  res.send('测试账号管理模块路由!')
})

/* 添加账号 */ 
router.post('/accountadd', (req, res) => {
	// 接收参数
	let {account, password, userGroup} = req.body;

	// 默认头像
	let avatarUrl = `/upload/avatar.jpg`;

	// 准备sql
	const sqlStr = `insert into accounts(account, password, userGroup, avatarUrl) values('${account}', '${password}', '${userGroup}', '${avatarUrl}')`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		console.log(data)
		// 判断
		if (data.affectedRows > 0) {
			res.send({code: 0, reason: '添加账号成功'}) // 响应成功的数据给前端
		} else {
			res.send({code: 1, reason: '添加账号失败'}) // 响应失败的数据给前端
		}
	})
})

/* 单条删除 */ 
router.get('/accountdel', (req, res) => {
	// 接收id
	let { id } = req.query;

	// 准备sql
	const sqlStr = `delete from accounts where id=${id}`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		// 判断
		if (data.affectedRows > 0) {
			res.send({code: 0, reason: '删除成功'})
		} else {
			res.send({code: 1, reason: '删除失败'})
		}
	})
})

/* 编辑数据回填 */ 
router.get('/accountedit', (req, res) => {
	// 接收id
	let { id } = req.query;

	// 准备sql
	const sqlStr = `select * from accounts where id=${id}`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		res.send({ data }) // 响应数据给前端
	}) 
})

/* 保存修改请求 */ 
router.post('/saveedit', (req, res) => {
	// 接收新数据 和 老id
	let {account, userGroup, id} = req.body;

	// 准备sql
	const sqlStr = `update accounts set account='${account}', userGroup='${userGroup}' where id=${id}`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		// 判断
		if (data.affectedRows > 0) {
			res.send({code: 0, reason: '修改成功'})
		} else {
			res.send({code: 1, reason: '修改失败'})
		}
	})
})

/* 批量删除 */ 
router.get('/batchdelete', (req, res) => {
	// 接收id们
	let { idArr } = req.query; 
	
	// 准备sql
	const sqlStr = `delete from accounts where id in (${idArr})`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({code: 0, reason: '批量删除成功'}) // 响应成功数据
		} else {
			res.send({code: 1, reason: '批量删除失败'}) // 响应失败数据
		}
	})
})

/* 按照分页请求数据 */ 
router.get('/accountlistbypage', (req, res) => {

	console.log('当前登录用户信息', req.user)

	// 接收参数
	let {pageSize, currentPage} = req.query;

	// 定义变量 保存数据总条数据
	let total;

	// 准备sql
	let sqlStr = `select * from accounts order by ctime desc`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		total = data.length; // 获取数据总条数
	})

	// 构造sql 按照分页查询数据
	let n = (currentPage - 1) * pageSize; // 跳过多少条
	sqlStr += ` limit ${n}, ${pageSize}`; // 分页的sql

	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		res.send({total, data})  // 把中数据条数 和 当前页码对应的数据响应给前端
	})
})

/* 验证旧密码是否正确 */ 
router.post('/checkoldpass', (req, res) => {
	// 接收旧密码
	let { oldPwd } = req.body;

	// 验证是否正确
	if (oldPwd === req.user.password) {
		res.send({code: 0, reason: '原密码正确'})
	} else {
		res.send({code: 1, reason: '旧密码错误'})
	}
})

/* 修改密码 */ 
router.post('/passwordmodify', (req, res) => {
	// 接收新密码
	let {newPassword} = req.body;
	// 取出id
	let id = req.user.id;

	// 构造sql
	const sqlStr = `update accounts set password='${newPassword}' where id=${id}`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({code: 0, reason: '密码修改成功！请重新登录!'})
		} else {
			res.send({code: 1, reason: '密码修改失败！哈哈!'})
		}
	})
})

/* 用户信息 */ 
router.get('/info', (req, res) => {
	// 获取id
	let id = req.user.id;

	// 构造sql
	const sqlStr = `select * from accounts where id=${id}`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		res.send({ data })
	})
})

/* -----上传开始---- */ 
// 引入node上传模块
var multer = require('multer');

// 配置存储路径 和 重命名
var storage = multer.diskStorage({
    // 图片上传到服务器以后 要放置的路径
    destination: 'public/upload',

    // 图片重命名
    filename: function (req, file, cb) {
        var fileFormat =(file.originalname).split(".");
        // 获取时间戳
        var filename = new Date().getTime();  
        // 124354654 + "." + jpg
        cb(null, filename + "." + fileFormat[fileFormat.length - 1]);
    }
});

// 上传对象
var upload = multer({
    storage,
});

// 接收上传请求
router.post('/uploadavatar', upload.single('file'), (req, res) => {
    // 接收到的文件信息
	var file = req.file;
	console.log(file)

	// 文件名
	let fileName = file.filename;
	// 拼接文件路径
	let avatarUrl = '/upload/' + fileName

	// 构造sql
	const sqlStr = `update accounts set avatarUrl = '${avatarUrl}' where id=${req.user.id}`;
	// 执行sql
	connection.query(sqlStr, (err, data) => {
		if (err) throw err;
		if (data.affectedRows > 0) {
			res.send({code: 0, reason: "上传成功", avatarUrl})
		} else {
			res.send({code: 1, reason: "上传失败"})
		}
	})
})

/* ----上传结束----- */ 

/* 获取用户角色 */ 
router.get('/role', (req, res) => {
	res.send({role: req.user.userGroup})
})

module.exports = router;
