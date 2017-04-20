/*
* @Author: 10261
* @Date:   2017-04-13 12:54:25
* @Last Modified by:   10261
* @Last Modified time: 2017-04-20 13:37:09
*/

'use strict';
const { createWebAPIRequest } = require("../util/util");
exports.parseUrl = undefined;

var parseUrl = function parseUrl(id, callback) {
	const data = {
		"ids": [id],
		"br": 999000,
		"csrf_token": ""
	}
	createWebAPIRequest(
		"music.163.com",
		"/weapi/song/enhance/player/url",
		'POST',
		data,
		'',
		music_req => {
			var result = JSON.parse(music_req);
			callback && callback(JSON.stringify(result, '', 2));
		},
		err => "fetch error"
	);
}

exports.parseUrl = parseUrl;
