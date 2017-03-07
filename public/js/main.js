/*
* @Author: 10261
* @Date:   2017-02-23 17:22:24
* @Last Modified by:   10261
* @Last Modified time: 2017-03-07 21:41:50
*/

'use strict';
function $(dom) {
	return document.querySelector(dom);
};

function $$(dom) {
	return document.querySelectorAll(dom);
}

var master = {
	list: {
		love: ["xxx","xsdsaf","xsdasaa","sadasfaf"],
		R: ["xxx","xsdsaf","xsdasaa","sadasfaf", "xxx","xsdsaf","xsdasaa","sadasfaf"]

	}
}

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
		li.addEventListener('click', function () {
			placeHold.innerHTML = this.innerHTML;
			addList(dom);
		});
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
		newLi.addEventListener('click', function () {
			placeHold.innerHTML = this.innerHTML;
		});
		$(dom + " ul").appendChild(newLi);
	}
}

function calW(dom) {
	$(dom).addEventListener("click", function () {
		if (pageControl.pageFlag == 0) {
			$(dom + "Box").style.width = "350px";
			$("#music").style.width = "calc(100% - 350px)";
			pageControl.pageFlag ++;
		} else if (pageControl.pageFlag == 1) {
			clearWidth();
			pageControl.pageFlag = 0;
		}
	})
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
	choice.addEventListener('click', function () {
		pageControl.mod.flag++;
		if(pageControl.mod.flag == 4) {
			pageControl.mod.flag = 0;
		}
		choice.innerHTML = pageControl.mod.det[pageControl.mod.flag];
	});
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
	modify.addEventListener('click', function () {
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


function start() {
    selectGroup();
    pageChange();
}
start();


var ac = new window.AudioContext();
function ajax(opts){
     var defaults = {    
             method: 'GET',
                url: '',
               data: '',        
              async: true,
              cache: true,
        contentType: 'application/x-www-form-urlencoded',
            success: function (){},
               load: function (){},
              error: function (){}
         };    
  
     for(var key in opts){
         defaults[key] = opts[key];
     }
 
     if(typeof defaults.data === 'object'){    //处理 data
         var str = '';
         for(var key in defaults.data){
             str += key + '=' + defaults.data[key] + '&';
         }
         defaults.data = str.substring(0, str.length - 1);
     }
 
     defaults.method = defaults.method.toUpperCase();    //处理 method
 
     defaults.cache = defaults.cache ? '' : '&' + new Date().getTime() ;//处理 cache
 
     if(defaults.method === 'GET' && (defaults.data || defaults.cache))    defaults.url += '?' + defaults.data + defaults.cache;    //处理 url    
     


     //1.创建ajax对象
     var oXhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
     oXhr.responseType = "arraybuffer";
     //2.和服务器建立联系，告诉服务器你要取什么文件
     oXhr.open(defaults.method, defaults.url, defaults.async);
     oXhr.onload = function () {
     	ac.decodeAudioData(oXhr.response, function (buffer) {
			var bufferSource = ac.createBufferSource();
			bufferSource.buffer = buffer;
			bufferSource.connect(ac.destination);
			bufferSource[bufferSource.start?"start":"noteOn"](0);
		}, function(err){
			console.log(err);
		});
     }
     //3.发送请求
     if(defaults.method === 'GET')    
         oXhr.send(null);
     else{
         oXhr.setRequestHeader("Content-type", defaults.contentType);
         oXhr.send(defaults.data);
     }    
     //4.等待服务器回应
     oXhr.onreadystatechange = function (){
         if(oXhr.readyState === 4){
             if(oXhr.status === 200)
                 {console.log("OK");
                 defaults.success.call(oXhr, oXhr.responseText);}
             else {
                 defaults.error();
             }
         }
     };
 }
 ajax({
 	method: "POST",
 	url: '/api',
 	ajax: {
 		path: '/api',
 		url: "http://m2.music.126.net/h5sli9SrGADPLn-JSMyfIg==/3420580731402332.mp3"
 	}
 })