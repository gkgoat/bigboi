class Player {
    constructor(x, y, state) {
        this.x = x;
        this.y = y;
        this.roundX = x;
        this.roundY = y;
        this.originX = x;
        this.originY = y;
        this.s = 50;
        this.dead = false;
        this.hasWon = false;
        this.left = false;
        this.right = false;
        this.leftShow = false;
        this.rightShow = true;
        this.jump = false;
        this.jumped = false;
        this.moveSpeed = 4;
        this.jumpSpeed = 8;
        this.horizontalSpeed = 0;
        this.verticalSpeed = 0;
        this.state = state;
        this.walls = [];
        this.changers = [];
        this.goal = null;
        this.star = null;
        this.GRAV = 0.2;
        this.playerRL = loadImage('img/playerRedLeft.png');
        this.playerRR = loadImage('img/playerRedRight.png');
        this.playerBL = loadImage('img/playerBlueLeft.png');
        this.playerBR = loadImage('img/playerBlueRight.png');
        this.playerYL = loadImage('img/playerYellowLeft.png');
        this.playerYR = loadImage('img/playerYellowRight.png');
        this.jumpSound = loadSound('sounds/jump.wav', 0.25);
        this.changeSound = loadSound('sounds/change.wav', 0.25);
        this.deathSound = loadSound('sounds/death.wav', 0.25);
        this.winSound = loadSound('sounds/win.wav', 0.25);
    }

    show() {
        if (this.state == 0) {
            if (this.leftShow) expandImage(this.x, this.y, this.s, this.s, this.playerRL);
            if (this.rightShow) expandImage(this.x, this.y, this.s, this.s, this.playerRR);
        } else if (this.state == 1) {
            if (this.leftShow) expandImage(this.x, this.y, this.s, this.s, this.playerYL);
            if (this.rightShow) expandImage(this.x, this.y, this.s, this.s, this.playerYR);
        } else if (this.state == 2) {
            if (this.leftShow) expandImage(this.x, this.y, this.s, this.s, this.playerBL);
            if (this.rightShow) expandImage(this.x, this.y, this.s, this.s, this.playerBR);
        }
    }

    update() {
        if (!this.hasWon) {
            var left = 0; var right = 0;
            if (this.left) left = -1;
            if (this.right) right = 1;
            var move = left + right;
            this.horizontalSpeed = move * this.moveSpeed;
            if (this.verticalSpeed < 10) this.verticalSpeed += this.GRAV;

            for (var i = 0; i < this.changers.length; i++) {
                var dx = (this.x + this.s / 2) - (this.changers[i].x + 25); var dy = (this.y + this.s / 2) - (this.changers[i].y + 25);
                var dist = Math.sqrt(dx * dx + dy * dy);

    	        if (dist < this.s / 2 + this.changers[i].s && !this.changers[i].collected) {
    	        	this.state = this.changers[i].state;
                    this.s = 50;
                    this.changers[i].collected = true;
                    if (playMusic) playSound(this.changeSound.cloneNode(true));
                    for (var i = 0; i < this.walls.length; i++) {
                        if (this.x < this.walls[i].x + this.walls[i].s &&
    			   		this.x + this.s > this.walls[i].x &&
    			   		this.y < this.walls[i].y + this.walls[i].s &&
    			   		this.s + this.y > this.walls[i].y) {
                               this.x = this.roundX;
                               this.y = this.roundY;
                           }
                    }
    			}
    		}

            for (var i = 0; i < this.walls.length; i++) {
                if (this.walls[i].state == 4) {
                    var size = this.s / 3;
                    if (this.x + size < this.walls[i].x + this.walls[i].s &&
    			   		this.x + size * 2 > this.walls[i].x &&
    			   		this.y + 1 < this.walls[i].y + this.walls[i].s &&
    			   		this.s + this.y + 1 > this.walls[i].y) {
                        this.dead = true;
                        if (playMusic) playSound(this.deathSound.cloneNode(true));
    				}

    	        	if (this.x + this.horizontalSpeed < this.walls[i].x + this.walls[i].s &&
    				   	this.x + this.horizontalSpeed + this.s > this.walls[i].x &&
    				   	this.y < this.walls[i].y + this.walls[i].s &&
    				   	this.s + this.y > this.walls[i].y) {
    	        		this.dead = true;
                        if (playMusic) playSound(this.deathSound.cloneNode(true));
    				}

    		        if (this.x + size < this.walls[i].x + this.walls[i].s &&
    				   	this.x + size * 2 > this.walls[i].x &&
    				   	this.y + this.verticalSpeed < this.walls[i].y + this.walls[i].s &&
    				   	this.s + this.y + this.verticalSpeed > this.walls[i].y) {
    	        		this.dead = true;
                        if (playMusic) playSound(this.deathSound.cloneNode(true));
    				}
                }
            	if (this.state != this.walls[i].state) {
    	        	if (this.x < this.walls[i].x + this.walls[i].s &&
    			   		this.x + this.s > this.walls[i].x &&
    			   		this.y + 1 < this.walls[i].y + this.walls[i].s &&
    			   		this.s + this.y + 1 > this.walls[i].y) {
                        this.jumped = false;
    	        		var jump = 0;
    	        		if (this.jump) jump = 1;
    			    	this.verticalSpeed = -this.jumpSpeed * jump;
    				}

    	        	if (this.x + this.horizontalSpeed < this.walls[i].x + this.walls[i].s &&
    				   	this.x + this.horizontalSpeed + this.s > this.walls[i].x &&
    				   	this.y < this.walls[i].y + this.walls[i].s &&
    				   	this.s + this.y > this.walls[i].y) {

    				    while (!(this.x + this.sign(this.horizontalSpeed) < this.walls[i].x + this.walls[i].s &&
    				   		   this.x + this.sign(this.horizontalSpeed) + this.s > this.walls[i].x &&
    				   		   this.y < this.walls[i].y + this.walls[i].s &&
    				   		   this.s + this.y > this.walls[i].y)) {
    				    	   this.x += this.sign(this.horizontalSpeed);
    				    }
    				    this.horizontalSpeed = 0;
    				}

    		        if (this.x < this.walls[i].x + this.walls[i].s &&
    				   	this.x + this.s > this.walls[i].x &&
    				   	this.y + this.verticalSpeed < this.walls[i].y + this.walls[i].s &&
    				   	this.s + this.y + this.verticalSpeed > this.walls[i].y) {

    				    while (!(this.x < this.walls[i].x + this.walls[i].s &&
    			   		   	     this.x + this.s > this.walls[i].x &&
    			   		   		 this.y + this.sign(this.verticalSpeed) < this.walls[i].y + this.walls[i].s &&
    			   		   		 this.s + this.y + this.sign(this.verticalSpeed) > this.walls[i].y)) {
    			    	   		 this.y += this.sign(this.verticalSpeed);
    			    	}
    			    	this.verticalSpeed = 0;
    				}
    			}
            }

    		if (this.x + this.horizontalSpeed < this.goal.x + this.goal.s &&
    			this.x + this.horizontalSpeed + this.s > this.goal.x &&
    			this.y < this.goal.y + this.goal.s &&
    			this.s + this.y > this.goal.y || this.x < this.goal.x + this.goal.s &&
    			this.x + this.s > this.goal.x &&
    			this.y + this.verticalSpeed < this.goal.y + this.goal.s &&
    			this.s + this.y + this.verticalSpeed > this.goal.y) {
                if (!this.hasWon) {
                    this.hasWon = true;
                    this.y = -100;
                    if (playMusic) playSound(this.winSound.cloneNode(true));
                }
    		}

    		var dx = this.x - this.star.x; var dy = this.y - this.star.y;
            var dist = Math.sqrt(dx * dx + dy * dy);

    	    if (dist < this.s / 2 + this.star.s && !this.star.collected) {
    	        this.star.collected = true;
                if (playMusic) playSound(this.changeSound.cloneNode(true));
    		}

            if (this.horizontalSpeed != 0) {
                this.s -= 0.1;
            }

            if (this.s < 5) {
                this.dead = true;
                if (playMusic) playSound(this.deathSound.cloneNode(true));
            }

            if (this.verticalSpeed < 0 && !this.jumped) {
                this.jumped = true;
                if (playMusic) playSound(this.jumpSound.cloneNode(true));
            }

            this.x += Math.floor(this.horizontalSpeed);
            this.y += Math.floor(this.verticalSpeed);

            for (var i = 0; i < this.walls.length; i++) {
                if (this.state != this.walls[i].state) {
                    if (this.x < this.walls[i].x + this.walls[i].s &&
                        this.x + this.s > this.walls[i].x &&
                        this.y < this.walls[i].y + this.walls[i].s &&
                        this.s + this.y > this.walls[i].y) {
                            this.x -= Math.floor(this.horizontalSpeed);
                            this.y -= Math.floor(this.verticalSpeed);
                    }
                }
            }

            this.roundX = Math.floor(this.x / 50) * 50;
            this.roundY = Math.floor(this.y / 50) * 50;
        }
    }

    addWall(wall) {
    	this.walls.push(wall);
    }

    addChanger(changer) {
    	this.changers.push(changer);
    }

    move(keyCode) {
        if (keyCode === 65 || keyCode === 37) {
            this.left = true;
            this.leftShow = true; this.rightShow = false;
        } if (keyCode === 68 || keyCode === 39) {
            this.right = true;
            this.rightShow = true; this.leftShow = false;
        } if (keyCode === 32) {
            this.jump = true;
        } if (keyCode === 49) {
        	this.state = 0;
        } if (keyCode === 50) {
        	this.state = 1;
        } if (keyCode === 51) {
        	this.state = 2;
        }
    }

    stop(keyCode) {
        if (keyCode === 65 || keyCode === 37) {
            this.left = false;
        } if (keyCode === 68 || keyCode === 39) {
            this.right = false;
        } if (keyCode === 32) {
            this.jump = false;
        }
    }

    sign(value) {
    	if (value > 0) {
    		return 1;
    	} else if (value < 0) {
    		return -1;
    	} else {
    		return 0;
    	}
    }
}

