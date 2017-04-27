/*
* @Author: 10261
* @Date:   2017-04-26 21:21:44
* @Last Modified by:   10261
* @Last Modified time: 2017-04-26 21:34:49
*/

'use strict';
var mysql = require("mysql");

var connection = mysql.createConnection({
	host: "127.0.0.1",
	user: "zxy",
	password: "zxy951357",
	database: "fucker"
});
connection.connect(function(err) {
    if (err) {
    	console.log('mysql connect error');
        console.log(err);
        return;
    } else {
        console.log('success !');
    }
});
module.exports = connection;