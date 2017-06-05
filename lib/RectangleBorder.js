define(['Canvas', 'rectangleShader', 'ModelViewMatrix', 'PerspectiveMatrix'], function(Canvas, rectangleShader, modelViewMatrix, perspectiveMatrix){
	function RectangleBorder() {
		var width = 0.1;
		var height = 1.0;

		var vertexPositionBuffer = initVertexPositionBuffer();
		var vertexColorBuffer = initVertexColorBuffer();
		var vertexIndexBuffer = initVertexIndexBuffer();

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

		this.render = function() {
			if(!rectangleShader.compileStatus) return;

			gl.useProgram(rectangleShader);

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

		function initVertexPositionBuffer() {
			var vertexPositionBuffer = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);


			var vertices = [

			];

			gl.bufferData(gl.ARRAY_BUFFER, new Array32Float(vertices), gl.STATIC_DRAW);
			return vertexPositionBuffer;
		}
	}
})