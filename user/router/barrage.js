/*
* @Author: 10261
* @Date:   2017-04-28 11:00:14
* @Last Modified by:   10261
* @Last Modified time: 2017-04-28 12:48:47
*/

'use strict';
var express = require("express");
var router = express();
var mysql = require("../mysql.js");
var bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
function getbge(id) {
	return new Promise(function (resolve, reject) {
		mysql.query("SELECT * FROM barrage WHERE music_id = ?", [id], function (err, result) {
		    if (err) {
			    console.log(err);
		    } else {
			    console.log(typeof result);
			    result = JSON.stringify(result);
			    resolve(result);
		    }
	    });
	})
	
}
function intbge(data) {
	return new Promise(function (resolve, reject) {
		mysql.query("INSERT INTO barrage set ?", {
		    id: 1,
		    value: data.value,
		    music_id: data.id,
		    time: data.time,
		    x: data.x,
		    y: data.y,
		    fontSize: data.fontSize,
		    fontColor: data.fontColor,
		    fontFamily: data.fontFamily
	    }, function (err, rows) {
		    if (err) {
			    console.log(err);
			    reject(err);
		    } else {
			    console.log(rows);
			    resolve(rows);
		    }
	    });
	});	
}
router.post("/ist", function (req, res) {
	intbge(req.body).then(function (data) {
		console.log(data);
		getbge(req.body.id).then(function (data) {
			res.end(data);
		})
	})
});

router.post("/get", function (req, res) {
	getbge(req.body.id).then(function (data) {
		res.end(data);
	});
});
exports.barrage = router