class Wall {
	constructor(x, y, state) {
		this.x = x;
		this.y = y;
		this.s = 50;
		this.state = state;
        this.selected = false;
        this.wall = loadImage('img/wall.png');
        this.blueWall = loadImage('img/blueWall.png');
        this.blueWallSelected = loadImage('img/blueWallSelected.png');
        this.redWall = loadImage('img/redWall.png');
        this.redWallSelected = loadImage('img/redWallSelected.png');
        this.yellowWall = loadImage('img/yellowWall.png');
        this.yellowWallSelected = loadImage('img/yellowWallSelected.png');
        this.brownWall = loadImage('img/brownWall.png');
	}

	show() {
		if (this.state == 0) {
            if (this.selected) {
                image(this.x, this.y, this.redWallSelected);
            } else {
                image(this.x, this.y, this.redWall);
            }
        } else if (this.state == 1) {
            if (this.selected) {
                image(this.x, this.y, this.yellowWallSelected);
            } else {
                image(this.x, this.y, this.yellowWall);
            }
        } else if (this.state == 2) {
            if (this.selected) {
                image(this.x, this.y, this.blueWallSelected);
            } else {
                image(this.x, this.y, this.blueWall);
            }
        } else if (this.state == 3) {
            image(this.x, this.y, this.wall);
        } else if (this.state == 4) {
            image(this.x, this.y, this.brownWall);
        }
	}
}

