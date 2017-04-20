/*
* @Author: 10261
* @Date:   2017-04-15 13:05:20
* @Last Modified by:   10261
* @Last Modified time: 2017-04-20 13:37:14
*/

'use strict';
const { createRequest } = require("../util/util");
exports.search = undefined;

var search = function search(x, callback) {
	const key = x.key;
	const type = x.type || 1;
	const limit = x.limit || 30;
	const offset = x.offset || 0;

	const data = "s=" + key + "&limit=" + limit + "&type=" + type + "&offset=" + offset;
	createRequest("/api/search/pc", "POST", data)
	    .then(result => {
	    	result = JSON.parse(result);
	    	callback && callback(JSON.stringify(result, '', 2));

	    })
	    .catch(err => "fetch error")
}

exports.search = search;
