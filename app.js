const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const app = express()
const port = 3333

/*修改服务端代码，进行全路由配置，允许跨域请求*/
app.all('*', function(req, res, next){
	res.header('Access-Control-Allow-Origin',  '*');
	res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With, yourHeaderFeild');
	res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
	if (req.method === 'OPTIONS'){
	  res.send(200);
	}
	else{
	  next();
	}
});

//req.body需要用到的引用
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

//app.use(bodyParser.urlencoded({ extended: true }));
//res.render('loginin'); ejs转向的页面设置
app.set('views', './views');
app.set('view engine', 'ejs');

const mysql = require('mysql');

const con = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'sdaqmj',
    database : 'informationsystem'
});

app.get('/', (req, res) => {
	res.render('loginin');
});

//登録したユーザーにパラメータを判断する
app.get('/loginAction/:name&:passward', (req, res) => {
	const sql = "SELECT count(*) as count from login where name=? and passward=? ";
	con.query(sql, [req.params.name, req.params.passward],function (err, result, fields) {  
	if (err) throw err;
	console.log(result[0].count);
	if (result[0].count == '1') {
		res.redirect('/information');
	}else{
		res.redirect('/');
	}
	});
});

//社員インフォメーションを表示する、ejs専用
app.get('/information', (req, res) => {
	const sql = "SELECT * from staff where 1=1";
	con.query(sql, function (err, result, fields) {  
    if (err) throw err;
    //console.log(result);
	res.render('informationList',{item : result});
	});
});

//社員インフォメーションを表示する,VUE専用
app.get('/info2', (req, res) => {
	const sql = "SELECT * from staff where 1=1";
	con.query(sql, function (err, result, fields) {  
    if (err) throw err;
	//console.log(result);
	res.end(JSON.stringify(result));
	});
});


app.post('/infosearch', (req, res) => {
	//console.log("test:"+JSON.stringify(req.body));
	var userInfo = new Array();
	var sql = "SELECT * from staff where 1=1 ";
	for(var i in req.body){
		if(req.body[i].value !==''){
			var plus = "and "+req.body[i].name+" = ?";
			sql = sql + plus;
			//有值的拿出来!!!
			userInfo.push(req.body[i].value);
		}
	}
	console.log(userInfo);
	console.log(sql);
	con.query(sql, userInfo,function (err, result, fields) {
		if (err) throw err;
		console.log(result);
		res.end(JSON.stringify(result));
		});
});

app.get('/staffadd', (req, res) => {
	res.render('staffadd');
});

app.post('/insert',(req,res)=>{
	const sql = "INSERT INTO staff set ?"
	con.query(sql,req.body,function (err, result, fields) {  
		if (err) throw err;
		console.log(result);
		res.redirect('/information');
		});
});

app.get('/delete/:id',(req,res)=>{
	const sql = "DELETE FROM staff WHERE ID = ?";
	con.query(sql,[req.params.id],function(err,result,fields){
		if (err) throw err;
		console.log(result);
		res.redirect('/information');
	})
});
/*app.post('/insert',(req,res)=>{
	const sql = "INSERT INTO staff(ID,NAME,FURIGANA,ENTERDATE,MAIL,Address) values(?,?,?,FROM_UNIXTIME(Date.parse(?)),?,?)"
	con.query(sql,[req.body.ID,req.body.NAME,req.body.FURIGANA,req.body.ENTERDATE,req.body.MAIL,req.body.Adress],function (err, result, fields) {  
		if (err) throw err;
		console.log(result);
		res.redirect('/information');
		});
});*/

/*app.post('/', (req, res) => {
	const sql = "INSERT INTO users SET ?"
	con.query(sql,req.body,function(err, result, fields){
		if (err) throw err;
		console.log(result);
		res.redirect('/');
	});
});

app.get('/create', (req, res) => 
	res.sendFile(path.join(__dirname, 'html/form.html')))

app.get('/edit/:id',(req,res)=>{
	const sql = "SELECT * FROM users WHERE id = ?";
	con.query(sql,[req.params.id],function (err, result, fields) {  
		if (err) throw err;
		res.render('edit',{user : result});
		});
});

app.post('/update/:id',(req,res)=>{
	const sql = "UPDATE users SET ? WHERE id = " + req.params.id;
	con.query(sql,req.body,function (err, result, fields) {  
		if (err) throw err;
		console.log(result);
		res.redirect('/');
		});
});

app.get('/delete/:id',(req,res)=>{
	const sql = "DELETE FROM users WHERE id = ?";
	con.query(sql,[req.params.id],function(err,result,fields){
		if (err) throw err;
		console.log(result)
		res.redirect('/');
	})
});
*/

app.listen(port, () => console.log(`Example app listening on port ${port}!`));