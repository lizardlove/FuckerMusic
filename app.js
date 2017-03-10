/*
* @Author: 10261
* @Date:   2017-02-23 16:37:22
* @Last Modified by:   10261
* @Last Modified time: 2017-03-10 21:40:24
*/

'use strict';
var request = require("request");
var express = require("express");
var bodyParser = require('body-parser');
var http = require("http");
var app = express();
app.use(express.static("./public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.post('/api', function(req,res) {//可视化调试
	console.log(req.body);
	request(req.body.url).pipe(res);
});
http.createServer(app).listen(8000);
console.log("run in 8000");
