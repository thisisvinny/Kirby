var scale = 3;
//dimensions of the map are written here
var mapWidth = 1216;
var mapHeight = 176;

var game = new Phaser.Game(240*scale, mapHeight*scale, Phaser.AUTO, '', {preload:preload, create:create, update:update});

function preload() {
	game.load.atlas("kirby", "assets/sprites/normal_kirby/normal_kirby.png", "assets/sprites/normal_kirby/normal_kirby.json");
	game.load.image("background", "assets/maps/introBG.png");
	game.load.tilemap("tilemap_intro001", "assets/maps/intro001/intro001.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.image("map_intro001", "assets/maps/intro001/intro001.png");
}

var kirby;
var background;
var map;
var controller;

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);

	initBackground();
	initMap();
	initNormalKirby();

	kirby.body.setSize(0,0,50,50);

	controller = game.input.keyboard.createCursorKeys();
}

function update() {
	game.physics.arcade.collide(kirby, groundLayer);

	//have to check for compound movements first before doing singular movements
	//i.e. jump+left checks before left, otherwise jump+left will never get checked

	//fly kirby to the right
	if(controller.up.isDown && controller.right.isDown) {
		kirby.animations.play("fly");
		//face the right
		kirby.scale.x = scale;
		kirby.body.x += 2;
		kirby.body.y -= 2;
		kirby.body.velocity.y = -10;
		//move background with kirby
		background.tilePosition.x += 0.5;
	}
	//fly kirby to the left
	else if(controller.up.isDown && controller.left.isDown) {
		kirby.animations.play("fly");
		kirby.scale.x = -scale;
		kirby.body.x -= 2;
		kirby.body.y -= 2;
		kirby.body.velocity.y = -10;
		background.tilePosition.x -= 0.5;
	}
	//kirby is falling from the air to the right (he cannot walk or run)
	else if(kirby.body.y != game.world.height && controller.right.isDown) {
		kirby.animations.play("fall");
		kirby.scale.x = scale;
		kirby.body.x += 2;
		kirby.body.y += 4;
		kirby.body.velocity.y = 10;
		background.tilePosition.x += 0.5;
	}
	//kirby is falling from the air to the left (he cannot walk or run)
	else if(kirby.body.y != game.world.height && controller.left.isDown) {
		kirby.animations.play("fall");
		kirby.scale.x = -scale;
		kirby.body.x -= 2;
		kirby.body.y += 4;
		kirby.body.velocity.y = 10;
		background.tilePosition.x -= 0.5;
	}
	//run kirby to the right
	else if(kirby.body.velocity.x >= 150 && controller.right.isDown) {
		kirby.animations.play("run");
		kirby.scale.x = scale;
		kirby.body.x += 4;
		background.tilePosition.x += 0.5;
	}
	//walk kirby to the right
	else if(controller.right.isDown) {
		kirby.animations.play("walk");
		kirby.scale.x = scale;
		kirby.body.x += 2;
		kirby.body.velocity.x += 2;
		background.tilePosition.x += 0.5;
	}
	//run kirby to the left
	else if(kirby.body.velocity.x <= -150 && controller.left.isDown) {
		kirby.animations.play("run");
		kirby.scale.x = -scale;
		kirby.body.x -= 4;
		background.tilePosition.x -= 0.5
	}
	//walk kirby to the left
	else if(controller.left.isDown) {
		kirby.animations.play("walk");
		kirby.scale.x = -scale;
		kirby.body.x -= 2;
		kirby.body.velocity.x -= 2;
		background.tilePosition.x -= 0.5;
	}
	//jump kirby (can only jump if he's on the ground or platform)
	else if(controller.up.isDown && kirby.body.y == game.world.height) {
		kirby.animations.play("jump");
		kirby.body.y -= 50;
		kirby.body.velocity.y = -30;
	}
	//fly kirby (note: does not check for if on ground or platorm, so kirby will fly every other time up is clicked)
	else if(controller.up.isDown) {
		kirby.animations.play("fly");
		kirby.body.y -= 2;
		kirby.body.velocity.y = -10;
	}
	//crouch kirby
	else if(controller.down.isDown) {
		kirby.animations.play("crouch");
		kirby.body.velocity.x = 0;
	}
	//stop moving kirby
	else {
		//if kirby is in the air and he has no other inputs, he just idlely falls
		if(kirby.body.y != game.world.height) {
			kirby.animations.play("fall");
			kirby.body.y += 4;
		}
		//if kirby not in air, he will stand there idlely
		else {
			kirby.animations.play("idle");
			kirby.body.velocity.x = 0;
		}
	}
}

