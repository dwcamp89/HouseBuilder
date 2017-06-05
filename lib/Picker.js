define(['Canvas'], function(Canvas) {

	var mainCanvas = Canvas.getCanvasById('mainCanvas');
	var gl = mainCanvas.getGlContext();

	var CANVAS_WIDTH = mainCanvas.getCanvasNode().width;
	var CANVAS_HEIGHT = mainCanvas.getCanvasNode().height;

	var Picker = function(scene) {
		var pickerFrameBuffer = gl.createFramebuffer();
		var pickerRenderBuffer = gl.createRenderbuffer();
		var pickerTexture = gl.createTexture();

		gl.bindFramebuffer(gl.FRAMEBUFFER, pickerFrameBuffer);

		// Setup texture
		gl.bindTexture(gl.TEXTURE_2D, pickerTexture);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, CANVAS_WIDTH, CANVAS_HEIGHT, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

		// Setup render buffer
		gl.bindRenderbuffer(gl.RENDERBUFFER, pickerRenderBuffer);
		gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, CANVAS_WIDTH, CANVAS_HEIGHT);
		gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, pickerTexture, 0);

		// Bind the render buffer to the frame buffer
		gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, pickerRenderBuffer);
		if(gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
			alert('frame buffer not complete!');
		}

		// Reset all buffers
		gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		gl.bindRenderbuffer(gl.RENDERBUFFER, null);
		gl.bindTexture(gl.TEXTURE_2D, null);

		this.pickElementByCoordinates = function(x, y) {
			gl.bindFramebuffer(gl.FRAMEBUFFER, pickerFrameBuffer);

			scene.renderToPickerBuffer();
			var selectedColorBuffer = new Uint8Array(4);
			gl.readPixels(x, CANVAS_HEIGHT - y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, selectedColorBuffer);

			gl.bindFramebuffer(gl.FRAMEBUFFER, null);

			var selectedElementId = selectedColorBuffer[0] + selectedColorBuffer[1] * 1000 + selectedColorBuffer[2] * 1000000;
			return highlightedElement = scene.getElementById(selectedElementId);
		}
	}

	return Picker;
})