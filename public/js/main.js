/*
* @Author: 10261
* @Date:   2017-02-23 17:22:24
* @Last Modified by:   10261
* @Last Modified time: 2017-05-20 13:32:47
*/

'use strict';
//全局基础
//
//
//
function $(dom) {
	return document.querySelector(dom);
};

function $$(dom) {
	return document.querySelectorAll(dom);
}

function addEvent(obj, type, fun, bool) {
	var _event = function (event) {
		var type = event.type;
		if (type == "DOMMouseScroll" || type == "mousewheel") {
			event.delta = (event.wheelDelta) ? event.wheelDelta / 120 :　-(event.detail || 0) / 3;
		}
		return event;
	};
	if (window.addEventListener) {
			obj.addEventListener(type, function (e) {
				fun.call(this, _event(e));
			}, bool);
	} else if (window.attachEvent) {
		if (type = "mousewheel") {
			type = "DOMMouseScroll";
		}
			if (type = "mousewheel") {
				type = "DOMMouseScroll";
			}
			obj.attachEvent("on" + type, function (e) {
				fun.call(obj, _event(e));
			})
	}
};

requestAnimationFrame = window.requestAnimationFrame || 
                        window.webkitRequestAnimationFrame || 
                        window.mozRequestAnimationFrame;



//页面配置
//
//
var master = {
	fontSize: 25,
	fontColor: '#000',
	fontFamily: "sans-serif"
};
var searchBox;
var Tourist = [];

var fontFamily = ["sans-serif"];

var pageControl = {
	pageFlag: 0,
	modifyFlag: 0,
	volume: 0,
	order: 0,
	width: document.body.offsetWidth,
	height: document.body.offsetHeight,
	musicObj: {},
	mod: {
		flag: 0,
		det: ['random.png', 'sig.png', 'circle.png']
	}
}

//页面控制
//
//
//
//

function pageInit(m) {
	master = m;
	$("#masterPic img").src = m.head;
	$("#userHeadBox img").src = m.head;
	$("#mePic img").src = m.head;
	$("#meNick").innerHTML = m.nick;
	$("#nameSet").placeholder = m.nick;
	$("#masterName").innerHTML = m.nick;
	getUserMusic(m.uid);
	musicListSelect("#mcList", m.list);
	if (master.list.love[0]) {
		mc.load(master.list.love[0]);
	}
}

function moreSelect(dom, list) {
	var placeHold = $(dom + " .placeHold");
	for(var i = 0; i < list.length; i++) {
		var newLi = document.createElement("li");
		newLi.innerHTML = list[i];
		placeHold.innerHTML = list[i];
		addEvent(newLi, 'click', function () {
			placeHold.innerHTML = this.innerHTML;
		});
		$(dom + " ul").appendChild(newLi);
	}
}
function musicListSelect(dom, list) {
	var placeHold = $(dom + " .placeHold");
	$(dom + " ul").innerHTML = "";
	for (var key in list) {
		var newLi = document.createElement('li');
		placeHold.innerHTML = key;
		newLi.innerHTML = key;
		addEvent(newLi, 'click', function () {
			placeHold.innerHTML = this.innerHTML;
			addList(dom);
		})
		$(dom + " ul").appendChild(newLi);
	}
}
function clearWidth () {
	$("#music").style.width = "100%";
	$("#musicListBox").style.width = "0";
	$("#userSettingBox").style.width = "0";
	$("#friendListBox").style.width = "0";
}

function calW(dom) {
	addEvent($(dom), 'click', function () {
		if (window.localStorage.getItem("user")) {
		    if (pageControl.pageFlag == 0) {
			    var bigWidth, littleWidth;
			    if (pageControl.width < 800) {
				    littleWidth = "50%";
				    bigWidth = "50%";
			    } else {
				    littleWidth = "25%";
				    bigWidth = "75%";
			    }
			    $(dom + "Box").style.width = littleWidth;
			    $("#music").style.width = bigWidth;
			    pageControl.pageFlag ++;
		    } else if (pageControl.pageFlag == 1) {
			    clearWidth();
			    pageControl.pageFlag = 0;
		    }
		} else {
			$("#sign").style.display = "flex";
		}
	});
}

