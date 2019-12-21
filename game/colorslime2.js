canvas(800, 600);
setFPS(60);

// This is very cool

var music = loadSound('sounds/music.mp3', 1);
var playMusic = true;

var manager = new LevelManager(levels);
var menu = new MenuManager();

background(50);
setColor(255);
text(400, 300, 'Installing...', 60, 'Montserrat');

setTimeout(function() {
    repeat(update); repeat(draw);
}, 7000)

function draw() {
    if (menu.id <= menu.totalMenus) {
        menu.show();
    } else {
        manager.show();
    }
}

function update() {
    if (playMusic) playSound(music);
    if (menu.id > menu.totalMenus) manager.update();
}

function keyPressed() {
    if (menu.id <= menu.totalMenus) {
        menu.keyInput(0);
    } else {
        manager.input(0);
    }
}

function keyReleased() {
    if (menu.id <= menu.totalMenus) {
        menu.keyInput(1);
    } else {
        manager.input(1);
    }
}

function mousePressed() {
    if (menu.id <= menu.totalMenus) {
        menu.mouseInput();
    } else {
        manager.mouseInput();
    }
}