class Changer {
	constructor(x, y, state) {
		this.x = x;
		this.y = y;
		this.s = 15;
		this.state = state;
        this.collected = false;
        this.red = loadImage('img/redChanger.png');
        this.blue = loadImage('img/blueChanger.png');
        this.yellow = loadImage('img/yellowChanger.png');
	}

	show() {
        if (!this.collected) {
		    if (this.state == 0) image(this.x, this.y, this.red);
            if (this.state == 1) image(this.x, this.y, this.yellow);
            if (this.state == 2) image(this.x, this.y, this.blue);
        }
	}
}

class Goal {
	constructor(x, y, state) {
		this.x = x;
		this.y = y;
		this.s = 50;
        this.goal = loadImage('img/goal.png')
	}

	show() {
        image(this.x, this.y - 50, this.goal);
	}
}

class Star {
	constructor(x, y, state) {
		this.x = x;
		this.y = y;
		this.s = 12;
		this.collected = false;
        this.star = loadImage('img/star.png')
	}

	show() {
		if (!this.collected) {
        	image(this.x, this.y, this.star);
    	}
	}
}

class Level {
	constructor(json) {
        this.json = json;
		var objects = JSON.parse(json);
		this.name = objects.name;
		this.state = objects.state;
        this.originalState = objects.state;
		this.gameObjects = objects.level;
		this.walls = [];
		this.changers = [];
		this.player = null;
		this.goal = null;
		this.star = null;
		this.hasWon = false;
        this.deaths = 0;
        this.deathScreen = loadImage('img/deathScreen.png');
        this.restartButton = new Button(375, 300, 50, 50, loadImage('img/statRestartButton.png'), loadImage('img/statRestartButtonHover.png'));
	}