function choiceMod() {
	var prev = $("#choiceMod .prev");
	var next = $("#choiceMod .next");
	function control(x, y, z) {
		var core = $("#choiceMod .slideBox img");
		switch (pageControl.mod.flag) {
			case 0: {
				pageControl.mod.flag = x;
				break;
			}
			case 1: {
				pageControl.mod.flag = y;
				break;
			}
			case 2: {
				pageControl.mod.flag = z;
				break;
			}
			default: break;
		}
		core.src = "./img/" + pageControl.mod.det[pageControl.mod.flag];
	}
	addEvent(prev, 'click', function () {
		control(2, 0, 1);
	});
	addEvent(next, 'click', function () {
		control(1, 2, 0);
	})
}

function pageChange () {

    var back = $$(".back");
    for (var b = 0; b < back.length; b++) {
    	addEvent(back[b], 'click', function () {
    		clearWidth();
    		pageControl.pageFlag = 0;
    	})
    }

    addEvent($("#goBack"), 'click', function () {
    	$("#mengK").style.display = "none";
    })

	addEvent($("#musicSearch"), 'click', function () {
		if (pageControl.pageFlag == 1) {
			clearWidth();
			pageControl.pageFlag = 0;
		} else {
			$("#searchBox").style.display = "block";
			pageControl.pageFlag ++;
		}
	});

	addEvent($(".close"), 'click', function () {
		clearWidth();
		pageControl.pageFlag = 0;
		$("#searchBox").style.display = "none";
	});

	addEvent($("#iLove img"), 'click', function () {
		if (localStorage.getItem("user")) {
		    var meL = $(".meList");
		    this.src = "./img/iLove.png";
		    meL.innerHTML = '';
		    for (var key in master.list) {
			    var newLi = document.createElement("li");
			    newLi.innerHTML = key;
			    addEvent(newLi, 'click', function() {
				    var ms = new Object();
				    master.list[this.innerHTML].push(pageControl.musicObj);
				    ms.uid = localStorage.getItem("user");
				    ms.name = pageControl.musicObj.name;
				    ms.id = pageControl.musicObj.id;
				    ms.author = pageControl.musicObj.author;
				    ms.pic = pageControl.musicObj.pic;
				    ms.sort = this.innerHTML;
				    ajax({
				    	method: "POST",
				    	url: "us/consumer/music",
				    	data: ms,
				    	success: function (data) {
				    		data = JSON.parse(data);
				    		if (data.status == 200) {
				    			$(".meList").style.display = "none";
				                addList("#mcList");
				    		} else {
				    			$(".meList").style.display = "none";
				    			alertBox(6);
				    		}
				    	}
				    })
			    });
			    meL.appendChild(newLi);
		    }
		    meL.style.display = "block";
		} else {
			$("#sign").style.display = "flex";
		}
	});

    addEvent($("#newList"), "click", function () {
    	$(".new").style.display = "block";
    });

    addEvent($(".confirmBox .no"), 'click', function () {
    	$(".new").style.display = "none";
    })

    addEvent($(".confirmBox .yes"), 'click', function () {
    	var list = $("input[name=newList]").value;
    	var str = "";
    	for (var key in master.list) {
    		str += key + "#";
    	}
    	str += list;
    	var ms = new Object();
    	ms.uid = localStorage.getItem("user");
    	ms.data = str;
    	ajax({
    		method: "POST",
    		url: "us/consumer/upList",
    		data: ms,
    		success: function (data) {
    			data = JSON.parse(data);
    			if (data.status == 200) {
    				alertBox(4);
    				master.list[list] = [];
    	            musicListSelect("#mcList", master.list);
    				$(".new").style.display = "none";
    			} else {
    				alertBox(5);
    			}
    		}
    	})
    })

    addEvent($("#headSet"), "click", function () {
    	$("#headSet input[type='file']").click();
    });
    $("#headSet input[type='file']").onchange = function () {
    	var img = $("#userHeadBox img");
    	var file = $("#headSet input[type='file']").files[0];
    	var reader = new FileReader();
    	reader.onloadend = function () {
    		img.src = reader.result;
    	};
    	if (file) {
    		reader.readAsDataURL(file);
    	}

    }
    $("#fontSizeDet").onchange = function () {
    	$("#fontShow").style.fontSize = this.value / 100 * 1.5 + "rem";
    }

    $("#fontColorDet").onchange = function () {
    	$("#fontShow").style.color = this.value;
    }

    addEvent($("#quit"), 'click', function () {
    	localStorage.clear();
    	clearWidth();
    })

    calW("#musicList");
	calW("#userSetting");
	calW("#friendList");
	moreSelect("#fontFamilyDet", fontFamily);
	choiceMod();

}


