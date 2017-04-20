/*
* @Author: 10261
* @Date:   2017-04-19 12:40:35
* @Last Modified by:   10261
* @Last Modified time: 2017-04-20 13:56:29
*/

'use strict';
const { createRequest } = require("../util/util");
exports.lyric = undefined;

var lyric = function lyric(id, callback) {
	createRequest('/api/song/lyric?os=osx&id=' + id + '&lv=-1&kv=-1&tv=-1', 'GET', null)
	    .then(result => {
	    	result = JSON.parse(result);
	    	callback && callback(JSON.stringify(result, '', 2));
	    })
	    .catch(err => "fetch error");
}
exports.lyric = lyric;