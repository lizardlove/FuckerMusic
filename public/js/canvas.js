/*
* @Author: 10261
* @Date:   2017-04-18 23:44:08
* @Last Modified by:   10261
* @Last Modified time: 2017-04-19 18:35:58
*/

'use strict';
var canvasBox = document.querySelector("#bgC");
var WIDTH = document.querySelector("#music").offsetWidth;
var HEIGHT = document.querySelector("#music").offsetHeight;
console.log(WIDTH);
console.log(HEIGHT);
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var ARR = [];
ARR.w = Math.round(WIDTH / 32) - 1;
ARR.cgap = Math.round(ARR.w * 0.3);
ARR.cw = ARR.w - ARR.cgap;
ARR.linearGradient = ctx.createLinearGradient(0, HEIGHT, 0, 0);
		ARR.linearGradient.addColorStop(0, 'green');
		ARR.linearGradient.addColorStop(0.5, '#ff0');
		ARR.linearGradient.addColorStop(1, '#f00');
for (var o = 0; o < 32; o++) {
	ARR.push({
		cap: 0,
		cheight: 10
	});
}
canvas.width = WIDTH;
canvas.height = HEIGHT;
canvasBox.appendChild(canvas);

function vil(arrs) {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	ctx.fillStyle = ARR.linearGradient;
	for (var i = 0; i < 32; i++) {
		if (true) {
			var h = arrs[i] / 280 * HEIGHT;
			ARR[i].cheight > ARR.cw && (ARR[i].cheight = ARR.cw);
			if(--ARR[i].cap < ARR[i].cheight) {
				ARR[i].cap = ARR[i].cheight;
			};
			if (h > 0 && (ARR[i].cap < h + 40)) {
				ARR[i].cap = h + 40 > HEIGHT ? HEIGHT : h + 40;
			}
			ctx.fillRect(ARR.w * i, HEIGHT - ARR[i].cap, ARR.cw, ARR[i].cheight);
			ctx.fillRect(ARR.w * i, HEIGHT - h, ARR.cw, h);
		}
	}

}