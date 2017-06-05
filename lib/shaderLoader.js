define(['shaderProgram', 'Canvas'], function(ShaderProgram, Canvas){
	var gl = Canvas.getCanvasById('mainCanvas').getGlContext();

	function load(programName, callback) {
		if(!programName) throw new 'Cannot load program with blank name';

		var program = new ShaderProgram(programName);
		program.compile(callback);

		return program;
	}

	return {
		load : load
	}
})