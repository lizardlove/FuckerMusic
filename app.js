/*
* @Author: 10261
* @Date:   2017-02-23 16:37:22
* @Last Modified by:   10261
* @Last Modified time: 2017-05-20 18:36:55
*/

'use strict';
var request = require("request");
var express = require("express");
var bodyParser = require('body-parser');
var api = require('./api/api.js').api;//音乐api
var http = require("http");
var app = express();
app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//回调地狱解决方案
function synchro(key, core) {
	return new Promise (function (resolve, reject) {
		api[core](key, function (data) {
			resolve(data);
		})
	})
}

//现目前只暴露搜索，音乐链接解析，热门歌曲接口
app.use("/api/search", function (req, res) {
	synchro(req.body, "search").then(function (data) {
		res.end(data);
	})
});
app.use("/api/musicUrl", function(req,res) {//可视化调试
	synchro(req.body.id, "parseUrl").then(function (data) {
		if (req.body.parse == 1) {
			request(JSON.parse(data).data[0].url).pipe(res);
		} else {
			data = JSON.parse(data);
			data = JSON.stringify(data);
			res.end(data);
		}
	});
});
app.use("/api/top", function (req, res) {
	synchro(req.body.idx, "top").then(function (data) {
		res.end(data);
	})
})

//用户系统
app.use("/us", require("./user/user").user);

http.createServer(app).listen(8000);
console.log("run in 8000");

