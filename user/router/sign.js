/*
* @Author: 10261
* @Date:   2017-04-28 11:01:14
* @Last Modified by:   10261
* @Last Modified time: 2017-05-19 18:04:14
*/

'use strict';
var express = require("express");
var router = express();
var mysql = require("../mysql.js");
var bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

function intUser(data, uid) {
	return new Promise(function (resolve, reject) {
		mysql.query("INSERT INTO user SET ?", {
			uid: uid, 
			nick: data.nick,
			email: data.email,
			password: data.password,
			head: "./img/to.png",
			fontSize: 25,
			fontColor: "#000",
			fontFamily: "sans-serif",
			list: "love",
			verif: uid
		}, function (err, rows) {
			if (err) {
				console.log(err);
				resolve(0);
			} else {
				resolve(rows);
			}
		});
	})
}

function getUser(data) {
	return new Promise(function (resolve, reject) {
		var str = '';
		if (typeof data === "object") {
			str = "SELECT * FROM user WHERE email = ?";
			data = data.email;
		} else {
			str = "SELECT * FROM user WHERE uid = ?";
		}
		mysql.query(str, [data], function (err, result) {
			if (err) {
				console.log(221);
				console.log(err);
				reject(err);
			} else {
				result = JSON.stringify(result);
				result = JSON.parse(result)[0];
				if (result !== undefined) {
					var list = new Object();
					if (result.list.indexOf("#") != -1) {
						var listDet = result.list.split("#");
						for (let i = 0; i < listDet.length; i++) {
							list[listDet[i]] = [];
						}
					} else {
						list[result.list] = [];
					}
					result.list = list;
					console.log("get");
				}
				resolve(JSON.stringify(result));
			}
		})
	})
}

router.post("/up", function (req, res) {
	var rs = new Object();
	var uid = parseInt(Math.random()*100000) + parseInt(Math.random()*100000);
	getUser(req.body).then(function (result) {
		if (result === undefined) {
			intUser(req.body, uid).then(function (data) {
				if (!data) {
					rs.status = 400;
					res.end(JSON.stringify(rs));
				} else {
					getUser(uid).then(function (rst) {
						rs = JSON.parse(rst);
						rs.status = 200;
						res.end(JSON.stringify(rs));
					});
				}
			});
		} else {
			rs.status = 400;
			res.end(JSON.stringify(rs));
		}
	});
});
router.post("/in",function (req, res) {
	var rs = new Object();
	getUser(req.body).then(function (result) {
		if (result === undefined) {
			rs.status = 402;
			res.end(JSON.stringify(rs));
		} else {
			result = JSON.parse(result);
			if (result.email == req.body.email && result.password == req.body.password) {
				rs = result;
				rs.status = 200;
				res.end(JSON.stringify(rs));
			} else {
				rs.status = 402;
				res.end(JSON.stringify(rs));
			}
		}
	});
});
router.post("/get", function (req, res) {
	getUser(req.body.uid).then(function (result) {
		res.end(result);
	})
})
exports.sign = router