	load() {
		for (var y = 0; y < 12; y++) {
			for (var x = 0; x < 16; x++) {
				var element = this.gameObjects[y * 16 + x];
				if (element == 1) this.walls.push(new Wall(x * 50, y * 50, 3));
				if (element == 2) this.walls.push(new Wall(x * 50, y * 50, 0));
				if (element == 3) this.walls.push(new Wall(x * 50, y * 50, 1));
				if (element == 4) this.walls.push(new Wall(x * 50, y * 50, 2));
				if (element == 5) this.walls.push(new Wall(x * 50, y * 50, 4));
				if (element == 6) this.player = new Player(x * 50, y * 50, this.state);
				if (element == 7) this.changers.push(new Changer(x * 50, y * 50, 0));
				if (element == 8) this.changers.push(new Changer(x * 50, y * 50, 1));
				if (element == 9) this.changers.push(new Changer(x * 50, y * 50, 2));
				if (element == 10) this.goal = new Goal(x * 50, y * 50);
				if (element == 11) this.star = new Star(x * 50, y * 50);
			}
		}

		for (var i = 0; i < this.walls.length; i++) {
			this.player.addWall(this.walls[i]);
		}

		for (var i = 0; i < this.changers.length; i++) {
			this.player.addChanger(this.changers[i]);
		}

		this.player.goal = this.goal;
		this.player.star = this.star;
	}

	show() {
		for (var i = 0; i < this.walls.length; i++) {
            if (this.walls[i].state == this.state) {
                this.walls[i].selected = true;
            } else {
                this.walls[i].selected = false;
            }
			this.walls[i].show();
		}
		for (var i = 0; i < this.changers.length; i++) {
			this.changers[i].show();
		}
        this.goal.show();
		this.player.show();
		this.star.show();
        if (this.dead) {
            this.player.y = -100;
            image(0, 0, this.deathScreen);
            this.restartButton.show();
        }
	}

	update() {
		if (this.player.dead) this.dead = true;
		this.hasWon = this.player.hasWon;
		this.state = this.player.state;
		this.player.update();
	}

	input(mode) {
		if (mode == 0) {
			this.player.move(keyCode);
		} else if (mode == 1) {
			this.player.stop(keyCode);
		}
	}

    mouseInput() {
        if (this.restartButton.clicked() && this.dead) {
            this.dead = false;
            this.player.x = this.player.originX; 
			this.player.y = this.player.originY; 
            this.player.horizontalSpeed = 0;
            this.player.verticalSpeed = 0;
			this.player.dead = false; 
            this.player.s = 50;
            this.player.state = this.originalState;
			this.star.collected = false;
            for (var i = 0; i < this.changers.length; i++) {
			    this.changers[i].collected = false;
		    }
            this.deaths++;
        }
    }
}

class Button {
    constructor(x, y, w, h, img, hoverImg) {
        this.x = x;
        this.y = y;
        this.ox = x;
        this.oy = y;
        this.w = w;
        this.h = h;
        this.img = img;
        this.hoverImg = hoverImg;
        this.hover = true;
        this.clickAudio = loadSound('sounds/click.wav', 0.25);
    }

    show() {
        if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
            expandImage(this.x, this.y, this.w, this.h, this.hoverImg);
            this.hover = true;
        } else {
            expandImage(this.x, this.y, this.w, this.h, this.img);
            this.hover = false;
        }
    }

    clicked() {
        if (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h) {
            if (playMusic) playSound(this.clickAudio.cloneNode(true));
            return true;
        }
        return false;
    }
}

class LevelManager {
    constructor(levels) {
        this.levels = levels;
        this.currentLevel = 0;
        this.stars = 0;
        this.levelStars = [];
        for (var i = 0; i < levels.length; i++) {
            this.levelStars[i] = 0;
        }
        this.totalStars = 0;
        this.totalDeaths = 0;
        this.pauseButton = new Button(375, 25, 50, 50, loadImage('img/pauseButton.png'), loadImage('img/pauseButtonHover.png'));
        this.pause = false;
        this.menuButton = new Button(300, 25, 50, 50, loadImage('img/menuButton.png'), loadImage('img/menuButtonHover.png'));
        this.restartButton = new Button(450, 25, 50, 50, loadImage('img/restartButton.png'), loadImage('img/restartButtonHover.png'));
        this.statRestartButton = new Button(308, 325, 75, 75, loadImage('img/statRestartButton.png'), loadImage('img/statRestartButtonHover.png'));
        this.nextLevelButton = new Button(416, 325, 75, 75, loadImage('img/nextLevelButton.png'), loadImage('img/nextLevelButtonHover.png'));
        this.statScreen = false;
        this.addedStars = false;
        this.background = loadImage('img/background.png');
        this.pauseImage = loadImage('img/pauseScreen.png');
        this.statImage = loadImage('img/statScreen.png');
    }