//搜索
function searchGroup() {
	var searchIpt = $("input[name=search]");
	var go = $("#go");
	addEvent(searchIpt, "keydown", function (e) {
		if (e.keyCode == 13) {
			search(searchIpt.value);
			this.value = "";
		}
	});
	addEvent(go, 'click', function() {
		search(searchIpt.value);
	})
}

function createDiv(str) {
	var dom = document.createElement("div");
	dom.className = str;
	return dom;
}
function search(keys) {
	ajax({
		url: "/api/search",
		data: {key: keys},
		method: "POST",
		success: function (data) {
			data = JSON.parse(data);
			var result = $("#result");
			searchBox = [];
			result.innerHTML = '';
			for (var i = 0; i < data.length; i++) {
				var o =  new Object();
				o.name = data[i].name;
				o.id = data[i].id;
				o.pic = data[i].album.picUrl;
				o.author = data[i].artists[0].name;
				searchBox.push(o);
				var see = createDiv("see");
				var sPic = createDiv("sPic");
				var info = createDiv("info");
				var infoName = createDiv("infoName");
				var infoAuthor = createDiv("infoAuthor");
				var ig = document.createElement("img");
				ig.src = data[i].album.picUrl;
				see.dataValue = i;
				infoName.innerHTML = data[i].name;
				infoAuthor.innerHTML = data[i].artists[0].name;
				info.appendChild(infoName);
				info.appendChild(infoAuthor);
				sPic.appendChild(ig);
				see.appendChild(sPic);
				see.appendChild(info);
				addEvent(see, 'click', function () {
					pageControl.musicObj = searchBox[this.dataValue];
					if (mc.active) {
						mc.stop();
					}
					mc.load(pageControl.musicObj);
					getBarrage(pageControl.musicObj.id);
				})
				result.appendChild(see);
			}
		},
		error: function (err) {
			console.log(err);
		}
	})
}







//音乐控制


function musicInit(dom) {
	var list = master.list[$("#mcList .placeHold").innerHTML];
	for (var x = 0; x　< list.length; x++) {
		if(list[x].name == dom.childNodes[1].innerHTML) {
			pageControl.musicObj = list[x];
		}
	}
	if (mc.active) {
		mc.stop();
	}
	mc.load(pageControl.musicObj);
	getBarrage(pageControl.musicObj.id);
}

function addList(dom) {
	var placeHold = $(dom + " .placeHold");
	if ($(dom +　"Det")) {
	    var listDet = master.list[placeHold.innerHTML];
	    $(dom + "Det").innerHTML = "";
	    for (var i = 0; i < listDet.length; i ++) {
		    var newLi = document.createElement("li");
		    var newSpan = document.createElement("span");
		    var newD = document.createElement("div");
		    newD.className = "closeSig";
		    newLi.className = "sigMusic";
		    addEvent(newLi, 'click', function () {
		    	var self = this;
		    	musicInit(self);
		    });
		    addEvent(newD, 'click', function (e) {
		    	var list = master.list[$("#mcList .placeHold").innerHTML];
	            for (var x = 0; x　< list.length; x++) {
		            if(list[x].name == newLi.childNodes[1].innerHTML) {
			            var ms = new Object();
			            ms.uid = localStorage.getItem("user");
			            ms.id = list[x].id;
			            list.splice(x, 1);
			            ajax({
			            	method: "POST",
			            	url: "us/consumer/delM",
			            	data: ms,
			            	success: function (data) {
			            		addList("#mcList");
			            	}
			            });
		            }
	            }
	            e.stopPropagation();
		    })
		    addEvent(newLi, 'mouseover', function () {
		    	this.childNodes[0].style.display = "block";
		    });
		    addEvent(newLi, "mouseout", function () {
		    	this.childNodes[0].style.display = "none";
		    })
		    newSpan.innerHTML = listDet[i].name;
		    newD.innerHTML = "<img src='./img/close.png' />";
		    newLi.appendChild(newD);
		    newLi.appendChild(newSpan);
		    $(dom + "Det").appendChild(newLi);
	    }
	}
}


