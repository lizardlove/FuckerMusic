/*
* @Author: 10261
* @Date:   2017-04-20 10:33:33
* @Last Modified by:   10261
* @Last Modified time: 2017-04-20 13:30:12
*/

'use strict';
exports.api = undefined;

var _login = require("./component/login");

var _userList = require("./component/userList");

var _getPlaylists = require("./component/getPlaylists");

var _album = require("./component/album");

var _lyric = require("./component/lyric"); 

var _parseUrl = require("./component/parseUrl");

var _search = require("./component/search");

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