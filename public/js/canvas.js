/*
* @Author: 10261
* @Date:   2017-04-18 23:44:08
* @Last Modified by:   LizardLove
* @Last Modified time: 2017-04-22 17:48:55
*/

'use strict';
var canvasBox = document.querySelector("#bgC");
var WIDTH = document.querySelector("#music").offsetWidth;
var HEIGHT = document.querySelector("#music").offsetHeight;
var X = WIDTH / 2;
var Y = HEIGHT / 2;
var RADIUS = X > Y ? Y : X; 
var SIZE = 32;
console.log(WIDTH);
console.log(HEIGHT);
var deg = 0.5;
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var Gradient = {};
Gradient.linearGradient = ctx.createLinearGradient(0, HEIGHT, 0, 0);
Gradient.linearGradient.addColorStop(0, '#e6cbf1');
Gradient.linearGradient.addColorStop(0.5, '#09e7ed');
Gradient.linearGradient.addColorStop(1, '#2ecb5d');
Gradient.radialGradient = ctx.createRadialGradient(X, Y, 0, X, Y, RADIUS);
Gradient.radialGradient.addColorStop(0, '#e6cbf1');
Gradient.radialGradient.addColorStop(0.5, '#09e7ed');
Gradient.radialGradient.addColorStop(1, '#2ecb5d');

canvas.width = WIDTH;
canvas.height = HEIGHT;
canvasBox.appendChild(canvas);

CanvasRenderingContext2D.prototype.sector = function (x, y, r, sA, eA) {
	this.save();
	this.translate(x, y);
	this.beginPath();
	this.arc(0, 0, r, sA, eA);
	this.save();
	this.rotate(eA);
	this.moveTo(r, 0);
	this.lineTo(0, 0);
	this.restore();
	this.rotate(sA);
	this.lineTo(r, 0);
	this.closePath();
	this.restore();
	return this;
}
CanvasRenderingContext2D.prototype.record = function(img, A, x, y, r) {
	this.save();
	this.translate(x, y);
	this.rotate(deg * (Math.PI / 180));
	this.arc(0, 0, r, 0, Math.PI * 2);
	this.stroke();
	this.clip();
	this.drawImage(img, -100, -100, 200, 200);
	this.restore();
	return this;
}
function Rect(arrs) {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	ctx.fillStyle = Gradient.linearGradient;
	var w = Math.round(WIDTH / SIZE) - 1;
	for (var i = 0; i < SIZE; i++) {
		if (true) {
			var h = arrs[i] / 280 * HEIGHT;
			ctx.fillRect(w * i, HEIGHT - h, w * 0.7, h);
		}
	}
}
function ball(arrs) {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	ctx.fillStyle = Gradient.radialGradient;
	var angle = Math.PI / 180;
	var image = $("#musicPic img");
	var s = (360 / SIZE) * angle;
	for (var i = 0; i < SIZE; i++) {
		var h = arrs[i] / 280 * (RADIUS * 0.8);
		ctx.sector(X, Y, h + 100, s * i, s * (i + 1)).fill();
	}
	ctx.record(image, 30, X, Y, 100);
	deg += 0.5;
}