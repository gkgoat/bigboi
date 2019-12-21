var width, height, mousedragged = !1,
    mousedown = !1,
    fps = 30,
    keyCode = 0,
    mouseX = 0,
    mouseY = 0,
    stroke = 0,
    bStroke = !1;

function setFPS(e) {
    fps = e
}

function dist(e, t, n, o) {
    return Math.sqrt(Math.pow(e - n, 2) + Math.pow(t - o, 2))
}

function polygon(e) {
    var t = document.getElementById("libraryCanvas").getContext("2d");
    t.beginPath(), t.moveTo(e[n], e[n + 1]);
    for (var n = 2; n < e.length - 1; n += 2) t.lineTo(e[n], e[n + 1]);
    t.fill(), t.closePath()
}

function toggleStroke() {
    0 == bStroke ? (bStroke = !0, stroke = 1) : (bStroke = !1, stroke = 0)
}

function random(e, t) {
    return Math.random() * t + e
}

function setColor(e, t, n) {
    var o = e,
        a = e;
    void 0 !== t && (a = t), void 0 !== n && (o = n), document.getElementById("libraryCanvas").getContext("2d").fillStyle = "rgba(" + e + ", " + a + ", " + o + ", 1.0)"
}

function setStrokeColor(e, t, n) {
    var o = e,
        a = e;
    void 0 !== t && (a = t), void 0 !== n && (o = n), document.getElementById("libraryCanvas").getContext("2d").strokeStyle = "rgba(" + e + ", " + a + ", " + o + ", " + stroke + ")"
}

function setLineWidth(e) {
    document.getElementById("libraryCanvas").getContext("2d").lineWidth = e
}

function rect(e, t, n, o) {
    var a = document.getElementById("libraryCanvas").getContext("2d");
    1 == bStroke && (a.rect(e, t, n, o), a.stroke()), a.fillRect(e, t, n, o)
}

function ellipse(e, t, n, o) {
    var a = document.getElementById("libraryCanvas").getContext("2d");
    a.beginPath(), a.ellipse(e, t, n, o, 0, 0, 2 * Math.PI), a.stroke(), a.closePath(), a.fill()
}

function addHTMLElement(e, t) {
    var n = document.createElement(e);
    return n.id = t, document.body.appendChild(n), n
}

function getHTMLElement(e) {
    return document.getElementById(e)
}

function loadImage(e) {
    var img = new Image();
    img.src = e;
    return img;
}

function push() {
    document.getElementById("libraryCanvas").getContext("2d").save()
}

function pop() {
    document.getElementById("libraryCanvas").getContext("2d").restore()
}

function translate(e, t) {
    document.getElementById("libraryCanvas").getContext("2d").translate(e, t)
}

function rotate(e) {
    document.getElementById("libraryCanvas").getContext("2d").rotate(e)
}

function scale(e, t) {
    document.getElementById("libraryCanvas").getContext("2d").scale(e, t)
}

function image(e, t, n) {
    document.getElementById("libraryCanvas").getContext("2d").drawImage(n, e, t)
}

function subimage(e, t, n, o, a, d, r) {
    document.getElementById("libraryCanvas").getContext("2d").drawImage(r, n, o, a, d, e, t, a, d)
}

function expandImage(e, t, n, o, a) {
    document.getElementById("libraryCanvas").getContext("2d").drawImage(a, e, t, n, o)
}

function expandSubimage(e, t, n, o, a, d, r, i, u) {
    document.getElementById("libraryCanvas").getContext("2d").drawImage(u, n, o, a, d, e, t, r, i)
}

function text(e, t, n, o, a) {
    var d = document.getElementById("libraryCanvas").getContext("2d");
    d.textAlign = 'center';
    d.font = o + "px " + a, 1 == bStroke && d.strokeText(n, e, t), d.fillText(n, e, t)
}

function line(e, t, n, o) {
    var a = document.getElementById("libraryCanvas").getContext("2d");
    a.beginPath(), a.moveTo(e, t), a.lineTo(n, o), a.closePath(), a.stroke()
}

function repeat(e) {
    setInterval(e, 1e3 / fps)
}

function print(e) {
    console.log(e)
}

function canvas(e, t) {
    var n = document.createElement("canvas");
    n.width = e, width = e, n.height = t, height = t, n.id = "libraryCanvas", n.style.border = "1px solid black", document.body.appendChild(n)
}

function background(e, t, n) {
    var o = e,
        a = e;
    void 0 !== t && (a = t), void 0 !== n && (o = n);
    var d = document.getElementById("libraryCanvas").getContext("2d");
    d.fillStyle = "rgba(" + e + ", " + a + ", " + o + ", 1.0)", d.fillRect(0, 0, document.getElementById("libraryCanvas").width, document.getElementById("libraryCanvas").height)
}

function loadSound(src, vol) {
    var a = document.createElement('audio');
    a.src = src;
    a.volume = vol;
    return a;
}

function playSound(sound) {
    sound.play();
}

document.onkeydown = function(e) {
    "function" == typeof keyPressed && (keyCode = e.keyCode, keyPressed(), e.preventDefault())
}, document.onkeyup = function(e) {
    "function" == typeof keyReleased && (keyCode = e.keyCode, keyReleased())
}, document.onmousemove = function(e) {
    mousedragged = 1 == mousedown;
    var t = document.getElementById("libraryCanvas").getBoundingClientRect();
    mouseX = e.clientX - t.left, mouseY = e.clientY - t.top, "function" == typeof mouseDragged && 1 == mousedragged && mouseDragged()
}, document.onmousedown = function(e) {
    mousedown = !0, "function" == typeof mousePressed && mousePressed()
}, document.onmouseup = function(e) {
    mousedown = !1, "function" == typeof mouseReleased && mouseReleased()
};