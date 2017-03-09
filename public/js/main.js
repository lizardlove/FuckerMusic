/*
* @Author: 10261
* @Date:   2017-02-23 17:22:24
* @Last Modified by:   10261
* @Last Modified time: 2017-03-09 22:41:11
*/

'use strict';

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

var master = {
	list: {
		love: ["xxx","xsdsaf","xsdasaa","sadasfaf"],
		R: ["xxx","xsdsaf","xsdasaa","sadasfaf", "xxx","xsdsaf","xsdasaa","sadasfaf"]

	}
}

var _width = document.getElementsByTagName('html')[0].clientWidth;
var musicVl = ["炫彩音阶", "梦幻气泡"];
var fontFamily = ["微软雅黑", "苹果斜体"];

var pageControl = {
	pageFlag: 0,
	modifyFlag: 0,
	mod: {
		flag: 0,
		det: ["随机播放", "单曲循环", "顺序播放", "列表循环"]
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

function addList(dom) {
	var placeHold = $(dom + " .placeHold");
	if ($(dom +　"Det")) {
	    var listDet = master.list[placeHold.innerHTML];
	    $(dom + "Det").innerHTML = "";
	    for (var i = 0; i < listDet.length; i ++) {
		    var newLi = document.createElement("li");
		    var newSpan = document.createElement("span");
		    newLi.className = "sigMusic";
		    newSpan.innerHTML = listDet[i];
		    newLi.appendChild(newSpan);
		    $(dom + "Det").appendChild(newLi);
	    }
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

function calW(dom) {
	addEvent($(dom), 'click', function () {
		if (pageControl.pageFlag == 0) {
			$(dom + "Box").style.width = "350px";
			$("#music").style.width = "calc(100% - 350px)";
			pageControl.pageFlag ++;
		} else if (pageControl.pageFlag == 1) {
			clearWidth();
			pageControl.pageFlag = 0;
		}
	});
}

function clearWidth () {
	$("#music").style.width = "100%";
	$("#musicListBox").style.width = "0";
	$("#userSettingBox").style.width = "0";
	$("#friendListBox").style.width = "0";
}

function choiceMod () {
	var choice = $("#choiceMod span");
	choice.innerHTML = pageControl.mod.det[pageControl.mod.flag];
	addEvent(choice, 'click', function () {
		pageControl.mod.flag++;
		if(pageControl.mod.flag == 4) {
			pageControl.mod.flag = 0;
		}
		choice.innerHTML = pageControl.mod.det[pageControl.mod.flag];
	})
}

function modifyAround (stateOne, stateTwo) {
	$(".lastUserMod").style.display = stateOne;
	var userMod = $$(".userMod");
	userMod.forEach(function (l) {
		l.style.display = stateTwo;
	});
}

function pageChange () {
	
	var modify = $("#modify");
	addEvent(modify, function () {
		if (pageControl.modifyFlag == 0) {
			modifyAround("none", "inline-block");
			pageControl.modifyFlag ++;
		} else {
			modifyAround("block", "none");
			pageControl.modifyFlag = 0;
		}
	});

	calW("#musicList");
	calW("#userSetting");
	calW("#friendList");

	choiceMod();

}

function selectGroup () {
	musicListSelect("#mcList", master.list);
	moreSelect("#musicVisualDet", musicVl);
	moreSelect("#fontFamilyDet", fontFamily);
}

function timeJump() {
	var timeLine = $("#timeLine");
	addEvent(timeLine, 'click', function (e) {
		if (mc.duration !== 0) {
			mc.stop();
			var time = (e.clientX / _width) * mc.duration;
		    mc.currentTime = time;
		    mc.play(time);
		    console.log(mc.currentTime / mc.duration);
		}
	});
}

function start() {
    timeJump();
    musicControl();
    selectGroup();
    pageChange();
}
start();

function musicControl () {
	var pre = $("#pre");
	var next = $("#next");
	var coreControl = $("#coreControl");
	var music = $("#music");
}

var mc = new Music({
	size: 16,
	timeNow: $("#timeNow"),
	visual: function(){
		//这里实现可视化的详细操作
	}
});
mc.load({
	path: '/api',
	url: "http://m2.music.126.net/nJ45UVWz0VJfh_yrNVR6MQ==/3402988503925654.mp3"
});





//滚轮控制事件 -- 待兼容
// $("#music").addEventListener("mousewheel", function (e) {
// 	if (e.wheelDelta < 0) {
// 		volume --;
// 	} else {
// 		volume ++;
// 	}
// 	changeVolume(volume);
// })