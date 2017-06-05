define(['Rectangle'], function(Rectangle) {

	function RectangleBuilder() {
		var rectangleInstance = new Rectangle();

		this.setX = function(x) {
			rectangleInstance.setX(x);
			return this;
		}
		this.setY = function(y) {
			rectangleInstance.setY(y);
			return this;
		}
		this.setWidth = function(width) {
			rectangleInstance.setWidth(width);
			return this;
		}
		this.setHeight = function(height) {
			rectangleInstance.setHeight(height);
			return this;
		}
		this.setColor = function(color) {
			rectangleInstance.setColor(color);
			return this;
		}

		this.build = function() {
			rectangleInstance.buildBuffers();
			return rectangleInstance;
		}
	}

	return {
		getInstance : function() {
			return new RectangleBuilder();
		}
	};
})