    show() {
        for (var y = 0; y < 6; y++) {
            for (var x = 0; x < 8; x++) {
                image(x * 100, y * 100, this.background);
            }
        }
        this.levels[this.currentLevel].show();
        this.pauseButton.show();
        this.menuButton.show();
        this.restartButton.show();
        text(400, 20, this.levels[this.currentLevel].name, 15, 'Montserrat');
        if (this.statScreen) {
            image(0, 0, this.statImage);
            setColor(255);
            text(400, 275, 'Stars: ' + this.stars, 20, 'Montserrat');
            this.nextLevelButton.show();
            this.statRestartButton.show();
        }
        if (this.paused) {
            image(0, 0, this.pauseImage);
        }
    }

    update() {
        if (!this.paused && !this.statScreen) {
            if (this.levels[this.currentLevel].hasWon) {
                this.statScreen = true;
                if (!this.addedStars) {
                    this.stars++;
                    if (this.levels[this.currentLevel].star.collected) this.stars++;
                    if (this.levels[this.currentLevel].player.s > 20) this.stars++;
                    if (this.levelStars[this.currentLevel] < this.stars) {
                        this.levelStars[this.currentLevel] = this.stars;
                    }
                    this.addedStars = true;
                }
            }
            this.levels[this.currentLevel].update();
            this.totalStars = this.levelStars.reduce(function (t, v) {return t + v;})
        }
    }

    input(mode) {
        if (!this.statScreen || !this.paused) this.levels[this.currentLevel].input(mode);
    }

    mouseInput() {
        this.levels[this.currentLevel].mouseInput();
        if (this.menuButton.clicked()) menu.id = 1;
        if (this.restartButton.clicked()) {
            this.levels[this.currentLevel] = new Level(this.levels[this.currentLevel].json);
            this.levels[this.currentLevel].load();
        }
        if (this.pauseButton.clicked()) {
            if (this.paused) {
                this.paused = false;
            } else {
                this.paused = true;
            }
        }
        if (this.nextLevelButton.clicked() && this.statScreen) {
            this.totalDeaths += this.levels[this.currentLevel].deaths;
            this.statScreen = false;
            this.stars = 0;
            this.addedStars = false;
            this.levels[this.currentLevel] = new Level(this.levels[this.currentLevel].json);
            this.levels[this.currentLevel].load();
            if (this.currentLevel + 1 < this.levels.length) {
                this.currentLevel++;
            } else {
                menu.id = 1
            }
        }
        if (this.statRestartButton.clicked() && this.statScreen) {
            this.totalDeaths += this.levels[this.currentLevel].deaths;
            this.statScreen = false;
            this.stars = 0;
            this.addedStars = false;
            this.levels[this.currentLevel] = new Level(this.levels[this.currentLevel].json);
            this.levels[this.currentLevel].load();
        }
    }

    goToLevel(id) {
        this.levels[id] = new Level(this.levels[id].json);
        this.levels[id].load();
        this.currentLevel = id;
    }
}

class MenuManager {
    constructor() {
        this.id = 0;
        this.totalMenus = 6;
        this.menu1offset = 0;
        this.menu2offset = 0;
        this.menu3offset = 0;
        this.menu4offset = 0;
        this.menu5offset = 0;
        this.transition = 1;
        this.background = loadImage('img/background.png');
        this.levelEditor = loadImage('img/levelEditor.png');
        this.menuBase = loadImage('img/menuBase.png');
        this.creditImage = loadImage('img/credits.png');
        this.directions1Image = loadImage('img/directions1.png');
        this.directions2Image = loadImage('img/directions2.png');
        this.mainMenu = loadImage('img/menu1.png');
        this.levelSelect = loadImage('img/menu2.png');
        this.editor = new Editor(160, 75);
        this.level = null;
        this.soundButton = new Button(725, 525, 50, 50, loadImage('img/soundButton.png'), loadImage('img/soundButtonHover.png'));
        this.editorButton = new Button(338, 215, 138, 50, loadImage('img/editorButton.png'), loadImage('img/editorButtonHover.png'));
        this.soundMuteButton = new Button(725, 525, 50, 50, loadImage('img/soundMuteButton.png'), loadImage('img/soundMuteButtonHover.png'));
        this.backButton = new Button(50, 50, 50, 50, loadImage('img/backButton.png'), loadImage('img/backButtonHover.png'));
        this.playButton = new Button(325, 200, 150, 66, loadImage('img/playButton.png'), loadImage('img/playButtonHover.png'));
        this.playEditButton = new Button(625, 509, 150, 66, loadImage('img/playButton.png'), loadImage('img/playButtonHover.png'));
        this.directionsButton = new Button(325, 316, 150, 66, loadImage('img/directionButton.png'), loadImage('img/directionButtonHover.png'));
        this.previousPageButton = new Button(120, 530, 150, 60, loadImage('img/previousPageButton.png'), loadImage('img/previousPageButtonHover.png'));
        this.nextPageButton = new Button(570, 530, 150, 60, loadImage('img/nextPageButton.png'), loadImage('img/nextPageButtonHover.png'));
        this.creditsButton = new Button(325, 432, 150, 66, loadImage('img/creditButton.png'), loadImage('img/creditButtonHover.png'));
        this.levelButtons = [];
        this.xSpd = 0;
        this.levelImages = [loadImage('img/level1.png'), loadImage('img/level2.png'), loadImage('img/level3.png'), loadImage('img/level4.png'), loadImage('img/level5.png'), loadImage('img/level6.png'), loadImage('img/level7.png'), loadImage('img/level8.png'), loadImage('img/level9.png'), loadImage('img/level10.png')]

        for (var i = 0; i < 10; i++) {
            this.levelButtons.push(new Button(38 + i * 75, 150, 50, 50, loadImage('img/levelButton.png'), loadImage('img/levelButtonHover.png')));
        }
    }

