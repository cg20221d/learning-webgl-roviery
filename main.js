function main() {
    var kanvas = document.getElementById("kanvas");
    var gl = kanvas.getContext("webgl");

    var vertices = [
        0.5, 0.0, 0.0, 1.0, 0.7,   // A: kanan atas    (BIRU LANGIT)
        0.0, -0.5, 1.0, 0.0, 0.2,   // B: bawah tengah  (MAGENTA)
        -0.5, 0.0, 0.3, 1.0, 0.0,  // C: kiri atas     (KUNING)
        0.0, 0.5, 1.0, 1.0, 1.0    // D: atas tengah   (PUTIH)
    ];

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Vertex shader
    var vertexShaderCode = `
    attribute vec2 aPosition;
    attribute vec3 aColor;
    uniform float uTheta;
    uniform float uLeft;
    uniform float uRight;
    uniform float uDown;
    uniform float uUp;
    varying vec3 vColor; 
    void main() {
        float x = -sin(uTheta)*aPosition.x+cos(uTheta)*aPosition.y;
        float y = cos(uTheta)*aPosition.x+sin(uTheta)*aPosition.y;
        x += uLeft;
        x += uRight;
        y += uDown;
        y += uUp;
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
    var left = 0.0;
    var right = 0.0;
    var down = 0.0;
    var up = 0.0;
    var freeze = false;
    var turnLeft = false;
    var turnRight = false;
    var turnUp = false;
    var turnDown = false;


    // Variabel pointer ke GLSL
    var uTheta = gl.getUniformLocation(shaderProgram, "uTheta");
    var uLeft = gl.getUniformLocation(shaderProgram, "uLeft");
    var uRight = gl.getUniformLocation(shaderProgram, "uRight");
    var uDown = gl.getUniformLocation(shaderProgram, "uDown");
    var uUp = gl.getUniformLocation(shaderProgram, "uUp");



    //  kita mengajari GPU bagaimana caranya mengoleksi
    //  nilai posisi dari ARRAY_BUFFER
    //  untuk setiap verteks yang sedang diproses
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
            left -= 0.01;
            gl.uniform1f(uLeft, left);
        }
        if (turnRight){
            right += 0.01;
            gl.uniform1f(uRight, right);
        }
        if (turnUp){
            up += 0.01;
            gl.uniform1f(uUp, up);
        }
        if (turnDown){
            down -= 0.01;
            gl.uniform1f(uDown, down);
        }
        gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
    }

    setInterval(render, 1000 / 60);

    // gl.drawArrays(gl.POINTS, 0, 4);
    gl.drawArrays(gl.LINE_LOOP, 0, 4);
}


