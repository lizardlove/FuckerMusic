/*
* @Author: 10261
* @Date:   2017-04-28 11:07:21
* @Last Modified by:   10261
* @Last Modified time: 2017-05-20 12:52:48
*/

'use strict';
var express = require("express");
var router = express();
var mysql = require("../mysql.js");
var fs = require("fs");
var formidable = require("formidable");
var bodyParser = require("body-parser");

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

function upThat(x, data) {
	return new Promise(function (resolve, reject) {
	    var str = "";
	    function back(err, result) {
	    	if (err) {
	    		reject(err);
	    	} else {
	    		result = JSON.stringify(result);
	    		result = JSON.parse(result);
	    		resolve(JSON.stringify(result));
	    	}
	    }
	    switch (x) {
		    case "master": {
			    str = "UPDATE user SET nick = ?, password = ? WHERE uid = ?";
			    mysql.query(str, [data.nick, data.password, data.uid], function (err, result) {
			    	back(err, result);
			    });
			    break;
		    }
		    case "info": {
			    str = "UPDATE user SET fontSize = ?, fontColor = ?, fontFamily = ? WHERE uid = ?";
			    mysql.query(str, [data.fontSize, data.fontColor, data.fontFamily, data.uid], function (err, result) {
			    	back(err, result);
			    });
			    break;
		    }
		    case "list": {
			    str = "UPDATE user SET list = ? WHERE uid = ?";
			    mysql.query(str, [data.data, data.uid], function (err, result) {
			    	back(err, result);
			    });
			    break;
		    }
		    case "head": {
		    	str = "UPDATE user SET head = ? WHERE uid = ?";
		    	mysql.query(str, [data.url, data.uid], function (err, result) {
		    		back(err, result);
		    	});
		    	break;
		    }
		    default: return;
	    }
	});
}
function selectThat(x, data) {
	return new Promise(function (resolve, reject) {
		var str = "";
		switch (x) {
			case "music": {
				str = "SELECT * FROM music_list WHERE uid = ?";
		    	mysql.query(str, [data.uid], function (err, result) {
		    		if (err) {
		    			reject(err);
		    			console.log(err);
		    		} else {
		    			resolve(result);
		    		}
		    	});
		    	break;
			}
			case "id": {
				str = "SELECT * FROM music_list WHERE uid = ? AND music_id = ?";
				mysql.query(str, [data.uid, data.id], function (err, result) {
					if (err) {
						reject(err);
					} else {
					    resolve(result);
				    }
				});
				break;
			}
			case "all": {
				str = "SELECT uid FROM user";
				mysql.query(str, function (err, result) {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
				});
				break;
			}
			case "friend": {
				str = "SELECT * FROM friend WHERE masterU = ?";
				mysql.query(str, [data.uid], function (err, result) {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
				});
				break;
			}
			case "user": {
				str = "SELECT * FROM user WHERE uid = ?";
				mysql.query(str, [data.uid], function (err, result) {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
				});
				break;
			}
			default: return;
		}
	})
}
function insThat(x, data) {
	return new Promise(function (resolve, reject) {
		var str = "";
		switch (x) {
			case "music": {
				str = "INSERT INTO music_list SET ?";
		    	mysql.query(str, {
		    		uid: data.uid,
		    		sort: data.sort,
		    		name:data.name,
		    		music_id: data.id,
		    		author: data.author,
		    		pic: data.pic
		    	}, function (err, result) {
		    		if (err) {
		    			reject(0);
		    		} else {
		    			resolve(result);
		    		}
		    	});
		    	break;
			}
			case "friend": {
				str = "INSERT INTO friend SET ?";
				mysql.query(str, {
					masterU: data.masterU,
					friendU: data.friendU
				}, function (err, result) {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
				});
				break;
			}
			default: return;
		}
	})
}
function delThat(x, data) {
	return new Promise(function (resolve, reject) {
		var str = "";
		switch (x) {
			case "music": {
				str = "DELETE FROM music_list WHERE uid = ? AND music_id = ?";
				mysql.query(str, [data.uid, data.id], function (err, result) {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
				});
				break;
			}
			case "friend": {
				str = "DELETE FROM friend WHERE masterU = ? AND friendU = ?";
				mysql.query(str, [data.masterU, data.friendU], function (err, result) {
					if (err) {
						reject(err);
					} else {
						resolve(result);
					}
				});
				break;
			}
			default: break;
		}
	})
}