    show() {
        image(0, 0, this.menuBase);
        if (this.id == 0) {
            image(this.menu1offset, 0, this.mainMenu);
            this.playButton.show();
            this.directionsButton.show();
            this.creditsButton.show();
            if (playMusic) {
                this.soundButton.show();
            } else {
                this.soundMuteButton.show();
            }
        } if (this.id == 1) {
            image(this.menu2offset, 0, this.levelSelect);
            setColor(255);
            for (var i = 0; i < this.levelButtons.length; i++) {
                this.levelButtons[i].show();
                text(this.levelButtons[i].x + 25, this.levelButtons[i].y + 30, i + 1, 15, 'Montserrat');
                text(this.menu2offset + 100, 400, 'Deaths: ' + manager.totalDeaths, 30, 'Montserrat');
                text(this.menu2offset + 700, 400, 'Stars: ' + manager.totalStars, 30, 'Montserrat');
                if (manager.totalStars == 30) this.editorButton.show();
                if (this.levelButtons[i].hover) {
                    expandImage(this.menu2offset + 260, 340, 300, 225, this.levelImages[i]);
                    text(this.menu2offset + 320, 320, manager.levels[i].name, 15, 'Montserrat');
                    image(this.menu2offset + 470, 290, loadImage('img/star.png'));
                    text(this.menu2offset + 535, 325, 'x ' + manager.levelStars[i], 25, 'Montserrat');
                }
            }
            this.backButton.show();
        } else if (this.id == 2) {
            image(0, 0, this.directions1Image);
            this.backButton.show();
            this.nextPageButton.show();
        } else if (this.id == 3) {
            image(0, 0, this.directions2Image);
            this.backButton.show();
            this.previousPageButton.show();
        } else if (this.id == 4) {
            image(0, 0, this.creditImage);
            this.backButton.show();
        } else if (this.id == 5) {
            image(0, 0, this.levelEditor)
            this.editor.show();
            this.editor.update();
            this.backButton.show();
            this.playEditButton.show();
        } else if (this.id == 6) {
            for (var y = 0; y < 6; y++) {
                for (var x = 0; x < 8; x++) {
                    image(x * 100, y * 100, this.background);
                }
            }
            this.level.show();
            this.level.update();
            this.backButton.show();
        }
    }

    keyInput(mode) {
        if (this.id == 6) {
            this.level.input(mode);
        }
    }

    mouseInput() {
        if (this.id == 0) {
            if (this.playButton.clicked()) this.id = 1;
            if (this.directionsButton.clicked()) this.id = 2;
            if (this.creditsButton.clicked()) this.id = 4;
            if (this.soundButton.clicked()) {
                if (playMusic) {
                    playMusic = false;
                    music.pause();
                    music.currentTime = 0;
                } else {
                    playMusic = true;
                }
            }
        } else if (this.id == 1) {
            for (var i = 0; i < this.levelButtons.length; i++) {
                if (this.levelButtons[i].clicked()) {
                    this.id = 10;
                    manager.goToLevel(i);
                }
            }
            if (this.editorButton.clicked()) this.id = 5;
            if (this.backButton.clicked()) this.id = 0;
        } else if (this.id == 2) {
            if (this.backButton.clicked()) this.id = 0;
            if (this.nextPageButton.clicked()) this.id = 3;
        } else if (this.id == 3) {
            if (this.backButton.clicked()) this.id = 0;
            if (this.previousPageButton.clicked()) this.id = 2;
        } else if (this.id == 4) {
            if (this.backButton.clicked()) this.id = 0;
        } else if (this.id == 5) {
            if (this.backButton.clicked()) this.id = 1;
            if (this.playEditButton.clicked()) {
                this.level = this.editor.export();
                this.level.load();
                this.id = 6;
            }
            this.editor.mouseInput();
        } else if (this.id == 6) {
            if (this.backButton.clicked()) this.id = 5;
            this.level.mouseInput();
        }
    }
}

