/*
* @Author: 10261
* @Date:   2017-03-06 21:25:57
* @Last Modified by:   10261
* @Last Modified time: 2017-03-10 22:42:42
*/

'use strict';
function Music(option) {
	this.source = null;

	this.buffer = [];

	this.count = 0;

	this.paused = false;

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

	//this.visual = option.visual;

	this.visualize();
}
Music.ac = new (window.AudioContext||window.webkitAudioContext)();

Music.prototype.load = function (obj) {
	var self = this;
	ajax({
		url: obj.path,
		method: "POST",
		responseType: "arraybuffer",
		data: obj,
		load: function (data) {
			self.startTime = 0;
			self.currentTime = 0;
			self.duration = 0;
			self.staticTime = 0;
			self.decode(data);
		}
	});
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
	this.gainNode.gain.value = num * num * 0.01;
	console.log(this.gainNode.gain.value);
}
Music.prototype.visualize = function () {
	var arr = new Uint8Array(this.analyser.frequencyBinCount);
	var self = this;

	function v () {
		self.analyser.getByteFrequencyData(arr);
		//self.visual(arr);
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