router.post("/addFriend", function (req, res) {
	insThat("friend", req.body).then(function (result) {
		res.end(JSON.stringify(result));
	});
});
router.post("/delFriend", function (req, res) {
	delThat("friend", req.body).then(function (result) {
		res.end(JSON.stringify(result));
	})
})
router.post("/getAll", function (req, res) {
	selectThat("all", req.body).then(function (result) {
		res.end(JSON.stringify(result));
	})
});
router.post("/getFriend", function (req, res) {
	selectThat("friend", req.body).then(function (result) {
		res.end(JSON.stringify(result));
	});
})
router.post("/getUser", function (req, res) {
	selectThat("user", req.body).then(function (result) {
		res.end(JSON.stringify(result));
	})
});
router.post("/upMaster", function(req, res) {
	upThat("master", req.body).then(function (result) {
		var rs = new Object();
		if (!result) {
			rs.status = 400;
			res.end(JSON.stringify(rs));
		} else {
			rs.status = 200;
			rs.result = result;
			res.end(JSON.stringify(rs));
		}
	});

});
router.post("/upList", function (req, res) {
	upThat("list", req.body).then(function (result) {
		var rs = new Object();
		if (!result) {
			rs.status = 400;
			res.end(JSON.stringify(rs));
		} else {
			rs.status = 200;
			rs.result = result;
			res.end(JSON.stringify(rs));
		}
	});
});
router.post("/upInfo", function(req, res) {
	upThat("info", req.body).then(function (result) {
		var rs = new Object();
		if (!result) {
			rs.status = 400;
			res.end(JSON.stringify(rs));
		} else {
			rs.status = 200;
			rs.result = result;
			res.end(JSON.stringify(rs));
		}
	});
})
router.post("/img", function (req, res) {
	var form = new formidable.IncomingForm();
	form.uploadDir = "./public/user/";
	form.keepExtensions = true;
	form.parse(req, function (err, fields, files) {
		if (err) {
			res.end("error");
			return;
		}
		var extName = "";
		console.log(fields);
		for (var key in files) {
			let file = files[key];
			switch (file.type) {
				case "image/pjpeg": {
					extName = "jpg";
					break;
				}
				case "image/jpeg": {
					extName = "jpg" ;
					break;
				}
				case "image/png": {
					extName = "png";
					break;
				}
				default: break;
			}
			var name = fields.uid + "." + extName;
			var save = form.uploadDir + name;
			fs.renameSync(file.path, save);
		}
		var ms = new Object();
		ms.uid = fields.uid;
		ms.url = "./user/" + name;
		upThat("head", ms).then(function (result) {
			res.end("OK");
		});
	})
});
router.post("/music", function (req, res) {
	selectThat("id", req.body).then(function (result) {
		var rs = new Object();
		if (result[0] === undefined) {
			insThat("music", req.body).then(function (result) {
				if (!result) {
					rs.status = 400;
					res.end(JSON.stringify(rs));
				} else {
					rs.status = 200;
					rs.result = result;
					res.end(JSON.stringify(rs));
				}
			});
		} else {
			rs.status = 400;
			res.end(JSON.stringify(rs));
		}
	});
});
router.post("/getMusic", function (req, res) {
	selectThat("music", req.body).then(function (result) {
		var rs = new Object();
		console.log(result);
		if (result[0] === undefined) {
			rs.status = 400;
			res.end(JSON.stringify(rs));
		} else {
			rs.result = result;
			rs.status = 200;
			console.log(rs);
			res.end(JSON.stringify(rs));
		}
	});
});
router.post("/delM", function (req, res) {
	delThat("music", req.body).then(function (result) {
		console.log(result);
		res.end(JSON.stringify(result));
	})
})

exports.consumer = router