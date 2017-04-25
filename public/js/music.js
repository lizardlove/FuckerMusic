/*
* @Author: 10261
* @Date:   2017-03-06 21:25:57
* @Last Modified by:   10261
* @Last Modified time: 2017-04-25 22:58:28
*/

'use strict';
var fonts = [{
	value: "重邮小傻逼",
	fontSize: "50px sans-serif",
	fontColor: "#000",
	x: WIDTH,
	time: 15,
	y: Math.random() * HEIGHT - 1
}]
function Music(option) {
	this.source = null;

	this.buffer = [];

	this.count = 0;

	this.paused = false;

	this.info = {
		img: option.img,
		name: option.name,
		author: option.author,
		love: option.love
	};

	this.vilValue = option.vilValue;

	this.timeNow = option.timeNow || null;

	this.analyser = Music.ac.createAnalyser();

	this.size = option.size;

	this.onended = option.onended;

	this.analyser.fftSize = this.size * 2;

	this.gainNode = Music.ac[Music.ac.createGain ? "createGain" : "createGainNode"]();

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
	if (typeof obj === 'object') {
		var str = '';
		for (var key in obj) {
			str += key + '=' + obj[key] + '&';
		}
		obj = str.substring(0, str.length - 1);
	}
	self.xhr.abort();
	self.xhr.responseType = "arraybuffer";
	self.xhr.open("POST", "/music", true);
	self.xhr.onload = function () {
		self.startTime = 0;
		self.currentTime = 0;
		self.duration = 0;
		self.staticTime = 0;
		self.decode(self.xhr.response);
	}
	self.xhr.setRequestHeader("Content-type", 'application/x-www-form-urlencoded');
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
	var time;
	this.ret();
	if (num === undefined) {
		time = this.currentTime;
	} else {
		time = num;
	}
	this.source[this.source.start ? "start" : "noteOn"](0, time, mc.duration);
	this.startTime = new Date();
	this.startTime = this.startTime.getTime();
	this.staticTime = this.currentTime;
	this.paused = false;
	this.source.onended = this.onended;
}
Music.prototype.stop = function () {
	this.source[this.source.stop ? "stop" : "noteOff"]();
	this.source.onended = undefined;
	this.paused = true;
}
Music.prototype.changeVolume = function (num) {
	this.gainNode.gain.value = num * num * 0.25;
	console.log(this.gainNode.gain.value);
}
Music.prototype.visualize = function () {
	var arr = new Uint8Array(this.analyser.frequencyBinCount);
	var self = this;

	function v () {
		self.analyser.getByteFrequencyData(arr);
		self.visual.clear();
		if (self.vilValue.dataValue == 1) {
			self.visual.ball(arr);
			self.visual.boom(fonts, self);
		} else if(self.vilValue.dataValue == 2) {
			self.visual.rect(arr);
			self.visual.boom(fonts, self);
		} else {
			self.visual.boom(fonts, self);
		}
		if (!self.paused) {
			self.getCurrentTime();
			if (self.timeNow !== null) {
			    self.timeNow.style.width = (self.currentTime / self.duration) * 100 + "%";
			}
		}
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
