var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {preload:preload, create:create});

function preload() {
	game.load.image("icon", "assets/Kirby_Icon.png");
}

function create() {
	kirby = game.add.sprite(game.world.centerX, game.world.centerY, "icon");
	kirby.anchor.setTo(0.5);
}