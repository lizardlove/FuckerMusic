/*
* @Author: 10261
* @Date:   2017-04-20 12:18:38
* @Last Modified by:   10261
* @Last Modified time: 2017-04-22 18:32:53
*/

'use strict';
var api = require('./api/api.js').api;
console.log('x');
// api.album('32311', data => {
// 	console.log("************************ablum************");
// 	console.log(data);
// });

// api.getPlaylists('391527618', data => {
// 	console.log("******************playlist************");
// 	console.log(data);
// 	// data = JSON.parse(data).playlist.tracks;
// 	// for (let i = 0; i < data.length; i++) {
// 	// 	var o = new Object();
// 	// 	o.name = data[i].name;
// 	// 	o.author = data[i].ar[0].name;
// 	// 	o.pic = data[i].al.picUrl;
// 	// 	o.id = data[i].id;
// 	// 	// api.parseUrl(o.id, datas => {
// 	// 	// 	o.src = JSON.parse(datas).data[0].url;
// 	// 	// });
// 	// 	// o.lrc = api.lyric(o.id, datas => {
// 	// 	// 	return JSON.parse(datas).lrc.lyric;
// 	// 	// });
// 	// 	console.log(o);
// 	// }
// })
// api.login('13608379573', 'zxy951357', data => {
// 	console.log("******************login************");
// 	console.log(data);
// })
// api.lyric('347230', data => {
// 	console.log("******************lyric************");
// 	console.log(data);
// })
// api.parseUrl('347230', data => {
// 	console.log("******************parseUrl************");
// 	console.log(JSON.parse(data).data[0].url);
// })
// api.search({key:"爱"}, data => {
// 	console.log("******************search************");
// 	console.log(data);
// })
// api.top(6, data => {
// 	console.log("******************top************");
// 	console.log(data);
// })
api.userList("13806370", data => {
	console.log("******************userList************");
	console.log(data);
})