/*
* @Author: 10261
* @Date:   2017-03-06 21:25:57
* @Last Modified by:   10261
* @Last Modified time: 2017-05-26 13:10:12
*/

'use strict';
//由于音乐可视化需要解析音频数据，会造成缓冲时间大大增加
//故Music对象有2套播放系统
//1. 使用 web audio api封装的，用以解析音频数据实现可视化的方案
//2. 使用dom audio 封装的，不进行可视化，好处是播放加载快

var fonts = [];
function Music(option) {

	//tag = 1，表示执行可视化，为0表示不执行可视化
	this.tag = 1;

	this.audio = new Audio(); //dom audio对象，作为不显示可视化的备选方案
	this.audio.addEventListener("ended", function () { //绑定播放结束事件
		option.onended();
	});

	this.audio.volume = 0.5;//设置基本音频音量，不然在移动端初始化的时候会导致声效很小

	this.info = {//音乐信息展示对象
		img: option.img, 
		name: option.name,
		author: option.author,
		love: option.love
	};

	//this.vilValue.dataValue表示可视化方案  0：不执行可视化 1 圆形  2 柱形
	//不执行可视化时，采用Dom audio 模式
	//执行可视化时，采用web audio api封装的模式
	this.vilValue = option.vilValue;

	this.timeNow = option.timeNow || null; //显示当前已播放进度时间长度

	this.analyser = Music.ac.createAnalyser(); // web audio api  音频解析的中间件

	this.source = null; // 缓存音频数据

	this.buffer = []; // 缓存为二进制音频数据

	this.count = 0;//用户在当前歌曲还未加载完毕的情况下，又点击播放其他歌曲，会进行统计，只解析最后点击的歌曲


	this.paused = false; //音乐播放是否暂停

	this.active = false; //该对象是否在运行

	this.size = option.size;//音频解析基本配置信息

	this.onended = option.onended;//播放结束事件 web audio api绑定

	this.analyser.fftSize = this.size * 2; //设置analyser解析的参数

	this.gainNode = Music.ac[Music.ac.createGain ? "createGain" : "createGainNode"]();//音量函数
	this.gainNode.gain.value = 5; // 设置基础音量

	this.gainNode.connect(Music.ac.destination);

	this.analyser.connect(this.gainNode);

	//web audio api对象，只有播放和结束2个状态，不能暂停和重新播放，时间跳转，播放暂停得函数需要自己封装
	this.startTime = 0; //播放开始时当前浏览器时间

	this.currentTime = 0; //跳转的时间长度

	this.duration = 0;//音频时间长度

	this.staticTime = 0;//静态时间，只记录播放了多长时间

	this.visual = option.visual; //可视化函数——canvas实现

	this.xhr = new window.XMLHttpRequest(); //使用ajax获取音频数据

	this.visualize();//执行可视化
}
Music.ac = new (window.AudioContext||window.webkitAudioContext)(); // web aduio api对象

//音乐加载函数
Music.prototype.load = function (obj) {
	var self = this;
	var x = false; //判断当前歌曲是否是当前用户喜欢的歌曲
	if (master) {
        var list = master.list; 
        for (var key in list) {
		    var m = list[key];
		    for (var i = 0; i < m.length; i++) {
			    if (m[i].id === obj.id) {
				    x = true;
			    }
		    }
	    } 
	}
	
	obj.parse = 1;
	
	if (x) {
		self.info.love.src = "./img/iLove.png";
	} else {
		self.info.love.src = "./img/love.png";
	}
	self.info.img.src = obj.pic;
	self.info.name.innerHTML = obj.name;
	self.info.author.innerHTML = obj.author;

	//以上为信息配置，下面为ajax配置
	

	self.xhr.abort(); //重新加载音乐时，停止上一次的加载
	self.xhr.open("POST", "/api/musicUrl", true);
	console.log(self.vilValue.dataValue);
	if (self.vilValue.dataValue == 0) {//不执行可视化
		obj.parse = 0;
		self.tag = 0;
		self.xhr.responseType = "text";
		self.xhr.onload = function () {
			self.audio.src = JSON.parse(self.xhr.response).data[0].url;
			console.log(self.audio);
			self.startTime = 0;
			self.staticTime = 0;
			self.currentTime = 0;
			self.active = true;
			self.duration = self.audio.duration;
			console.log(self.audio.duration);
			console.log(self.audio.currentTime);
			self.audio.play();
		}
	} else {//执行可视化
		self.tag = 1;
		self.xhr.responseType = "arraybuffer";
		self.xhr.onload = function () {
			self.audio.pause();
			self.startTime = 0;
			self.staticTime = 0;
			self.currentTime = 0;
			self.duration = 0;
			self.active = true;
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

Music.prototype.decode = function (arraybuffer) {//音频解码函数，获取的二进制音频数据需要解析成频域音频数据才能进行可视化
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

Music.prototype.ret = function () { //用以 可视化模型下的播放暂停，即暂停后重新播放时候，重新加载缓存的音频数据，不用再去获取
	var bs = Music.ac.createBufferSource();
	bs.buffer = this.buffer;
	bs.connect(this.analyser);
	this.source = bs;
}

Music.prototype.play = function (num) { // 播放函数
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
Music.prototype.stop = function () {//暂停函数
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
Music.prototype.changeVolume = function (num) { //改变音量接口
	if (this.tag == 0) {
		this.audio.volume = num * num * 0.01;
	} else {
	    this.gainNode.gain.value = num * num * 0.25;
	    console.log(this.gainNode.gain.value);
	}
}
Music.prototype.visualize = function () { //可视化函数
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
		if (self.tag && self.source) {
			self.visual.boom(fonts, self);
		} else if (!self.tag) {
			self.visual.boom(fonts, self);
		}
		self.timeNow.style.width = (self.currentTime / self.duration) * 100 + "%";
		requestAnimationFrame(v);
	}

	requestAnimationFrame(v);
}

Music.prototype.getCurrentTime = function () {//封装的获取currentTime
	var now = new Date();
	now = now.getTime();
	var watch =(now - this.startTime) / 1000;
	this.currentTime = this.staticTime + watch;
}
