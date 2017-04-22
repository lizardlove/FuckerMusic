/*
* @Author: 10261
* @Date:   2017-04-12 10:35:53
* @Last Modified by:   LizardLove
* @Last Modified time: 2017-04-22 17:37:25
*/

'use strict';
const { createWebAPIRequest } = require("../util/util");
const http = require('http');
exports.getPlaylists = undefined;

var getPlaylists = function getPlaylists (id, callback) {
	const cookie = '';
    let detail, imgurl;
    const data = {
        "id": id,
        "offset": 0,
        "total": true,
        "limit": 1000,
        "n": 1000,
        "csrf_token": ""
    };
    createWebAPIRequest(
    	'music.163.com',
    	'/weapi/v3/playlist/detail',
    	'POST',
    	data,
    	cookie,
    	music_req => {
    		detail = music_req;
    		mergeRes();
    	},
    	err => {
    		return "fetch error";
    	}
    );
    const http_client = http.get({
    	hostname: 'music.163.com',
    	path:  '/playlist?id=' + id,
    	headers: {
    		'Referer': 'http://music.163.com',
    	},
    }, function (res) {
    	res.setEncoding('utf8');
    	let html = '';
    	res.on('data', function (chunk) {
    		html += chunk;
    	});
    	res.on('end', function () {
    		const regImgCover = /\<img src=\"(.*)\" class="j-img"/ig;
    		imgurl = regImgCover.exec(html)[1];
    		mergeRes();
    	})
    })
    function mergeRes() {
    	if (imgurl != undefined && detail != undefined) {
    		detail = JSON.parse(detail);
    		detail.playlist.picUrl = imgurl;
    		callback && callback(JSON.stringify(detail, '', 2));
    	}
    }
}
exports.getPlaylists = getPlaylists;