function timeJump() {
	var timeLine = $("#timeLine");
	addEvent(timeLine, 'click', function (e) {
		if (mc.duration !== 0) {
			mc.stop();
			var time = (e.clientX / pageControl.width) * mc.duration;
		    mc.currentTime = time;
		    mc.play(time);
		    console.log(mc.currentTime);
		}
	});
}

function randomMusic (list) {
	console.log(list);
	var random = Math.random() * list.length - 1;
	random = parseInt(random);
	if (list[random]) {
		pageControl.musicObj = list[random];
	    if (mc.active) {
		    mc.stop();
	    }
	    mc.load(pageControl.musicObj);
	    getBarrage(pageControl.musicObj.id);
	} else {
		alertBox(7);
	}
}

function preNext (flag) {
	var x = pageControl.mod.flag;
	var list;
	if (localStorage.getItem("user")) {
	    list = master.list[$("#mcList .placeHold").innerHTML];
	} else {
		list = Tourist;
	}
	switch (x) {
		case 0: {
			randomMusic(list);
			break;
		}
		case 1: {
			randomMusic(list);
			break;
		}
		default: {
			if (flag == 0) {
				pageControl.order ++;
			} else {
				pageControl.order --;
			}
			pageControl.musicObj.url = list[pageControl.order].src;
			if (mc.active) {
				mc.stop();
			}
	        mc.load(pageControl.musicObj);
	        getBarrage(pageControl.musicObj.id);
		}
	}
}

function musicControl () {
	var pre = $("#pre");
	var next = $("#next");
	var coreControl = $("#coreControl img");
	var music = $("#music");
	timeJump();
	addEvent(next, 'click', function () {
		preNext(0);
	});
	addEvent(pre, 'click', function () {
		preNext(1);
	})
	addEvent(coreControl, 'click', function () {
		if (mc.active) {
		    if (mc.paused) {
			    mc.play();
			    coreControl.src = "./img/play.png";
		    } else {
			    mc.stop();
			    coreControl.src = "./img/pause.png";
		    }
	    } else {
	    	alertBox(3);
	    }
	});

	addEvent(music, "mousewheel", function (e) {
		console.log(e.delta);
		if (e.delta < 0) {
			if (pageControl.volume > 0) {
				pageControl.volume --;
			}
		} else {
			pageControl.volume ++;
			if (pageControl.volume == 11) {
				pageControl.volume = 10;
			}
		}
		mc.changeVolume(pageControl.volume);
	});
}



var mc = new Music({
	size: 32,
	timeNow: $("#timeNow"),
	img: $("#musicPic img"),
	name: $("#musicName"),
	author: $("#musicAuthor"),
	love: $("#iLove img"),
	vilValue: $("#selectVilu"),
	onended: function () {
		$("#next").click();
	},
	visual: canvas
});



function visualSel() {
	var sel = $("#selectVilu");
	sel.dataValue = 0;
	addEvent(sel, 'click', function () {
		this.dataValue++;
		if (this.dataValue == 3) {
			this.dataValue = 0;
		}
		var m = this.childNodes[1];
		switch (this.dataValue) {
			case 0: {
				m.src = "./img/x.png";
				break;
			}
			case 1: {
				m.src = "./img/ball.png";
				break;
			}
			case 2: {
				m.src = "./img/rect.png";
				break;
			}
			default: break;
		}
	})
}



//弹幕
//
//
//
//

function barrage() {
	var bagIpt = $('#danmu');
	addEvent(bagIpt, 'keydown', function (e) {
		if (e.keyCode == 13) {
			var value = this.value;
			var font = {
				value: value,
				id: pageControl.musicObj.id,
				time: mc.currentTime,
				fontSize: master.fontSize,
				fontFamily: master.fontFamily,
				fontColor: master.fontColor,
				x: 0,
				y: 0
			};
			fonts.push(font);
			fontsRom(fonts, true);
			this.value = "";
			ajax({
				url: "/us/barrage/ist",
				method: 'POST',
				data: font,
				success: function (data) {
					console.log(data);
				}
			})
		}
	})
}