function initBackground() {
	background = game.add.tileSprite(0, 0, mapWidth*scale, mapHeight*scale, "background");
	background.scale.setTo(scale, scale);
}

function initMap() {
	map = game.add.tilemap("tilemap_intro001");
	map.addTilesetImage("intro001", "map_intro001");
	foregroundLayer = map.createLayer("foreground");
	groundLayer = map.createLayer("ground");
	platformLayer = map.createLayer("platform");
	wtfLayer = map.createLayer("wtf");

	foregroundLayer.scale.setTo(scale,scale);
	platformLayer.scale.setTo(scale,scale);
	groundLayer.scale.setTo(scale,scale);
	wtfLayer.scale.setTo(scale,scale);

	map.setCollision([76, 80, 84, 88, 92, 16, 609, 610, 611, 613, 614, 615, 617, 618, 619, 621, 
						622, 623, 549, 550, 627, 628, 629, 630, 631, 632, 252, 328, 404, 480, 556, 
						253, 254, 255, 331, 407, 408, 484, 485, 561, 637, 638, 639, 640, 641, 642, 
						643, 644, 645, 646, 647, 571, 572, 573, 497, 498, 499, 500, 501, 502, 503, 
						427, 428, 429, 430, 506, 582, 583, 584, 660, 661, 662, 663, 664, 665, 666, 
						667, 668, 669, 593, 594, 595, 596, 672, 673, 674, 675, 676, 679, 680, 291, 
						292, 142, 143, 219, 295, 371, 372, 220, 221, 222, 298, 301, 302, 226, 151, 
						75, 378, 454, 530, 606, 681, 682], true, "ground");

	//the world is the dimensions of the map * the scale 
	game.world.setBounds(0, 0, mapWidth*scale, mapHeight*scale);
}

function initNormalKirby() {
	kirby = game.add.sprite(100, 100, "kirby");

	//camera follows kirby
	game.camera.follow(kirby);

	//anchor center
	kirby.anchor.setTo(0.5,0.5);

	//enable physics
	game.physics.arcade.enable(kirby);
	kirby.body.gravity.y = 100;
	kirby.body.collideWorldBounds = true;

	kirby.scale.setTo(scale,scale);
	//add animations
	//each spritesheet has to be broken down into smaller, specific animations later
	kirby.animations.add("climb", Phaser.Animation.generateFrameNames("climb", 1, 14, "", 3), 10, true);
	kirby.animations.add("crouch", Phaser.Animation.generateFrameNames("crouch", 1, 8, "", 3), 10, true);
	kirby.animations.add("fall", Phaser.Animation.generateFrameNames("fall", 1, 13, "", 3), 10, true);
	kirby.animations.add("fly", Phaser.Animation.generateFrameNames("fly", 1, 16, "", 3), 10, true);
	kirby.animations.add("idle", Phaser.Animation.generateFrameNames("idle", 1, 2, "", 3), 2, true); //idle goes up to 20
	kirby.animations.add("jump", Phaser.Animation.generateFrameNames("jump", 1, 10, "", 3), 10, true);
	kirby.animations.add("roll", Phaser.Animation.generateFrameNames("roll", 1, 16, "", 3), 10, true);
	kirby.animations.add("run", Phaser.Animation.generateFrameNames("run", 1, 9, "", 3), 10, true);
	kirby.animations.add("walk", Phaser.Animation.generateFrameNames("walk", 1, 10, "", 3), 10, true);
}