// Enemies our player must avoid
// Parameter: row, current grid row of enemy
var Enemy = function (row) {
	// Variables applied to each of our instances go here,
	// we've provided one for you to get started

	// The image/sprite for our enemies, this uses
	// a helper we've provided to easily load images
	this.sprite = 'images/enemy-bug.png';
	this.row = row;
	this.speedFactor = row * 0.5; // adjusts speed of enemy based on row
	this.x = -101 * row; // inititializes start x coordinate based on assigned row
	this.y = 55 + 85 * (3 - row); // initializes y coordinate based on row
	// computes enemy sprite width
	this.width = function () {
		return Resources.get(this.sprite).width;
	};
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
	// You should multiply any movement by the dt parameter
	// which will ensure the game runs at the same speed for
	// all computers.
	this.x += 100 * dt * Math.random() * this.speedFactor;  // updates the x coordinate
	// Resets the x coordinate if the enemy has moved off screen
	if (this.x > canvas.width) {
		this.x = -101;
	}
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var player = function () {
	this.sprite = 'images/char-boy.png';  // player sprite
	this.level = 0; // player level
	this.x = 0; // starting x coordinate
	this.y = 68 + 85 * 4; // starting y coordinate
	// Compute width of player sprite
	this.width = function () {
		return Resources.get(this.sprite).width;
	};
	// Compute height of player sprite
	this.height = function () {
		return Resources.get(this.sprite).height;
	};
};

// Handle player/enemy collisions
player.prototype.isCollision = function (player, enemy) {
	// initialize collision status to false
	var collision = false;

	// Compute current player and enemy horizontal centers
	var playerHCenter = player.x + player.width() / 2;
	var enemyHCenter = enemy.x + enemy.width() / 2;

	// Test for same row, if y coordinates are within 50, player and enemy are on same row
	if (Math.abs(player.y - enemy.y) < 50) {
		// Test for same column, if player and enemy centers are within 90% of player width, collision is true
		if (Math.abs(playerHCenter - enemyHCenter) < 0.9 * player.width()) {
			collision = true;
		};
	};

	// return collision status
	return collision;
};

// Determine if player has reached goal and reward according to player level
player.prototype.isWinner = function () {
	var winner = false;

	// sprites array is used to identify current reward
	var sprites = [
		'images/gem blue.png',
		'images/gem green.png',
		'images/gem orange.png',
		'images/heart.png',
		'images/star.png'
	];

	// If player is within 100 px of top of canvas, player is a winner
	if (this.y < 100) {

		// Determine how many rewards player has won
		var rewardCount = allRewards.length;

		// If rewards for the current level is at max, clear allRewards array and increase player level
		if (rewardCount == 5) {
			clearRewards();
			this.level++;
		};

		// Add new reward to allRewards, and set winner to true
		allRewards.push(new reward(sprites[this.level]));
		winner = true;
	};

	// return winner status
	return winner;
};

// Move player to starting position
player.prototype.reset = function () {
	this.x = 0;
	this.y = 68 + 85 * 4;
};

// Update player based on possible collision or success
player.prototype.update = function () {
	for (var idx = 0; idx < allEnemies.length; idx++) {

		// Handle Collision
		if (player.isCollision(player, allEnemies[idx])) {
			this.reset();
		}
	}

	//  If winner, reset to starting position
	if (this.isWinner()) this.reset();
};

// Render player and run update to check status
player.prototype.render = function () {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	this.update();
};

// Handle keyboard input to move player
// Paarameter: keycode - keyboard input from user
player.prototype.handleInput = function (keycode) {
	// Set stepsizes
	var lrStepsize = canvas.width / 5;
	var udStepsize = canvas.width / 6;

	// Based on keycode provided set new player coordinates
	// Do not move if the requested move would make the player move offscreen
	switch (keycode) {
		case 'right':
			if (this.x + lrStepsize < canvas.width - 70) this.x += lrStepsize;
			break;
		case 'left':
			if (this.x - lrStepsize >= 0) this.x -= lrStepsize;
			break;
		case 'up':
			if (this.y - udStepsize >= -70) this.y -= udStepsize;
			break;
		case 'down':
			if (this.y + udStepsize < canvas.height - 170) this.y += udStepsize;
			break;
		default:
			break;
	}
};

// Define reward object
var reward = function (sprite) {
	this.x = 0;
	this.y = 40;
	this.sprite = sprite;
};

// Render reward sprites
reward.prototype.render = function () {
	// Get sprite and set output scaling
	var sprite = Resources.get(this.sprite);
	var scaleHeight = .5 * sprite.height;
	var scaleWidth = .5 * sprite.width;

	// for each award, draw the scaled sprite
	for (var idx = 0; idx < allRewards.length; idx++) {
		ctx.drawImage(sprite, 25 + 101 * idx, this.y, scaleWidth, scaleHeight);
	};
};

// Clear reward tally
function clearRewards() {
	for (var idx = 0; idx < rewardCount; idx++) {
		allRewards.pop();
	};
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var enemyCount = 3;
var allRewards = [];

for (var idx = 0; idx < enemyCount; idx++) {
	var e = new Enemy(idx % 3 + 1);

	allEnemies.push(e);
};

var player = new player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
	var allowedKeys = {
		37: 'left',
		38: 'up',
		39: 'right',
		40: 'down'
	};

	player.handleInput(allowedKeys[e.keyCode]);
});
