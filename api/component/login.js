/*
* @Author: 10261
* @Date:   2017-04-14 12:29:30
* @Last Modified by:   10261
* @Last Modified time: 2017-04-20 13:36:48
*/

'use strict';
const { createWebAPIRequest } = require("../util/util");
const crypto = require('crypto');
exports.login = undefined;

var login = function login(phone, pwd, callback) {
	const cookie = '';
	const md5sum = crypto.createHash('md5');
	md5sum.update(pwd);
	const data = {
		'phone': phone,
		'password': md5sum.digest('hex'),
		'rememberLogin': 'true'
	}
	createWebAPIRequest(
		'music.163.com',
		'/weapi/login/cellphone',
		'POST',
		data,
		cookie,
		(music_req, cookie) => {
			var result = JSON.parse(music_req);
			callback && callback(JSON.stringify(result, '', 2));
		},
		err => 'fetch error'
	);
}

exports.login = login;