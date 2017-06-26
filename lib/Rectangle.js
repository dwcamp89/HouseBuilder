define(['Canvas', 'rectangleShader', 'RectangleBorder', 'ModelViewMatrix', 'PerspectiveMatrix'], function(Canvas, rectangleShader, rectangleBorder, modelViewMatrix, perspectiveMatrix){
	var gl = Canvas.getCanvasById('mainCanvas').getGlContext();

	var shaderProgram = rectangleShader;

	var vertexPositionBuffer = gl.createBuffer();
	var vertexColorBuffer = gl.createBuffer();
	var vertexIndexBuffer = gl.createBuffer();

	function Rectangle(){
		var width = 1.0;
		var height = 1.0;
		var x = 0;
		var y = 0;

		var color = [0.4, 1.0, 0.1, 1.0];
		var pickingColor = [0.0, 0.0, 0.0, 0.0];

		var childElements = [];
		var highlighted = false;

		this.getX = function() {
			return x;
		}
		this.setX = function(newX) {
			x = newX;
		}
		this.getY = function() {
			return y;
		}
		this.setY = function(newY) {
			y = newY;
		}
		
		this.getWidth = function() {
			return width;
		}
		this.setWidth = function(newWidth){
			width = newWidth;
		}
		this.getHeight = function() {
			return height;
		}
		this.setHeight = function(newHeight) {
			height = newHeight;
		}

		this.setColor = function(newColor) {
			color = newColor;
		}
		this.getColor = function() {
			return color;
		}
		this.setPickingColor = function(newPickingColor) {
			pickingColor = newPickingColor;
		}
		this.getPickingColor = function() {
			return pickingColor;
		}
		this.getChildElements = function() {
			return childElements;
		}

		this.setHighlighted = function(newHighlighted) {
			if(!highlighted && newHighlighted)
				color[3] = 0.5;
			if(highlighted && !newHighlighted)
				color[3] = 1.0;
			// TODO - validate that highlighted is a Boolean
			highlighted = newHighlighted;
			initVertexColorBuffer();
		}

		this.render = function() {
			if(!rectangleShader.compileStatus) return;// todo

			initVertexColorBuffer();
			initVertexPositionBuffer();
			initVertexIndexBuffer();

			modelViewMatrix.pushMatrix();
			mat4.translate(modelViewMatrix.getMatrix(), [x, y, 0.0]);

			drawCornice();
			drawBorder();

			if(childElements.length > 0) drawChildren();
			else drawContent();

			modelViewMatrix.popMatrix();
		}

		// This may be refactored in the future, so ignore the code duplication for now
		this.renderToPickerBuffer = function() {
			if(!rectangleShader.compileStatus) return;// todo

			gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
			var pickingVertexColors = [
				pickingColor[0], pickingColor[1], pickingColor[2], 1.0,
				pickingColor[0], pickingColor[1], pickingColor[2], 1.0,
				pickingColor[0], pickingColor[1], pickingColor[2], 1.0,
				pickingColor[0], pickingColor[1], pickingColor[2], 1.0
			]
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pickingVertexColors), gl.STATIC_DRAW);

			initVertexPositionBuffer();
			initVertexIndexBuffer();

			modelViewMatrix.pushMatrix();
			mat4.translate(modelViewMatrix.getMatrix(), [x, y, 0.0]);

			drawCornice();
			drawBorder();

			if(childElements.length > 0) drawChildrenToPickerBuffer();
			else drawContent();

			modelViewMatrix.popMatrix();
		}

		function drawCornice() {
			// TODO
		}

		function drawBorder() {
			// TODO
		}

		function drawChildren() {
			for(var i = 0; i < childElements.length; i++) {
				childElements[i].render();
			}
		}

		function drawChildrenToPickerBuffer() {
			for(var i = 0; i < childElements.length; i++) {
				childElements[i].renderToPickerBuffer();
			}
		}

		function drawContent() {
			gl.useProgram(shaderProgram.getProgram());

			// Uniforms
			var perspectiveMatrixUniformLocation = gl.getUniformLocation(shaderProgram.getProgram(), 'perspectiveMatrix');
			gl.uniformMatrix4fv(perspectiveMatrixUniformLocation, false, perspectiveMatrix);
			var modelViewMatrixUniformLocation = gl.getUniformLocation(shaderProgram.getProgram(), 'modelViewMatrix');
			gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix.getMatrix());

			// Attributes
			shaderProgram.setVertexPositionBuffer(vertexPositionBuffer);
			shaderProgram.setVertexColorBuffer(vertexColorBuffer);

			gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
		}

		this.subdivide = function(subElementAmount) {
			console.log('sudivide');
			console.log(subElementAmount);
			if(childElements.length > 0) throw 'This element has already been subdivided';
			if(!subElementAmount || !Number.isInteger(subElementAmount)) throw 'To subdivide an element, a valid number of sub-elements must be provided';
			if(subElementAmount < 1) throw 'To subdivide an element, the number of sub-elements must be greater than 1';

			var childElementWidth = this.getWidth() / subElementAmount;

			for(var i = 0; i < subElementAmount; i++) {
				var newChildElement = new Rectangle();
				newChildElement.setColor([this.getColor()[0], this.getColor()[1], this.getColor()[2], 1.0]);
				newChildElement.setWidth(childElementWidth);
				newChildElement.setX(childElementWidth * i);
				newChildElement.setHeight(this.getHeight());
				newChildElement.buildBuffers();
				childElements.push(newChildElement);
			}
		}

		function initVertexColorBuffer() {
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);

			var vertexColors = [
				color[0], color[1], color[2], color[3],
				color[0], color[1], color[2], color[3],
				color[0], color[1], color[2], color[3],
				color[0], color[1], color[2], color[3]
			];
			
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);
		}

		function initVertexPositionBuffer() {
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);

			var vertices = [
				0.0, height, -1.0,
				width, height, -1.0,
				width, 0.0, -1.0,
				0.0, 0.0, -1.0
			];
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
			return vertexPositionBuffer;
		}

		function initVertexIndexBuffer() {
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);

			var elementVerteces = [
				0, 1, 2, 0, 2, 3
			];

			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elementVerteces), gl.STATIC_DRAW);
		}

		this.buildBuffers = function() {
			initVertexPositionBuffer();
			initVertexColorBuffer();
			initVertexIndexBuffer();
		}
	};

	return Rectangle;
})