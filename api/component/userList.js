/*
* @Author: 10261
* @Date:   2017-04-14 13:24:03
* @Last Modified by:   10261
* @Last Modified time: 2017-04-20 13:36:54
*/

'use strict';
const { createWebAPIRequest } = require("../util/util")

exports.userList = undefined;

var userList = function userList(uid, callback) {
	const data = {
		"offset": 0,
		"uid": uid,
		"limit": 1000,
		"csrf_token": ""
	}
	createWebAPIRequest(
		'music.163.com',
		'/weapi/user/playlist',
		'POST',
		data,
		'',
		music_req => {
			var result = JSON.parse(music_req);
			callback && callback(JSON.stringify(result, '', 2));
		},
		err => "fetch error"
	)
}

exports.userList = userList;