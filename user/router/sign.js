/*
* @Author: 10261
* @Date:   2017-04-28 11:01:14
* @Last Modified by:   10261
* @Last Modified time: 2017-04-28 12:49:24
*/

'use strict';
var express = require("express");
var router = express();
var mysql = require("../mysql.js");
var bodyParser = require("body-parser");
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));
exports.sign = router