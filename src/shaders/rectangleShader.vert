attribute vec3 vertexPosition;
attribute vec4 vertexColor;

uniform mat4 modelViewMatrix;
uniform mat4 perspectiveMatrix;

varying vec4 color;

void main(void) {
	gl_Position = perspectiveMatrix * modelViewMatrix * vec4(vertexPosition, 1.0);
	color = vertexColor;
}
