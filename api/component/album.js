/*
* @Author: 10261
* @Date:   2017-04-11 12:07:45
* @Last Modified by:   10261
* @Last Modified time: 2017-04-20 13:36:31
*/

'use strict';
const { createRequest } = require("../util/util");
exports.album = undefined;

var album = function album(id, callback) {
	createRequest('/api/album/' + id, 'GET', null)
	    .then(result => {
	    	result = JSON.parse(result);
	    	callback && callback(JSON.stringify(result, '', 2));
	    })
	    .catch(err => {
	    	return "fetch error";
	    });
}

exports.album = album;