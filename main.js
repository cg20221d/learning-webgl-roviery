function main() {
    var kanvas = document.getElementById("kanvas");
    var gl = kanvas.getContext("webgl");

    var vertices = [
        0.5, 0.0, 0.0, 1.0, 0.7,   // A: kanan atas  
        0.0, -0.5, 1.0, 0.0, 0.2,   // B: bawah tengah  
        -0.5, 0.0, 0.3, 1.0, 0.0,  // C: kiri atas    
        0.0, 0.5, 1.0, 1.0, 1.0    // D: atas tengah 
    ];

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Vertex shader
    var vertexShaderCode = `
    attribute vec2 aPosition;
    attribute vec3 aColor;
    uniform float uTheta;
    uniform float uHorizontal;
    uniform float uVertical;
    varying vec3 vColor; 
    void main() {
        float x = -sin(uTheta)*aPosition.x+cos(uTheta)*aPosition.y;
        float y = cos(uTheta)*aPosition.x+sin(uTheta)*aPosition.y;
        x += uHorizontal;
        y += uVertical;
        gl_Position = vec4(x, y, 0.0, 1.0);
        vColor = aColor;
    }
    `;
    var vertexShaderObject = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShaderObject, vertexShaderCode);
    gl.compileShader(vertexShaderObject);   // sampai sini sudah jadi .o

    // Fragment shader
    var fragmentShaderCode = `
    precision mediump float;
    varying vec3 vColor;
    void main() {
        gl_FragColor = vec4(vColor, 1.0);
    }
    `;
    var fragmentShaderObject = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShaderObject, fragmentShaderCode);
    gl.compileShader(fragmentShaderObject);   // sampai sini sudah jadi .o

    var shaderProgram = gl.createProgram(); // wadah dari executable (.exe)
    gl.attachShader(shaderProgram, vertexShaderObject);
    gl.attachShader(shaderProgram, fragmentShaderObject);
    gl.linkProgram(shaderProgram);
    gl.useProgram(shaderProgram);

    // Variabel lokal
    var theta = 0.0;
    var horizontal = 0.0;
    var vertical = 0.0;
    var freeze = false;
    var turnLeft = false;
    var turnRight = false;
    var turnUp = false;
    var turnDown = false;


    // Variabel pointer ke GLSL
    var uTheta = gl.getUniformLocation(shaderProgram, "uTheta");
    var uHorizontal = gl.getUniformLocation(shaderProgram, "uHorizontal");
    var uVertical = gl.getUniformLocation(shaderProgram, "uVertical");

    var aPosition = gl.getAttribLocation(shaderProgram, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false,
        5 * Float32Array.BYTES_PER_ELEMENT,
        0);
    gl.enableVertexAttribArray(aPosition);
    var aColor = gl.getAttribLocation(shaderProgram, "aColor");
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false,
        5 * Float32Array.BYTES_PER_ELEMENT,
        2 * Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aColor);

    // Grafika interaktif
    // Tetikus
    function onMouseClick(event) {
        freeze = !freeze
    }
    document.addEventListener("click", onMouseClick);
    // Papan ketuk
    function onKeyDown(event) {
        if (event.keyCode == 32) {
            freeze = !freeze
        }
        if (event.keyCode == 65) {
            turnLeft = true;
        }
        if (event.keyCode == 68) {
            turnRight = true;
        }
        if (event.keyCode == 87) {
            turnUp = true;
        }
        if (event.keyCode == 83) {
            turnDown = true;
        }
    }
    function onKeyUp(event) {
        if (event.keyCode == 32) {
            freeze = !freeze
        }
        if (event.keyCode == 65) {
            turnLeft = false;
        }
        if (event.keyCode == 68) {
            turnRight = false;
        }
        if (event.keyCode == 87) {
            turnUp = false;
        }
        if (event.keyCode == 83) {
            turnDown = false;
        }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    function render() {
        gl.clearColor(1.0, 0.65, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        if (!freeze) {
            theta += 0.01;
            gl.uniform1f(uTheta, theta);
        }
        if (turnLeft){
            horizontal -= 0.01;
            gl.uniform1f(uHorizontal, horizontal);
        }
        if (turnRight){
            horizontal += 0.01;
            gl.uniform1f(uHorizontal, horizontal);
        }
        if (turnUp){
            vertical += 0.01;
            gl.uniform1f(uVertical, vertical);
        }
        if (turnDown){
            vertical -= 0.01;
            gl.uniform1f(uVertical, vertical);
        }
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }

    setInterval(render, 1000 / 60);
}


