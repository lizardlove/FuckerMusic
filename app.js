/*
* @Author: 10261
* @Date:   2017-02-23 16:37:22
* @Last Modified by:   10261
* @Last Modified time: 2017-04-26 21:50:34
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
var user = {
	name: "LizardLove",
	pic: "./img/to.png",
	id: 0,
	font: {
		size: 50,
		color: "#333",
		family: "sans-serif"
	},
	list:{
		love:[]
	}
}
app.use("/api/search", function (req, res) {
	console.log(req.body);
	function get(x) {
		return new Promise(function (resolve, reject) {
			api.search(x, function (data) {
				data = JSON.parse(data).result.songs;
				var list = [];
				for (let i = 0; i < data.length; i++) {
			        var o = new Object();
			        o.name = data[i].name;
			        o.id = data[i].id;
			        o.pic = data[i].album.picUrl;
			        o.author = data[i].artists[0].name;
			        list.push(o);
		        }
		        resolve(list);
			});
		});
	}
	get(req.body).then(function (data) {
		res.end(JSON.stringify(data));
	});
});
app.use("/user", function (req, res) {
	console.log("user");
	res.end(JSON.stringify(user));
});
app.use("/us", require("./user/user.js"));
app.use("/api/musicUrl", function(req,res) {//可视化调试
	function get(x) {
		return new Promise(function (resolve, reject) {
			api.parseUrl(x, function (data) {
				resolve(data);
			});
		});
	}
	get(req.body.id).then(function (data) {
		console.log(req.body.parse);
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

