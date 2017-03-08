/*
* @Author: 10261
* @Date:   2017-03-06 21:25:57
* @Last Modified by:   10261
* @Last Modified time: 2017-03-08 19:59:53
*/

'use strict';
function Music(option) {
	this.source = null;

	this.buffer = [];

	this.count = 0;

	this.analyser = Music.ac.createAnalyser();

	this.size = option.size;

	this.analyser.fftSize = this.size * 2;

	this.gainNode = Music.ac[Music.ac.createGain ? "createGain" : "createGainNode"]();

	this.gainNode.connect(Music.ac.destination);

	this.analyser.connect(this.gainNode);

	this.currentTime = 0;

	this.duration = 0;

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
		self.buffer = buffer;
		self.duration = buffer.duration;
		bufferSource.connect(self.analyser);
		bufferSource[bufferSource.start ? "start" : "noteOn"](0);
		self.source = bufferSource;
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
	console.log(time);
	this.source[this.source.start ? "start" : "noteOn"](0, time, mc.duration);
}
Music.prototype.stop = function () {
	this.source[this.source.stop ? "stop" : "noteOff"]();
	this.currentTime = Music.ac.currentTime;
}
Music.prototype.changeVolume = function (num) {
	this.gainNode.gain.value = num * num * 0.01;
}
Music.prototype.visualize = function () {
	var arr = new Uint8Array(this.analyser.frequencyBinCount);
	var self = this;

	function v () {
		self.analyser.getByteFrequencyData(arr);
		//self.visual(arr);
		//console.log(arr);
		self.currentTime = Music.ac.currentTime;
		console.log(self.currentTime);
		requestAnimationFrame(v);
	}

	requestAnimationFrame(v);
}