function getBarrage(id) {
	ajax({
		url: "/us/barrage/get",
		method: "POST",
		data: {id: id},
		success: function (data) {
			data = JSON.parse(data);
			fonts = data;
			fontsRom(fonts);
		}
	});
}

function romdBge(font) {
	var y = Math.random() * HEIGHT;
	if (y < font.fontSize) {
		y += font.fontSize;
	} else if (y > (HEIGHT - font.fontSize)) {
		y -= font.fontSize;
	}
	font.y = y;
	font.x = WIDTH;
	font.style = font.fontSize + "px " + font.fontFamily;
}
function fontsRom(font, judge) {
	if (judge) {
		romdBge(font[font.length - 1]);
	} else {
	    for (var i = 0; i < font.length; i++) {
	    	romdBge(font[i]);
	    }
    }
}



//登录注册
//
function reValue (dom) {
	if(dom.value) {
		return dom.value;
	} else {
		dom.style.boxShadow = "0 0 0 2px red";
		return 0;
	}
}

function signWorng(x) {
	var alert = $(".alertSign");
	switch (x) {
		case 0: {
			alert.innerHTML = "用户已存在";
			break;
		}
		case 1: {
			alert.innerHTML = "用户名或密码错误";
			break;
		}
		default: break;
	}
	alert.style.display = "block";
}

function getUserMusic(uid) {
	ajax({
		method: "POST",
		url: "us/consumer/getMusic",
		data:{uid:uid},
		success: function (data) {
			data = JSON.parse(data);
			if (data.status == 200) {
				for (var i = 0; i < data.result.length; i++) {
					var o = new Object();
					o.name = data.result[i].name;
					o.author = data.result[i].author;
					o.id = data.result[i].music_id;
					o.pic = data.result[i].pic;
					master.list[data.result[i].sort].push(o);
				}
			} else {
				console.log(data);
			}
		}
	})
}

function sign() {
	var up = $("#up");
	var sIn = $("#in");
	var sUp = $$(".sUp");
	var toSign = $("#toSign");
	var sClose = $("#closeSign");
	var verif = $("#verif");
	var sInput = $$(".signLine input");
	up.dataValue = 1;
	sIn.dataValue = 0;

	for (var j = 0; j < sInput.length; j++) {
		addEvent(sInput[j], 'focus', function () {
			this.style.boxShadow = "0 0 0 2px green";
		});
		addEvent(sInput[j], 'blur', function () {
			this.style.boxShadow = '';
		})
	}

	addEvent(toSign, 'click', function () {
		var ms = new Object();
		var flag = 1;
		var url = "/us/sign/sss";
		function xAjax(x) {
			if (x) {
			    ajax({
				    method: "POST",
				    data: ms,
				    url: url,
				    success: function (data) {
					    data = JSON.parse(data);
					    switch (data.status) {
					    	case 200: {
					    		window.localStorage.setItem("user", data.uid);
					    		master = data;
					    		pageInit(data);
					    		sClose.click();
					    		break;
					    	}
					    	case 400: {
					    		signWorng(0);
					    		break;
					    	}
					    	case 402: {
					    		signWorng(1);
					    		break;
					    	} 
					    	default: break;
					    }
				    }
			    })
	        } else {
	        	console.log("fuck");
	        }
		}
		if (up.dataValue) {
			ms.nick = reValue($("input[name='nick']"));
	        ms.email = reValue($("input[name='email']"));
	        if (ms.email.indexOf("@") == -1) {
	        	$("input[name='email']").style.boxShadow = "0 0 0 2px red";
	        	flag = 0;
	        }
		    ms.password = reValue($("input[name='passwordSign']"));
			url = "/us/sign/up";
			for (var key in ms) {
				if (!ms[key]) {
					flag = 0;
				}
			}
			xAjax(flag);
		} else if (sIn.dataValue) {
			ms.email = reValue($("input[name='email']"));
			ms.password = reValue($("input[name='passwordSign']"));
			url = "/us/sign/in";
			for (var key in ms) {
				if (!ms[key]) {
					flag = 0;
				}
			}
			xAjax(flag);
		}
	})

	addEvent(sClose, 'click', function () {
		$("#sign").style.display = "none";
	})
	addEvent(up, 'click', function () {
		sIn.style.background = "#a0e7f9";
		up.dataValue = 1;
		up.style.background = "#11e7ed";
		sIn.dataValue = 0;
		for(var i = 0; i < sUp.length; i++) {
			sUp[i].style.display = "block";
		}
	});
	addEvent(sIn, 'click', function () {
		up.style.background = "#a0e7f9";
		sIn.dataValue = 1;
		sIn.style.background = "#11e7ed";
		up.dataValue = 0;
		for(var i = 0; i < sUp.length; i++) {
			sUp[i].style.display = "none";
		}
	});
}


