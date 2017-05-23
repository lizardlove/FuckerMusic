/*
* @Author: 10261
* @Date:   2017-04-26 21:08:09
* @Last Modified by:   10261
* @Last Modified time: 2017-05-20 18:37:39
*/

'use strict';

//用户系统
var express = require("express");
var router = express();

router.use("/barrage", require("./router/barrage").barrage);//弹幕系统
router.use("/sign", require("./router/sign").sign);//注册登录
router.use("/consumer", require("./router/consumer").consumer);//用户功能

exports.user = router