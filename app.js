/*
* @Author: 10261
* @Date:   2017-02-23 16:37:22
* @Last Modified by:   10261
* @Last Modified time: 2017-04-20 14:21:39
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
	canvas: "炫彩音阶",
	list:{}
}
app.get("/user", function (req, res) {
	api.getPlaylists("391527618", data => {
		data = JSON.parse(data).playlist.tracks;
		var list = [];
		for (let i = 0; i < data.length; i++) {
			var o = new Object();
			o.name = data[i].name;
			o.author = data[i].ar[0].name;
			o.pic = data[i].al.picUrl;
			o.id = data[i].id;
			list.push(o);
		}
		user.list.love = list;
	});
	api.getPlaylists("11039078", data => {
		data = JSON.parse(data).playlist.tracks;
		var list = [];
		for (let i = 0; i < data.length; i++) {
			var o = new Object();
			o.name = data[i].name;
			o.author = data[i].ar[0].name;
			o.pic = data[i].al.picUrl;
			o.id = data[i].id;
			list.push(o);
		}
		user.list.you = list;
	});
	res.end(JSON.stringify(user));
});

app.post("/music", function(req,res) {//可视化调试
	console.log(req.body);
	api.parseUrl(req.body.id, data => {
		console.log(JSON.parse(data).data[0].url);
		request(JSON.parse(data).data[0].url).pipe(res);
	});
});
http.createServer(app).listen(8000);
console.log("run in 8000");

