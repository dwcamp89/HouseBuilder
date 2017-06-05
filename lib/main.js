require(['Canvas', 'Scene', 'Picker', 'Rectangle', 'RectangleBuilder', 'ModelViewMatrix', 'PerspectiveMatrix'], function(Canvas, Scene, Picker, Rectangle, RectangleBuilder, mvMatrix, pMatrix){
	
	var mainCanvas = Canvas.getCanvasById('mainCanvas');
	var gl = mainCanvas.getGlContext();

	var currentElement;
	var scene = new Scene();
	var picker = new Picker(scene);

	// Initialize some sample starting elements
	var initialElement = RectangleBuilder.getInstance().setX(0).setWidth(0.25).setHeight(0.25).build();
	var initialElement2 = RectangleBuilder.getInstance().setX(0).setY(-0.25).setWidth(0.25).setHeight(0.25).setColor([1.0, 0.0, 0.5, 1.0]).build();
	scene.addElement(initialElement);
	scene.addElement(initialElement2);

	mainCanvas.getCanvasNode().onclick = function(e){
		var highlightedElement = picker.pickElementByCoordinates(e.layerX, e.layerY);

		if(highlightedElement) setHighlightedElement(highlightedElement);
		else clearHighlightedElement();
	}

	setHighlightedElement = function(newHighlightedElement) {
		clearHighlightedElement();
		currentElement = newHighlightedElement;
		currentElement.setHighlighted(true);
		document.getElementById('currentComponentDialog').style.display = 'block';
	}

	clearHighlightedElement = function() {
		if(!currentElement) return;
		
		currentElement.setHighlighted(false);
		currentElement = null;
		document.getElementById('currentComponentDialog').style.display = 'none';
	}

	document.getElementById('subdivideCurrentComponentButton').onclick = function() {
		if(!currentElement) return;

		var subdivideElementAmount = parseInt(document.getElementById('subdivideCurrentComponentAmount').value);
		try {
			currentElement.subdivide(subdivideElementAmount);	
		}
		catch(exception) {
			alert(exception);
			return;
		}
		console.log('new elements? ' + currentElement.getChildElements().length);

		for(var i = 0; i < currentElement.getChildElements().length; i++) {
			scene.addElement(currentElement.getChildElements()[i]);
		}

		setHighlightedElement(currentElement.getChildElements()[0]);
	}

	tick = function() {
		requestAnimFrame(tick);
		scene.render();
		scene.animate();
	}

	start = function() {
		if(gl) {
			gl.clearColor(0.0, 0.0, 0.0, 1.0);
			gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		}

		tick();
	}

	start();
})