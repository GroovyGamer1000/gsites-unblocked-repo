/**
	Base class to represent a double buffered canvas object.
	Modified to support fullscreen scaling.
	Original code by Rob Kleffner, 2011
*/

Enjine.GameCanvas = function() {
	this.Canvas = null;
	this.Context2D = null;
	this.BackBuffer = null;
	this.BackBufferContext2D = null;

	this.ResolutionWidth = 0;
	this.ResolutionHeight = 0;
};

Enjine.GameCanvas.prototype = {
	Initialize: function(canvasId, resWidth, resHeight) {
		this.ResolutionWidth = resWidth;
		this.ResolutionHeight = resHeight;

		this.Canvas = document.getElementById(canvasId);
		this.Context2D = this.Canvas.getContext("2d");

		// Set canvas to fill the window
		this.ResizeCanvas();

		// Create backbuffer at original resolution
		this.BackBuffer = document.createElement("canvas");
		this.BackBuffer.width = resWidth;
		this.BackBuffer.height = resHeight;
		this.BackBufferContext2D = this.BackBuffer.getContext("2d");

		// Optional: prevent anti-aliasing for pixel art
		this.Context2D.imageSmoothingEnabled = false;

		// Handle window resize
		window.addEventListener("resize", () => this.ResizeCanvas());
	},

	ResizeCanvas: function() {
		this.Canvas.width = window.innerWidth;
		this.Canvas.height = window.innerHeight;
	},

	BeginDraw: function() {
		this.BackBufferContext2D.clearRect(0, 0, this.BackBuffer.width, this.BackBuffer.height);
	},

	EndDraw: function() {
		const scaleX = this.Canvas.width / this.ResolutionWidth;
		const scaleY = this.Canvas.height / this.ResolutionHeight;
		const scale = Math.min(scaleX, scaleY); // Keep aspect ratio

		const drawWidth = this.ResolutionWidth * scale;
		const drawHeight = this.ResolutionHeight * scale;

		const offsetX = (this.Canvas.width - drawWidth) / 2;
		const offsetY = (this.Canvas.height - drawHeight) / 2;

		this.Context2D.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
		this.Context2D.drawImage(
			this.BackBuffer,
			0, 0, this.ResolutionWidth, this.ResolutionHeight,
			offsetX, offsetY, drawWidth, drawHeight
		);
	}
};
