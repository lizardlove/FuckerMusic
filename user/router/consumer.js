/*
* @Author: 10261
* @Date:   2017-04-28 11:07:21
* @Last Modified by:   10261
* @Last Modified time: 2017-05-10 16:47:26
*/

'use strict';
var express = require("express");
var router = express();
var mysql = require("../mysql.js");
var bodyParser = require("body-parser");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));



exports.consumer = router