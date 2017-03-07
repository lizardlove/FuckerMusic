/*
* @Author: 10261
* @Date:   2017-03-06 21:25:57
* @Last Modified by:   10261
* @Last Modified time: 2017-03-07 21:40:47
*/

'use strict';
function Music (option) {

	this.source = null;

	this.audio = new Audio();

	this.audioSource = Music.ac.createMediaElementSource(this.audio);

	this.audioSource = this.source;

	this.onended = option.onended;

	this.size = option.size||32;

	//this.visual = option.visual;

	this.currentTime = Music.ac.currentTime;

	this.gainNode = Music.ac[Music.ac.createGain ? "createGain" : "createGainNode"]();

	this.analyser = Music.ac.createAnalyser();

	//this.delayNode.delayTime.value = 2;

	//this.audioSource.connect(this.analyser);

	this.analyser.connect(this.gainNode);

	//this.delayNode.connect(this.gainNode);

	this.gainNode.connect(Music.ac.destination);

	this.xhr = new window.XMLHttpRequest();

	Music.visualize(this);
}

Music.ac = new (window.AudioContext ||window.webkitAudioContext || window.mozAudioContext)();

Music.load = function (xhr, obj, fun) {

	// xhr.open("POST", obj.path, true);

	// xhr.responseType = "arraybuffer";

	// xhr.onload = function () {
	// 	fun.call(xhr.response);
	// }

	// xhr.send(obj);
	ajax({
		method: 'POST',
		data: obj,
		responseType: "arraybuffer",
		url: obj.path,
		load: function (data) {}
	})

}

Music.play = function (mc) {
	mc.source.connect(mc.analyser);
	mc.audio.play();
	mc.audio.onended = mc.onended;
}

Music.stop = function (mc) {
	mc.audio.pause();
	mc.audio.onended = window.undefined;
}

Music.visualize = function (mc) {
	mc.analyser.fftSize = mc.size * 2;

	var arr = new Uint8Array(mc.analyser.frequencyBinCount);

	var requestAnimationFrame = window.requestAnimationFrame ||
	                            window.webkitRequestAnimationFrame ||
	                            window.oRequestAnimationFrame ||
	                            window.mzRequestAnimationFrame;
    
    function v () {
    	mc.analyser.getByteFrequencyData(arr);
    	//mc.visual.call(arr);
    	//console.log(arr);
    	requestAnimationFrame(v);
    }

    requestAnimationFrame(v);
}

Music.prototype.decode = function (arraybuffer, fun) {
	var self = this;

	Music.ac.decodeAudioData(arraybuffer, function (buffer) {
		var bufferSourceNode = Music.ac.createBufferSource();
		bufferSourceNode.buffer = buffer;
		fun.call(bufferSourceNode);
	}, function (err) {
		console.log(err);
	});
}

Music.prototype.start = function (obj) {
	var self = this;

	Music.load(self.xhr, obj, function () {
		self.decode(this, function () {
			self.source = this;
			Music.play(self);
		})
	})
}