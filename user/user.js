/*
* @Author: 10261
* @Date:   2017-04-26 21:08:09
* @Last Modified by:   10261
* @Last Modified time: 2017-04-28 12:48:15
*/

'use strict';
var express = require("express");
var router = express();

router.use("/barrage", require("./router/barrage").barrage);
router.use("/sign", require("./router/sign").sign);
router.use("/consumer", require("./router/consumer").consumer);

exports.user = router