function alertBox(x) {
	var mengK = $("#mengK");
	var img = $("#logoBox img");
	var det = $("#alertDet");
	mengK.style.display = "block";
	switch (x) {
		case 1: {
			img.src = "./img/fail.png";
			det.innerHTML = "修改失败";
			break;
		}
		case 2: {
			img.src = "./img/su.png";
			det.innerHTML = "修改成功";
			break;
		}
		case 3: {
			img.src = "./img/fail.png";
			det.innerHTML = "请选歌";
			break;
		}
		case 4: {
			img.src = "./img/su.png";
			det.innerHTML = "创建成功";
			break;
		}
		case 5: {
			img.src = "./img/fail.png";
			det.innerHTML = "创建失败";
			break;
		}
		case 6: {
			img.src = "./img/fail.png";
			det.innerHTML = "该歌曲已添加";
			break;
		}
		case 7: {
			img.src = "./img/fail.png";
			det.innerHTML = "请为你的歌单添加歌曲";
			break;
		}
		default: break;
	}
}
function upImg(img) {
	var xhr = new XMLHttpRequest();
	var form = new FormData();
	xhr.onreadystatechange = function (e) {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                console.log(xhr.responseText);
            } else {
                console.log(xhr.error);
            }
        }
    }
	form.append("uid", localStorage.getItem("user"));
	form.append("file", img);
	xhr.open("POST", "us/consumer/img", true);
	xhr.setRequestHeader("If-Modified-Since", "0");
	xhr.send(form);
}

function masterMod() {
	var sercetCfm = $("#sercetCfm");
	var styleCfm = $("#styleCfm");

	addEvent(styleCfm, "click", function () {
		var ms = new Object();
		ms.uid = localStorage.getItem("user");
		ms.fontSize = parseInt($("#fontSizeDet").value);
		ms.fontColor = $("#fontColorDet").value;
		ms.fontFamily = $("#fontFamily .placeHold").innerHTML;
		ms.status = 2;
		ajax({
			method: "POST",
			url: "us/consumer/upInfo",
			data: ms,
			success: function (data) {
				data = JSON.parse(data);
				alertBox(2);
			},
			error: function (err) {
				alertBox(1);
			}
		});
	})

	addEvent(sercetCfm, 'click', function () {
		var msB = new Object();
		var ms = new Object();
		var nameSet = $("#nameSet");
		var passwordLast = $("#passwordLast");
		var passwordNew = $("#passwordNew");
		ms.uid = localStorage.getItem("user");
		msB.nick = reValue(nameSet);
		msB.lastP = reValue(passwordLast);
		msB.password = reValue(passwordNew);
		for (var key in msB) {
			if (msB[key]) {
				ms[key] = msB[key];
			}
		}
		ms.status = 1;
		ms.uid = window.localStorage.getItem("user");
		if ($("#headSet input[type='file']").files[0]) {
			upImg($("#headSet input[type='file']").files[0]);
		}
		ajax({
			method: "POST",
			url: "us/consumer/upMaster",
			data: ms,
			success: function (data) {
				data = JSON.parse(data);
				nameSet.style.boxShadow = "none";
				nameSet.placeholder = master.nick;
				passwordLast.style.boxShadow = "none";
				passwordLast.value = "";
				passwordNew.style.boxShadow = "none";
				passwordNew.value = "";
				getMaster();
				alertBox(2);
			},
			error: function (err) {
				alertBox(1);
			}
		});
	});
}