class GridSpace {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.id = 0;
        this.s = 30;
        this.state = 0;
        this.wall = loadImage('img/wall.png');
        this.blueWall = loadImage('img/blueWall.png');
        this.redWall = loadImage('img/redWall.png');
        this.yellowWall = loadImage('img/yellowWall.png');
        this.brownWall = loadImage('img/brownWall.png');
        this.playerR = loadImage('img/playerRedRight.png');
        this.playerB = loadImage('img/playerBlueRight.png');
        this.playerY = loadImage('img/playerYellowRight.png');
        this.redChanger = loadImage('img/redChanger.png');
        this.blueChanger = loadImage('img/blueChanger.png');
        this.yellowChanger = loadImage('img/yellowChanger.png');
        this.goal = loadImage('img/goal.png');
        this.star = loadImage('img/star.png');
        this.clear = loadImage('img/clear.png');
    }

    show() {
        if (this.id == 0) {
            expandImage(this.x, this.y, this.s, this.s, this.clear);
        } else if (this.id == 1) {
            expandImage(this.x, this.y, this.s, this.s, this.wall);
        } else if (this.id == 2) {
            expandImage(this.x, this.y, this.s, this.s, this.redWall);
        } else if (this.id == 3) {
            expandImage(this.x, this.y, this.s, this.s, this.yellowWall);
        } else if (this.id == 4) {
            expandImage(this.x, this.y, this.s, this.s, this.blueWall);
        } else if (this.id == 5) {
            expandImage(this.x, this.y, this.s, this.s, this.brownWall);
        } else if (this.id == 6) {
            if (this.state == 0) {
                expandImage(this.x, this.y, this.s, this.s, this.playerR);
            } else if (this.state == 1) {
                expandImage(this.x, this.y, this.s, this.s, this.playerY);
            } else if (this.state == 2) {
                expandImage(this.x, this.y, this.s, this.s, this.playerB);
            }
        } else if (this.id == 7) {
            expandImage(this.x, this.y, this.s, this.s, this.redChanger);
        } else if (this.id == 8) {
            expandImage(this.x, this.y, this.s, this.s, this.blueChanger);
        } else if (this.id == 9) {
            expandImage(this.x, this.y, this.s, this.s, this.yellowChanger);
        } else if (this.id == 10) {
            expandImage(this.x, this.y - this.s, this.s, this.s * 2, this.goal);
        } else if (this.id == 11) {
            expandImage(this.x, this.y, this.s, this.s, this.star);
        }
        setColor(0);
        rect(this.x, this.y, this.s, 1);
        rect(this.x, this.y, 1, this.s);
        rect(this.x, this.y + this.s, this.s, 1);
        rect(this.x + this.s, this.y, 1, this.s);
    }

    clicked(id) {
        if (mouseX > this.x && mouseX < this.x + this.s && mouseY > this.y && mouseY < this.y + this.s) {
            this.id = id;
        }
    }
}

