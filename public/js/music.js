/*
* @Author: 10261
* @Date:   2017-03-06 21:25:57
* @Last Modified by:   10261
* @Last Modified time: 2017-04-26 22:42:49
*/

'use strict';
// var fonts = [{
// 	value: "重邮小傻逼",
// 	fontSize: "50px sans-serif",
// 	fontColor: "#000",
// 	x: WIDTH,
// 	time: 15,
// 	y: Math.random() * HEIGHT - 1
// }]
var fonts = [];
function Music(option) {

	//tag = 1，表示执行可视化，为0表示不执行可视化
	this.tag = 1;

	this.audio = new Audio();
	this.audio.addEventListener("ended", function () {
		option.onended();
	});
	this.audio.volume = 0.5;

	this.info = {
		img: option.img,
		name: option.name,
		author: option.author,
		love: option.love
	};

	//this.vilValue.dataValue表示可视化方案  0：不执行可视化 1 圆形  2 柱形
	//不执行可视化时，采用Dom audio 模式
	//执行可视化时，采用web audio api封装的模式
	this.vilValue = option.vilValue;

	this.timeNow = option.timeNow || null;

	this.analyser = Music.ac.createAnalyser();

	this.source = null;

	this.buffer = [];

	this.count = 0;

	this.paused = false;

	this.size = option.size;

	this.onended = option.onended;

	this.analyser.fftSize = this.size * 2;

	this.gainNode = Music.ac[Music.ac.createGain ? "createGain" : "createGainNode"]();
	this.gainNode.gain.value = 10;

	this.gainNode.connect(Music.ac.destination);

	this.analyser.connect(this.gainNode);

	this.startTime = 0;

	this.currentTime = 0;

	this.duration = 0;

	this.staticTime = 0;

	this.visual = option.visual;

	this.xhr = new window.XMLHttpRequest();

	this.visualize();
}
Music.ac = new (window.AudioContext||window.webkitAudioContext)();

Music.prototype.load = function (obj) {
	var self = this;
	var list = master.list;
	var x = false;
	obj.parse = 1;
	for (var key in list) {
		var m = list[key];
		for (var i = 0; i < m.length; i++) {
			if (m[i].id === obj.id) {
				x = true;
			}
		}
	}
	if (x) {
		self.info.love.src = "./img/iLove.png";
	} else {
		self.info.love.src = "./img/love.png";
	}
	self.info.img.src = obj.pic;
	self.info.name.innerHTML = obj.name;
	self.info.author.innerHTML = obj.author;

	//以上为信息配置，下面为ajax配置
	

	self.xhr.abort();
	self.xhr.open("POST", "/api/musicUrl", true);
	if (self.vilValue.dataValue == 0) {
		obj.parse = 0;
		self.tag = 0;
		self.xhr.responseType = "text";
		self.xhr.onload = function () {
			self.audio.src = JSON.parse(self.xhr.response).data[0].url;
			self.startTime = 0;
			self.staticTime = 0;
			self.currentTime = 0;
			self.duration = self.audio.duration;
			console.log(self.audio.duration);
			console.log(self.audio.currentTime);
			self.audio.play();
		}
	} else {
		self.tag = 1;
		self.xhr.responseType = "arraybuffer";
		self.xhr.onload = function () {
			self.startTime = 0;
			self.staticTime = 0;
			self.currentTime = 0;
			self.duration = 0;
			self.decode(self.xhr.response);
		}
	}
	self.xhr.setRequestHeader("Content-type", 'application/x-www-form-urlencoded');
	if (typeof obj === 'object') {
		var str = '';
		for (var key in obj) {
			str += key + '=' + obj[key] + '&';
		}
		obj = str.substring(0, str.length - 1);
	}
	self.xhr.send(obj);
}

Music.prototype.decode = function (arraybuffer) {
	var self = this;
	var n = ++this.count;
	this.source && this.stop();
	Music.ac.decodeAudioData(arraybuffer, function (buffer) {
		if (n != self.count) return;
		var bufferSource = Music.ac.createBufferSource();
		bufferSource.buffer = buffer;
		bufferSource.connect(self.analyser);
		bufferSource[bufferSource.start ? "start" : "noteOn"](0);

		self.paused = false;
		self.startTime = new Date();
		self.startTime = self.startTime.getTime();
		self.source = bufferSource;
		self.source.onended = self.onended;
		self.buffer = buffer;
		self.duration = buffer.duration;
	}, function (err) {
		console.log(err);
	})
}

Music.prototype.ret = function () {
	var bs = Music.ac.createBufferSource();
	bs.buffer = this.buffer;
	bs.connect(this.analyser);
	this.source = bs;
}

Music.prototype.play = function (num) {
	var self = this;
	if (this.tag == 0) {
		if (num) {
			this.audio.currentTime = num;
			this.currentTime = num;
		}
		this.audio.play();
		this.paused = this.audio.paused;
	} else {
		var time;
		self.ret();
	    if (num === undefined) {
		    time = self.currentTime;
	    } else {
		    time = num;
	    }
	    console.log(self.currentTime, self.duration);
	    self.source[self.source.start ? "start" : "noteOn"](0, time, self.duration);
	    self.startTime = new Date();
	    self.startTime = self.startTime.getTime();
	    self.staticTime = self.currentTime;
	    self.paused = false;
	    self.source.onended = self.onended;
    }
}
Music.prototype.stop = function () {
	var self = this;
	if (this.tag == 0) {
		this.audio.pause();
		this.paused = this.audio.paused;
	} else {
	    self.source[self.source.stop ? "stop" : "noteOff"]();
	    self.source.onended = undefined;
	    self.paused = true;
    }
}
Music.prototype.changeVolume = function (num) {
	if (this.tag == 0) {
		this.audio.volume = num * num * 0.01;
	} else {
	    this.gainNode.gain.value = num * num * 0.25;
	    console.log(this.gainNode.gain.value);
	}
}
Music.prototype.visualize = function () {
	var arr = new Uint8Array(this.analyser.frequencyBinCount);
	var self = this;

	function v () {
		self.visual.clear();
		if (self.tag) {
		    self.analyser.getByteFrequencyData(arr);
		    if (self.vilValue.dataValue == 1) {
			    self.visual.ball(arr);
		    } else if(self.vilValue.dataValue == 2) {
			    self.visual.rect(arr);
		    }
		    if (!self.paused) self.getCurrentTime();
	    } else {
			self.currentTime = self.audio.currentTime;
			self.duration = self.audio.duration;
		}
	    self.visual.boom(fonts, self);
		self.timeNow.style.width = (self.currentTime / self.duration) * 100 + "%";
		requestAnimationFrame(v);
	}

	requestAnimationFrame(v);
}

Music.prototype.getCurrentTime = function () {
	var now = new Date();
	now = now.getTime();
	var watch =(now - this.startTime) / 1000;
	this.currentTime = this.staticTime + watch;
}
