define(['Canvas', 'ModelViewMatrix', 'PerspectiveMatrix', 'webgl-utils'], function(Canvas, mvMatrix, pMatrix, webGlUtils){

	var mainCanvas = Canvas.getCanvasById('mainCanvas');
	var gl = mainCanvas.getGlContext();

	var VERTICAL_FIELD_OF_VIEW = 45;
	var NEAR_CLIPPING_PLANE = 0.1;
	var FAR_CLIPPING_PLANE = 100.0;

	var CANVAS_WIDTH = mainCanvas.getCanvasNode().width;
	var CANVAS_HEIGHT = mainCanvas.getCanvasNode().height;

	function Scene() {
		var elements = [];
		var elementsById = {};
		var currentElement = null;

		this.addElement = function(newElement) {
			// Assume the next available ID is the next spot in the elements array
			var newElementId = elements.length + 1;
			newElement.setPickingColor(Scene.idToPickingColor(newElementId));

			elements.push(newElement);
			elementsById[newElementId] = newElement;
		}

		this.render = function() {
			gl.viewport(0, 0, mainCanvas.getCanvasNode().width, mainCanvas.getCanvasNode().height);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.enable(gl.DEPTH_TEST);

			mat4.perspective(VERTICAL_FIELD_OF_VIEW, CANVAS_WIDTH / CANVAS_HEIGHT, NEAR_CLIPPING_PLANE, FAR_CLIPPING_PLANE, pMatrix);
			mat4.identity(mvMatrix.getMatrix());

			for(var i = 0; i < elements.length; i++) {
				elements[i].render();
			}
		}

		this.renderToPickerBuffer = function() {
			gl.viewport(0, 0, mainCanvas.getCanvasNode().width, mainCanvas.getCanvasNode().height);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
			gl.enable(gl.DEPTH_TEST);

			for(var i = 0; i < elements.length; i++) {
				elements[i].renderToPickerBuffer();
			}
		}

		this.animate = function() {
			// do nothing for now
		}

		this.getElementById = function(id) {
			return elementsById[id];
		}
	};

	// Class-level functions
	Scene.pickingColorToId = function(pickingColor) {
		return pickingColor[0] * 255 + pickingColor[1] * 255000 + pickingColor[2] * 255000000;
	};
	Scene.idToPickingColor = function(id) {
		return [(id % 1000) / 255, parseInt((id % 1000) / 1000) / 255, parseInt(id / 1000000) / 255];
	};

	return Scene;
});