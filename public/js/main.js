/*
* @Author: 10261
* @Date:   2017-02-23 17:22:24
* @Last Modified by:   10261
* @Last Modified time: 2017-04-21 00:17:19
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
var master;
// var master = {//测试
// 	name: "zxy", 
// 	pic: "data:asdasdasdadad",
// 	id: 1,
// 	font: {
// 		size: 20,
// 		color: "#333",
// 		family: "苹果斜体"
// 	},
// 	canvas: "炫彩音阶",
// 	list: {
// 		love: [{
// 			name: 'a',
// 			author: 'aaa',
// 			pic: './img/del.png',
// 			src: 'http://m2.music.126.net/nJ45UVWz0VJfh_yrNVR6MQ==/3402988503925654.mp3',
// 			lrc: 'xsddds',
// 		},{
// 			name: 'b',
// 			author: "sdsd",
// 			pic: './img/del.png',
// 			src: 'http://m2.music.126.net/h5sli9SrGADPLn-JSMyfIg==/3420580731402332.mp3',
// 			lrc: 'xsddds',
// 		},{
// 			name: 'c',
// 			author: 'xxaas',
// 			pic: './img/del.png',
// 			src: 'http://m2.music.126.net/DMGuG62iX4w-aAmTnHzkcQ==/3250156389859817.mp3',
// 			lrc: 'xsddds',
// 		},{
// 			name: 'd',
// 			author: 'xxaas',
// 			pic: './img/del.png',
// 			src: 'http://m2.music.126.net/eAT6BEj_mz1Y5W-APFXRsw==/3433774824121252.mp3',
// 			lrc: 'xsddds',
// 		}]
// 	}
// }

var musicVl = ["炫彩音阶", "梦幻气泡"];
var fontFamily = ["微软雅黑", "苹果斜体"];

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
	console.log(master);
	$("#masterPic img").src = m.pic;
	$("#userHeadBox img").src = m.pic;
	$("#nameSet").placeholder = m.name;
	$("#masterName").innerHTML = m.name;
	musicListSelect("#mcList", m.list);
	mc.load(master.list.love[22]);
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
	for (var key in list) {
		var newLi = document.createElement('li');
		placeHold.innerHTML = key;
		newLi.innerHTML = key;
		$(dom + " ul").appendChild(newLi);
	}
	addList(dom);
	var lis = $$(dom + " li");
	lis.forEach(function (li) {
		addEvent(li, 'click', function() {
			placeHold.innerHTML = this.innerHTML;
			addList(dom);
		})
	});
}
function clearWidth () {
	$("#music").style.width = "100%";
	$("#musicListBox").style.width = "0";
	$("#userSettingBox").style.width = "0";
	$("#friendListBox").style.width = "0";
}

function calW(dom) {
	addEvent($(dom), 'click', function () {
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

function selectGroup () {
	moreSelect("#musicVisualDet", musicVl);
	moreSelect("#fontFamilyDet", fontFamily);
}


function pageChange () {

    var back = $$(".back");
    back.forEach(function(b) {
    	addEvent(b, 'click', function () {
    		clearWidth();
    		pageControl.pageFlag = 0;
    	})
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
		var meL = $(".meList")
		meL.innerHTML = '';
		for (var key in master.list) {
			var newLi = document.createElement("li");
			newLi.innerHTML = key;
			addEvent(newLi, 'click', function() {
				master.list[this.innerHTML].push(pageControl.musicObj);
				$(".meList").style.display = "none";
				console.log(master.list[this.innerHTML]);
			});
			meL.appendChild(newLi);
		}
		meL.style.display = "block";
	});

    addEvent($("#newList"), "click", function () {
    	$(".new").style.display = "block";
    });

    addEvent($(".confirmBox .no"), 'click', function () {
    	$(".new").style.display = "none";
    })

    calW("#musicList");
	calW("#userSetting");
	calW("#friendList");
	selectGroup();
	choiceMod();

}


//音乐控制


function musicInit(dom) {
	var list = master.list[$("#mcList .placeHold").innerHTML];
	list.forEach(function (x) {
		if (dom.childNodes[0].innerHTML == x.name) {
			pageControl.musicObj = x;
		}
	});
	mc.stop();
	mc.load(pageControl.musicObj);
}

function addList(dom) {
	var placeHold = $(dom + " .placeHold");
	if ($(dom +　"Det")) {
	    var listDet = master.list[placeHold.innerHTML];
	    console.log(master);
	    console.log(listDet);
	    $(dom + "Det").innerHTML = "";
	    for (var i = 0; i < listDet.length; i ++) {
		    var newLi = document.createElement("li");
		    var newSpan = document.createElement("span");
		    newLi.className = "sigMusic";
		    addEvent(newLi, 'click', function () {
		    	var self = this;
		    	musicInit(self);
		    })
		    newSpan.innerHTML = listDet[i].name;
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
		    console.log(mc.currentTime / mc.duration);
		}
	});
}

function randomMusic (list) {
	var random = Math.random() * list.length - 1;
	random = parseInt(random);
	pageControl.musicObj = list[random];
	mc.stop();
	mc.load(pageControl.musicObj);
}

function preNext (flag) {
	var x = pageControl.mod.flag;
	var list = master.list[$("#mcList .placeHold").innerHTML];
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
			mc.stop();
	        mc.load(pageControl.musicObj);
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
		if (mc.paused) {
			mc.play();
			coreControl.src = "./img/play.png";
		} else {
			mc.stop();
			coreControl.src = "./img/pause.png";
		}
	});

	addEvent(music, "mousewheel", function (e) {
		console.log(e.delta);
		if (e.delta < 0) {
			if (pageControl.volume >= 0) {
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
	onended: function () {
		$("#next").click();
	},
	visual: vil
});
ajax({
	method: "GET",
	url: "/user",
	async: true,
	success: function (data) {
		data = JSON.parse(data);
		pageInit(data);
	},
	error: function (data) {
		console.log(data);
	}
});
function start() {
    musicControl();
    pageChange();
    searchGroup();
}
start();

function searchGroup() {
	var searchIpt = $("input[name=search]");
	var go = $("#go");
	addEvent(searchIpt, "keydown", function (e) {
		if (e.keyCode == 13) {
			search(searchIpt.value);
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
			console.log(data);
			data = JSON.parse(data);
			var result = $("#result");
			for (var i = 0; i < data.length; i++) {
				var see = createDiv("see");
				var sPic = createDiv("sPic");
				var info = createDiv("info");
				var infoName = createDiv("infoName");
				var infoAuthor = createDiv("infoAuthor");
				var ig = document.createElement("img");
				ig.src = data[i].pic;
				see.dataValue = data[i].id;
				infoName.innerHTML = data[i].name;
				infoAuthor.innerHTML = data[i].author;
				info.appendChild(infoName);
				info.appendChild(infoAuthor);
				sPic.appendChild(ig);
				see.appendChild(sPic);
				see.appendChild(info);
				result.append(see);
			}
		},
		error: function (err) {
			console.log(err);
		}
	})
}

