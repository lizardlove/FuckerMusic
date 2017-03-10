/*
* @Author: 10261
* @Date:   2017-02-23 17:22:24
* @Last Modified by:   10261
* @Last Modified time: 2017-03-11 00:13:55
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

var master = {//测试
	name: "zxy", 
	pic: "data:asdasdasdadad",
	id: 1,
	font: {
		size: 20,
		color: "#333",
		family: "苹果斜体"
	},
	canvas: "炫彩音阶",
	list: {
		love: [{
			name: 'a',
			author: 'xxaas',
			pic: 'xxdad',
			src: 'http://m2.music.126.net/nJ45UVWz0VJfh_yrNVR6MQ==/3402988503925654.mp3',
			lrc: 'xsddds',
		},{
			name: 'b',
			author: 'xxaas',
			pic: 'xxdad',
			src: 'http://m2.music.126.net/h5sli9SrGADPLn-JSMyfIg==/3420580731402332.mp3',
			lrc: 'xsddds',
		},{
			name: 'c',
			author: 'xxaas',
			pic: 'xxdad',
			src: 'http://m2.music.126.net/DMGuG62iX4w-aAmTnHzkcQ==/3250156389859817.mp3',
			lrc: 'xsddds',
		},{
			name: 'd',
			author: 'xxaas',
			pic: 'xxdad',
			src: 'http://m2.music.126.net/eAT6BEj_mz1Y5W-APFXRsw==/3433774824121252.mp3',
			lrc: 'xsddds',
		}]
	}
}

var _width = document.getElementsByTagName('html')[0].clientWidth;
var musicVl = ["炫彩音阶", "梦幻气泡"];
var fontFamily = ["微软雅黑", "苹果斜体"];

var pageControl = {
	pageFlag: 0,
	modifyFlag: 0,
	volume: 0,
	order: 0,
	musicObj: {
		path: '/api',
		url: ''
	},
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
		    addEvent(newLi, 'click', function () {
		    	var list = master.list[$("#mcList .placeHold").innerHTML];
		    	var self = this;
		    	console.log(self.childNodes[0].innerHTML);
		    	list.forEach(function (x) {
		    		
		    		if (self.childNodes[0].innerHTML == x.name) {
		    			pageControl.musicObj.url = x.src;
		    		}
		    	})
		    	mc.stop();
		    	mc.load(pageControl.musicObj);
		    })
		    newSpan.innerHTML = listDet[i].name;
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
	var coreControl = $("#coreControl");
	var music = $("#music");
	addEvent(next, 'click', function () {
		preNext(0);
	});
	addEvent(pre, 'click', function () {
		preNext(1);
	})
	addEvent(coreControl, 'click', function () {
		if (mc.paused) {
			mc.play();
			coreControl.childNodes[1].className = "pause";
		} else {
			mc.stop();
			coreControl.childNodes[1].className = "start";
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

function randomMusic (list) {
	var random = Math.random() * list.length - 1;
	random = parseInt(random);
	pageControl.musicObj.url = list[random].src;
	mc.stop();
	mc.load(pageControl.musicObj);
}

var mc = new Music({
	size: 16,
	timeNow: $("#timeNow"),
	onended: function () {
		var list = master.list[$("#mcList .placeHold").innerHTML];
		switch (pageControl.mod.flag) {
			case 0: {
	            var random = Math.random() * list.length - 1;
	            random = parseInt(random);
	            pageControl.order = random;
	            pageControl.musicObj.url = list[random].src;
	            mc.load(pageControl.musicObj);
	            break;
			}
			case 1: {
	            pageControl.musicObj.url = list[pageControl.order].src;
				mc.load(pageControl.musicObj);
				break;
			}
			default: {
				pageControl.order ++;
				pageControl.musicObj.url = list[pageControl.order].src;
				mc.load(pageControl.musicObj);
				break;
			}
		}
	},
	visual: function(){
		//这里实现可视化的详细操作
	}
});
mc.load({
	path: '/api',
	url: "http://m2.music.126.net/nJ45UVWz0VJfh_yrNVR6MQ==/3402988503925654.mp3"
});
