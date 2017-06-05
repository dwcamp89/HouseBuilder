define(['Canvas', 'shaderLoader'], function(Canvas, shaderLoader){
	var gl = Canvas.getCanvasById('mainCanvas').getGlContext();

	var POSITION_BUFFER_ITEM_SIZE = 3;
	var COLOR_BUFFER_ITEM_SIZE = 4;

	var vertexPositionBufferLocation, vertexColorBufferLocation;

	var rectangleShader = shaderLoader.load('rectangleShader', function(program) {
		vertexPositionBufferLocation = gl.getAttribLocation(program.getProgram(), 'vertexPosition');
		vertexColorBufferLocation = gl.getAttribLocation(program.getProgram(), 'vertexColor');
	});

	rectangleShader.setVertexPositionBuffer = function(vertexPositionBuffer) {
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexPositionBuffer);
		gl.enableVertexAttribArray(vertexPositionBufferLocation);
		gl.vertexAttribPointer(vertexPositionBufferLocation, POSITION_BUFFER_ITEM_SIZE, gl.FLOAT, false, 0, 0);
	}

	rectangleShader.setVertexColorBuffer = function(vertexColorBuffer) {
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
		gl.enableVertexAttribArray(1);
		gl.vertexAttribPointer(vertexColorBufferLocation, COLOR_BUFFER_ITEM_SIZE, gl.FLOAT, false, 0, 0);
	}

	return rectangleShader;
})