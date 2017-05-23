/*
* @Author: 10261
* @Date:   2017-04-20 10:33:33
* @Last Modified by:   10261
* @Last Modified time: 2017-05-20 18:35:34
*/

'use strict';
//音乐api接口
exports.api = undefined;
//网易云登录接口
var _login = require("./component/login");
//用户歌单接口
var _userList = require("./component/userList");
//歌单接口
var _getPlaylists = require("./component/getPlaylists");
//专辑接口
var _album = require("./component/album");
//歌词接口
var _lyric = require("./component/lyric"); 
//音乐链接解析
var _parseUrl = require("./component/parseUrl");
//搜索接口
var _search = require("./component/search");
//热门歌曲接口
var _top = require("./component/top_list");

var api = {
  getPlaylists: _getPlaylists.getPlaylists,
  parseUrl: _parseUrl.parseUrl,
  top: _top.top,
  album: _album.album,
  search: _search.search,
  userList: _userList.userList,
  login: _login.login,
  lyric: _lyric.lyric
};
exports.api = api;