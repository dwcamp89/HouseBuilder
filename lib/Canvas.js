define([], function(){
	
	// Canvas class definition
	var Canvas = function(canvasDomNode) {
		this.canvas = canvasDomNode;
		this.glContext = canvasDomNode.getContext('webgl');

		if(!this.glContext) this.glContext = canvasDomNode.getContext('experimental-webgl');
		if(!this.glContext) throw 'Unable to initialize WebGL. Your browser may not support it.';
	}

	// Accessors
	Canvas.prototype.getCanvasNode = function() {
		return this.canvas;
	}
	Canvas.prototype.getGlContext = function() {
		return this.glContext;
	}


	var canvasesById = {};
	function getCanvasById(canvasId) {
		var canvas = canvasesById[canvasId];
		if(!canvas) canvas = initCanvas(canvasId);
		return canvas;
	}

	function initCanvas(canvasId) {
		var canvasDomNode = document.getElementById(canvasId);
		if(!canvasDomNode) throw 'Canvas DOM node of Id {canvasId} could not be found'.replace('{canvasId}', canvasId);

		var newCanvas = new Canvas(canvasDomNode);

		canvasesById[canvasId] = newCanvas;
		return newCanvas;
	}

	// Module definition only exposes method to retrieve canvas by Id
	return {
		getCanvasById : getCanvasById
	};
})