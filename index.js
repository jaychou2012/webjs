//引入http模块
var http = require("http");
var url = require('url');
var express = require('express')
var mysql = require('mysql')
var mongoClient = require('mongodb').MongoClient;
var fs = require('fs');
var url = 'mongodb://localhost:27017/test';
//设置主机名
var hostName = '127.0.0.1';
//设置端口
var port = 8092;
var app = express()

var connection = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: 'root123',
    database: 'mysql'
});

// connection.connect();
// connection.connect(function (err) {
//     if (err) {
//         console.error('err connnectiing' + err.stark);
//         return;
//     } else {
//         console.log('ok connect');
//     }
// });

mongoClient.connect(url, function (err, db) {
    console.log("连接成功！");
    //执行插入数据操作，调用自定义方法
    // insertData(db, function (result) {
    //     //显示结果
    //     console.log(result);
    //     //关闭数据库
    //     db.close();
    // });
});

var insertData = function (db, callback) {
    //获得指定的集合 
    var collection = db.collection('users');
    //插入数据
    var data = [{ _id: 7, "name": 'test', "age": 21 }, { _id: 8, "name": 'name', "age": 22 }];
    collection.insert(data, function (err, result) {
        //如果存在错误
        if (err) {
            console.log('Error:' + err);
            return;
        }
        //调用传入的回调方法，将操作结果返回
        callback(result);
    });
}

// app.get('/abc', (req, res) => {
//     // 指向位置
//     // req.url = '/index.html';
//     // 执行以下
//     // next();
//     var string = url.parse(req.url, true);
//     console.log("URL:" + req.url + "  " + string.pathname + "  " + express.static);
//     res.send('getget');
// });

var routes = express.Router();
// 路由: 根目录下时
routes.get('/abc', (req, res) => {
    // 指向位置
    // req.url = '/index.html';
    // 执行以下
    // next();
    // res.writeHead(200, { 'Content-Type': 'text/html' })
    // fs.readFile('./a/index.html', 'utf-8', function (err, data) {
    //     if (err) {
    //         console.log("URL:" + err.message);
    //         throw err;
    //     }
    //     res.end(data); 
    // });
    var string = url.parse(req.url, true);
    console.log("URL:" + req.url + "  " + string.pathname);
    res.send('getget ' + string.pathname + "  ");
    // res.end("hello nodejs");
});

routes.get('/ab', (req, res) => {
    var string = url.parse(req.url, true);
    console.log("URL:" + req.url + "  " + string.pathname);
    res.send('get get ' + string.pathname + "  ");
    // res.end("hello nodejs");
});

routes.get('/path', (req, res) => {
    fs.readFile('./index.html', 'utf-8', function (err, data) {
        if (err) {
            console.log("URL:" + err.message);
            throw err;
        }
        res.end(data);
    });
});

routes.get('/file', (req, res) => {
    res.sendFile('/index.html', { root: __dirname });
});

routes.get('/text', (req, res) => {
    res.send('<h1>标题</h1>');
});

let text = {
    a: 'text1',
    b: 'text2'
};

routes.post('/r', (req, res) => {
    var string = url.parse(req.url, true);
    console.log("URL:" + req.url + "  " + string.pathname);
    res.send('get get ' + string.pathname + "  " +
        JSON.stringify(text));
    res.end('200 http ok');
    console.log(req.method);//post
    console.log(req.body);//{ a: '3', b: '4', c: '5' }
    // console.log(req.body.a); //3
    // res.end("hello nodejs");
});

routes.get('/b', (req, res) => {
    connection.query('SELECT * FROM `mysql`.`students` LIMIT 60', function (err, rows, fields) {
        //处理你的结果
        // res.end(rows.constructor);
        // 输出结果
        res.end(JSON.stringify(rows));
        console.log(rows.constructor);
        console.log(typeof (rows));
        res.end(rows.join);
        console.log(err);
        console.log(fields);
    });
    // console.log(req.body.a); //3
    // res.end("hello nodejs");
});

routes.get('/p', (req, res) => {
    var sql = 'INSERT INTO students(id,name,sex,age,tel) VALUES(?,?,?,?,?)';
    var sql_params = ['2', '名字', 'w', 8, '133'];
    connection.query(sql, sql_params
        , function (err, rows, fields) {
            //处理你的结果
            // res.end(rows.constructor);
            // 输出结果
            res.end(JSON.stringify(rows));
            // console.log(rows.constructor);
            console.log(typeof (rows));
            // res.end(rows.join);
            console.log(err);
            console.log(fields);
        });
    // console.log(req.body.a); //3
    // res.end("hello nodejs");
});

routes.get('/m', (req, res) => {
    var sql = 'UPDATE students SET name = ?,age = ? WHERE id = ?';
    var sql_params = ['Hello World', 99, 2];
    connection.query(sql, sql_params
        , function (err, rows, fields) {
            //处理你的结果
            // res.end(rows.constructor);
            // 输出结果
            res.end(JSON.stringify(rows));
            // console.log(rows.constructor);
            console.log(typeof (rows));
            // res.end(rows.join);
            console.log(err);
            console.log(fields);
        });
    // console.log(req.body.a); //3
    // res.end("hello nodejs");
});

routes.get('/d', (req, res) => {
    var sql = 'DELETE FROM students WHERE id = 2';
    connection.query(sql, function (err, rows, fields) {
        //处理你的结果
        // res.end(rows.constructor);
        // 输出结果
        res.end(JSON.stringify(rows));
        // console.log(rows.constructor);
        console.log(typeof (rows));
        // res.end(rows.join);
        console.log(err);
        console.log(fields);
    });
    // console.log(req.body.a); //3
    // res.end("hello nodejs");
});

app.use("/a", express.static('public'))
app.use("/a", routes);
// app.use(express.static('./'));
var server = app.listen(port, hostName, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log(`服务开启成功【端口号:${port}】`)
    }
});

// //创建服务
// var server = http.createServer(function (req, res) {
//     var string = url.parse(req.url, true);
//     console.log("URL:" + req.url + "  " + string.pathname);
//     if (string.pathname == '/abc') {
//         console.log('abcabc');
//         connection.query('SELECT * FROM `mysql`.`students` LIMIT 5',function(err,rows,fields){
//             //处理你的结果
//            // res.end(rows.constructor);
//             // 输出结果
//             res.end(JSON.stringify(rows));

//             console.log(rows.constructor);
//             console.log(typeof(rows));
//             res.end(rows.join);
//             console.log(err);
//             console.log(fields);
//         });
//     }
//     res.setHeader('Access-Control-Allow-Origin', "*")
//     res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.setHeader('Content-Type', 'text/plain');
//     res.end("hello nodejs");

// });
// server.listen(port, hostName, function () {
//     console.log(`服务器运行在http://${hostName}:${port}`);
// });