function getMaster () {
	if(localStorage.getItem("user")) {
    	ajax({
	        method: "POST",
	        url: "/us/sign/get",
	        data: {
		        uid: window.localStorage.getItem("user")
	        },
	        async: true,
	        success: function (data) {
		        console.log(data);
		        data = JSON.parse(data);
		        pageInit(data);
	        },
	        error: function (data) {
		    console.log(data);
	        }
        });
    } else {
    	ajax({
    		method: "POST",
    		url: "api/top",
    		data: {idx: 1},
    		async: true,
    		success: function (data) {
    			data = JSON.parse(data).result.tracks; 
    			for (var i = 0; i < data.length; i++) {
    				var o = new Object();
    				o.name = data[i].name;
				    o.id = data[i].id;
				    o.pic = data[i].album.picUrl;
				    o.author = data[i].artists[0].name;
				    Tourist.push(o);
    			}
    			mc.load(Tourist[0]);
    			console.log(data);
    		}
    	});
    }
}

function getUser(uid, x) {
	ajax({
		method: "POST",
		url: "us/consumer/getUser",
		data: {uid: uid},
		success: function (data) {
			data = JSON.parse(data)[0];
			var parent, friends, friendPic, picImg, friendNick, core, coreImg, url;
			friends = createDiv("friend");
			friendPic = createDiv("friendPic");
			picImg = document.createElement("img");
			friendNick = createDiv("friendNick");
			coreImg = document.createElement("img");
			picImg.src = data.head;
			friendPic.appendChild(picImg);
			friends.setAttribute("data-value", data.uid);
			friendNick.innerHTML = data.nick;
			switch (x) {
				case 1: {
					parent = $("#online");
					core = createDiv("addFriend");
					coreImg.src = "./img/new.png";
					core.appendChild(coreImg);
					url = "us/consumer/addFriend";
					break;
				}
				case 2: {
					if ($(".friend[data-value='" + data.uid + "']")) {
					    $(".friend[data-value='" + data.uid + "']").style.display = "none";
				    }
					parent = $("#myFriend");
					core = createDiv("delFriend");
					coreImg.src = "./img/x.png";
					core.appendChild(coreImg);
					url = "us/consumer/delFriend";
					break;
				}
				default: break;
			}
			addEvent(core, "click", function () {
				if ($(".friend[data-value='" + data.uid + "']")) {
					$(".friend[data-value='" + data.uid + "']").style.display = "none";
				}
		        var value = this.dataValue;
		        ajax({
			        method: "POST",
			        url: url,
			        data: {
				        masterU: localStorage.getItem("user"),
				        friendU: value
			        },
			        success: function (data) {
				        data = JSON.parse(data);
				        if (x == 1) {
				        	getUser(value, 2);
				        }
			        }
		        });
			})
			core.dataValue = data.uid;
			friends.appendChild(friendPic);
			friends.appendChild(friendNick);
			friends.appendChild(core);
			addEvent(friends, "mouseover", function () {
				this.childNodes[2].style.display = "flex";
			});
			addEvent(friends, "mouseout", function () {
				this.childNodes[2].style.display = "none";
			});
			parent.appendChild(friends);
		}
	})
} 

function friend() {
	ajax({
		method: "POST",
		url: "us/consumer/getAll",
		success: function (data) {
			data = JSON.parse(data);
			for (var i = 0; i < data.length; i++) {
				if (data[i].uid != localStorage.getItem("user")) {
					getUser(data[i].uid, 1);
				}
			}
		}
	});
	ajax({
		method: "POST",
		url: "us/consumer/getFriend",
		data: {uid: localStorage.getItem("user")},
		success: function (data) {
			data = JSON.parse(data);
			if (data.length) {
				for (var i = 0; i < data.length; i++) {
					getUser(data[i].friendU, 2);
				}
			}
		}
	});
}

function start() {
    musicControl();
    pageChange();
    visualSel();
    masterMod();
    searchGroup();
    barrage();
    sign();

    getMaster();

    friend();

}
start();

window.onerror = function (message) {
	alert(message);
}