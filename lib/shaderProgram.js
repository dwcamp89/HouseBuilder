define(['Canvas'], function(Canvas) {
	var gl = Canvas.getCanvasById('mainCanvas').getGlContext();

	function ShaderProgram(programName) {
		this.programName = programName;
		this.compileStatus = false;
		this.vertexShader = gl.createShader(gl.VERTEX_SHADER);
		this.fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		this.program = gl.createProgram();

		//this.perspectiveMatrix = null;
	}

	ShaderProgram.prototype.getProgram = function() {
		return this.program;
	}

	ShaderProgram.prototype.setVertexPosition = function(vertexPositionBuffer) {
		var vertexPositionLocation = gl.getAttribLocation(this.program, 'vertexPosition');
		gl.enableVertexAttribArray(vertexPositionLocation);
		gl.bindBuffer(vertexPositionBuffer);
		gl.vertexAttribPointer(vertexPositionLocation, 3, gl.FLOAT, false, 0, 0);
	}

	ShaderProgram.prototype.compile = function(compileCompleteCallback) {
		console.log('compile');

		var vertexShaderPath = 'text!/src/shaders/{programName}.vert'.replace('{programName}', this.programName);
		var fragmentShaderPath = 'text!/src/shaders/{programName}.frag'.replace('{programName}', this.programName);

		var thisInstance = this;

		require([vertexShaderPath, fragmentShaderPath], function(vertexShaderSrc, fragmentShaderSrc) {
			console.log('compiling');

			// compile vertex shader
			gl.shaderSource(thisInstance.vertexShader, vertexShaderSrc);// here
			gl.compileShader(thisInstance.vertexShader);

			if(!gl.getShaderParameter(thisInstance.vertexShader, gl.COMPILE_STATUS)) {
				console.log('Unable to compile vertexShader ' + thisInstance.programName);
				console.log(gl.getShaderInfoLog(thisInstance.vertexShader));
			}

			// compile fragment shader
			gl.shaderSource(thisInstance.fragmentShader, fragmentShaderSrc);
			gl.compileShader(thisInstance.fragmentShader);

			if(!gl.getShaderParameter(thisInstance.fragmentShader, gl.COMPILE_STATUS)) {
				console.log('Unable to compile fragmentShader '+ thisInstance.programName);
				console.log(gl.getShaderInfoLog(thisInstance.fragmentShader));
			}

			// link program
			gl.attachShader(thisInstance.program, thisInstance.vertexShader);
			gl.attachShader(thisInstance.program, thisInstance.fragmentShader);
			gl.linkProgram(thisInstance.program);

			if(!gl.getProgramParameter(thisInstance.program, gl.LINK_STATUS)) {
				console.log(gl.getProgramInfoLog(thisInstance.program));
				console.log('Unable to link program');
			}

			console.log('compiled');
			thisInstance.compileStatus = true;

			if(compileCompleteCallback && typeof compileCompleteCallback === 'function') compileCompleteCallback(thisInstance);
		})
	}

	return ShaderProgram;
})