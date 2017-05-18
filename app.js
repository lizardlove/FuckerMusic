/*
* @Author: 10261
* @Date:   2017-02-23 16:37:22
* @Last Modified by:   10261
* @Last Modified time: 2017-05-18 12:40:34
*/

'use strict';
var request = require("request");
var express = require("express");
var bodyParser = require('body-parser');
var api = require('./api/api.js').api;
var http = require("http");
var app = express();
app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
function synchro(key, core) {
	return new Promise (function (resolve, reject) {
		api[core](key, function (data) {
			resolve(data);
		})
	})
}
app.use("/api/search", function (req, res) {
	synchro(req.body, "search").then(function (data) {
		res.end(data);
	})
});
app.use("/us", require("./user/user").user);

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

http.createServer(app).listen(8000);
console.log("run in 8000");

