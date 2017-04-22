/*
* @Author: 10261
* @Date:   2017-02-23 16:37:22
* @Last Modified by:   10261
* @Last Modified time: 2017-04-22 18:50:38
*/

'use strict';
var request = require("request");
var express = require("express");
var bodyParser = require('body-parser');
var api = require('./api/api.js').api
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
		size: 20,
		color: "#333",
		family: "pg"
	},
	list:{}
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
app.get("/user", function (req, res) {
	console.log("user");
	res.end(JSON.stringify(user));
	// function get(x) {
	// 	return new Promise(function (resolve, reject) {
	// 		api.userList(x, function (data) {
	// 			// data = JSON.parse(data).playlist.tracks;
	// 			// var list = [];
	// 			// for (let i = 0; i < data.length; i++) {
	// 			// 	var o = new Object();
	// 			// 	o.name = data[i].name;
	// 			// 	o.author = data[i].ar[0].name;
	// 			// 	o.pic = data[i].al.picUrl;
	// 			// 	o.id = data[i].id;
	// 			// 	list.push(o);
	// 			// }
	// 			data = JSON.parse(data);
	// 			resolve(data);
	// 		});
	// 	});
	// }
	// get("391527618").then(function (data) {
	// 	user.list.love = data;
		// get("13806370").then(function (data) {
		// 	//user.list.you = data;
		// 	res.end(JSON.stringify(data));
		// });
	// });
});

app.post("/music", function(req,res) {//可视化调试
	api.parseUrl(req.body.id, data => {
		console.log(JSON.parse(data).data[0].url);
		request(JSON.parse(data).data[0].url).pipe(res);
	});
});
http.createServer(app).listen(8000);
console.log("run in 8000");