class GridChanger {
    constructor(x, y, id) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.s = 30;
        this.state = 0;
        this.wall = loadImage('img/wall.png');
        this.blueWall = loadImage('img/blueWall.png');
        this.redWall = loadImage('img/redWall.png');
        this.yellowWall = loadImage('img/yellowWall.png');
        this.brownWall = loadImage('img/brownWall.png');
        this.playerR = loadImage('img/playerRedRight.png');
        this.playerB = loadImage('img/playerBlueRight.png');
        this.playerY = loadImage('img/playerYellowRight.png');
        this.redChanger = loadImage('img/redChanger.png');
        this.blueChanger = loadImage('img/blueChanger.png');
        this.yellowChanger = loadImage('img/yellowChanger.png');
        this.goal = loadImage('img/goal.png');
        this.star = loadImage('img/star.png');
        this.clear = loadImage('img/clear.png');
        this.clickAudio = loadSound('sounds/click.wav', 0.25);
    }

    show() {
        if (this.id == 0) {
            expandImage(this.x, this.y, this.s, this.s, this.clear);
        } else if (this.id == 1) {
            expandImage(this.x, this.y, this.s, this.s, this.wall);
        } else if (this.id == 2) {
            expandImage(this.x, this.y, this.s, this.s, this.redWall);
        } else if (this.id == 3) {
            expandImage(this.x, this.y, this.s, this.s, this.yellowWall);
        } else if (this.id == 4) {
            expandImage(this.x, this.y, this.s, this.s, this.blueWall);
        } else if (this.id == 5) {
            expandImage(this.x, this.y, this.s, this.s, this.brownWall);
        } else if (this.id == 6) {
            if (this.state == 0) {
                expandImage(this.x, this.y, this.s, this.s, this.playerR);
            } else if (this.state == 1) {
                expandImage(this.x, this.y, this.s, this.s, this.playerY);
            } else if (this.state == 2) {
                expandImage(this.x, this.y, this.s, this.s, this.playerB);
            }
        } else if (this.id == 7) {
            expandImage(this.x, this.y, this.s, this.s, this.redChanger);
        } else if (this.id == 8) {
            expandImage(this.x, this.y, this.s, this.s, this.blueChanger);
        } else if (this.id == 9) {
            expandImage(this.x, this.y, this.s, this.s, this.yellowChanger);
        } else if (this.id == 10) {
            expandImage(this.x, this.y - this.s, this.s, this.s * 2, this.goal);
        } else if (this.id == 11) {
            expandImage(this.x, this.y, this.s, this.s, this.star);
        }
        setColor(0);
        rect(this.x, this.y, this.s, 1);
        rect(this.x, this.y, 1, this.s);
        rect(this.x, this.y + this.s, this.s, 1);
        rect(this.x + this.s, this.y, 1, this.s);
    }

    clicked() {
        if (mouseX > this.x && mouseX < this.x + this.s && mouseY > this.y && mouseY < this.y + this.s) {
            return true;
        }
        return false;
    }
}

class Editor {
    constructor(a, b) {
        this.grid = [];
        this.changers = [];
        this.id = 0;
        this.x = a;
        this.y = b;
        this.clicked = false;
        this.play = false;
        this.level = null;
        this.state = 0;
        this.background = loadImage('img/background.png');
        this.clickAudio = loadSound('sounds/click.wav', 0.25);

        for (var y = 0; y < 12; y++) {
            for (var x = 0; x < 16; x++) {
                this.grid.push(new GridSpace(a + x * 30, b + y * 30));
            }
        }

        for (var i = 0; i < 12; i++) {
            this.changers.push(new GridChanger((a + 60) + i * 30, b + (14 * 30), i));
        }
    }

    show() {
        for (var y = 0; y < 6; y++) {
            for (var x = 0; x < 8; x++) {
                expandImage(this.x + x * 60, this.y + y * 60, 60, 60,this.background);
            }
        }

        for (var i = 0; i < this.grid.length; i++) {
            this.grid[i].show();
        }

        for (var i = 0; i < this.changers.length; i++) {
            this.changers[i].show();
        }
    }

    update() {
        if (mousedown) {
            for (var i = 0; i < this.grid.length; i++) {
                this.grid[i].clicked(this.id);
                if (playMusic && !this.clicked) playSound(this.clickAudio.cloneNode(true));
                this.clicked = true;
            }
        } else {
            this.clicked = false;
        }

        for (var i = 0; i < this.grid.length; i++) {
            this.grid[i].state = this.state;
        }

        for (var i = 0; i < this.changers.length; i++) {
            this.changers[i].state = this.state;
        }
    }

    mouseInput() {
        for (var i = 0; i < this.changers.length; i++) {
            if (this.changers[i].clicked()) {
                this.id = this.changers[i].id;
                if (playMusic) playSound(this.clickAudio.cloneNode(true));
            }
        }
    }

    export() {
        var array = [];
        for (var i = 0; i < this.grid.length; i++) {
            array[i] = this.grid[i].id;
        }
        var object = {level: array, name: "Test Level", state: this.grid[0].state};
        return new Level(JSON.stringify(object));
    }
}

class Particle {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.xVel = 0;
		this.yVel = 0;
		this.xSpd = random(0, 1);
		this.ySpd = random(0, 1);
	}

	show() {
		setColor(255, 0, 0);
		ellipse(this.x, this.y, 10, 10)
	}

	update() {
		this.xVel -= this.xSpd;
		this.yVel -= this.ySpd;
		this.xVel *= 0.99;
		this.yVel += 0.2;
		this.x += this.xVel;
		this.y += this.yVel;
	}
}