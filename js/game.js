var game = new Phaser.Game(960, 640, Phaser.AUTO, '', {preload:preload, create:create, update:update});

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
var scale = 4;

function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);

	initBackground();
	initMap();
	initNormalKirby();

	controller = game.input.keyboard.createCursorKeys();

}

function update() {
	if(controller.right.isDown) {
		kirby.animations.play("walk");
		kirby.scale.x = scale;
		kirby.body.velocity.x = 0.1;
		kirby.body.x += 2;
		if(kirby.body.x >= game.world.width-30){
			kirby.body.x = 0;
		}
	}
	else if(controller.left.isDown) {
		kirby.animations.play("walk");
		kirby.scale.x = -scale;
		kirby.body.velocity.x = -0.1;
		kirby.body.x -= 2;
		if(kirby.body.x <= 0) {
			kirby.body.x = game.world.width-30;
		}
	}
	else if(controller.up.isDown) {
		kirby.animations.play("fly");
		kirby.body.velocity.y = -1;
		kirby.body.y += -1;
	}
	else {
		kirby.body.velocity.x = 0;
		kirby.animations.play("idle");
	}
}

function initBackground() {
	background = game.add.sprite(0, 0, "background");
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
}

function initNormalKirby() {
	kirby = game.add.sprite(100, game.world.height, "kirby");

	//anchor center
	kirby.anchor.setTo(0.5,0.5);

	//enable physics
	game.physics.arcade.enable(kirby);
	kirby.body.gravity.y = 50;
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