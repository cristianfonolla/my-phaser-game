import Phaser from 'phaser'
import Player from '../sprites/Player'

export default class extends Phaser.State {

  preload() {

    this.game.load.tilemap('tilemap', '/assets/tilemaps/myterrain.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', '/assets/tilemaps/terrain_atlas.png');
    this.game.load.spritesheet('player', '/assets/images/player.png', 28, 22)
    this.game.load.audio('jump', '/assets/sounds/jump.wav')
    this.game.load.audio('dungeon', '/assets/sounds/dsound.mp3',true)

  }

  create() {

    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    this.MAX_SPEED = 500; // pixels/second
    this.ACCELERATION = 1500; // pixels/second/second
    this.DRAG = 600; // pixels/second
    this.GRAVITY = 2600; // pixels/second/second
    this.JUMP_SPEED = -1000; // pixels/second (negative y is up)

    this.map = this.game.add.tilemap('tilemap');
    this.map.addTilesetImage('tiles', 'tiles');
    this.jumpSound = this.game.add.audio('jump')
    this.dsound = this.game.add.audio('dungeon')
    this.dsound.loop = true
    this.dsound.play()

    this.terrainLayer = this.map.createLayer('MyTerrain1');
    this.colLayer = this.map.createLayer('colisionable');
    this.map.setCollisionBetween(1, 5000, true, 'colisionable');


    this.terrainLayer.resizeWorld();
    this.terrainLayer.wrap = true;

    this.spawnPlayer()

    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

    this.player.enableBody = true
    this.player.body.setSize(20, 20, 0, 0)
    this.hasJumped = true
    this.player.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10); // x, y
    this.player.body.drag.setTo(this.DRAG, 0); // x, y
    game.physics.arcade.gravity.y = this.GRAVITY;

    this.player.animations.add('idle', [3, 4, 5, 4], 5, true)
    this.player.animations.play('idle')

    this.cursors = this.game.input.keyboard.createCursorKeys();

    //new SoundManager(this.game).add('dungeon',1,true)


  }

  update() {



    this.game.physics.arcade.collide(this.player, this.colLayer);

    // this.player.body.velocity.y = 0;
    // this.player.body.velocity.x = 0;

    //this.inputs()

    if (this.leftInputIsActive()) {
      // If the LEFT key is down, set the player velocity to move left
      this.player.body.acceleration.x = -this.ACCELERATION;
    } else if (this.rightInputIsActive()) {
      // If the RIGHT key is down, set the player velocity to move right
      this.player.body.acceleration.x = this.ACCELERATION;

    } else {
      this.player.body.acceleration.x = 0;
    }

    // Set a variable that is true when the player is touching the ground
    var onTheGround = this.player.body.blocked.down;

    if (onTheGround && this.upInputIsActive()) {
      // Jump when the player is touching the ground and the up arrow is pressed
      this.player.body.velocity.y = this.JUMP_SPEED;
      this.jumpSound.play()
    }


  }

  inputs() {
    if (this.cursors.up.isDown) {
      this.player.body.velocity.y = -250;
    }
    else if (this.cursors.down.isDown) {
      this.player.body.velocity.y = 250;
    }
    if (this.cursors.left.isDown) {
      this.player.body.velocity.x = -250;
      this.player.frame = 2
    }
    else if (this.cursors.right.isDown) {
      this.player.body.velocity.x = 250;
      this.player.frame = 1
    } else {
      this.player.body.velocity.x = 0;
    }

    if (this.player.body.touching.down) {
      this.hasJumped = false
    }
  }

  spawnPlayer() {
    if (this.playerIsDead) {
      this.player.x = 350
      this.player.y = 101
      this.playerIsDead = false
    } else {
      this.player = new Player({
        game: this.game,
        x: 80,
        y: 615,
        asset: 'player'
      })
      this.game.add.existing(this.player)
    }
  }

  jumpPlayer() {
    if (!this.hasJumped) {
      this.player.body.velocity.y = -220
      // this.jumpSound.play()
      this.hasJumped = true
    }
  }

  leftInputIsActive() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.LEFT);
    isActive |= (this.game.input.activePointer.isDown &&
    this.game.input.activePointer.x < this.game.width / 4);

    return isActive;
  }

  rightInputIsActive() {
    var isActive = false;

    isActive = this.input.keyboard.isDown(Phaser.Keyboard.RIGHT);
    isActive |= (this.game.input.activePointer.isDown &&
    this.game.input.activePointer.x > this.game.width / 2 + this.game.width / 4);

    return isActive;
  }

// This function should return true when the player activates the "jump" control
// In this case, either holding the up arrow or tapping or clicking on the center
// part of the screen.
  upInputIsActive(duration) {

    var isActive = false;

    isActive = this.input.keyboard.downDuration(Phaser.Keyboard.UP, duration);
    isActive |= (this.game.input.activePointer.justPressed(duration + 1000 / 60) &&
    this.game.input.activePointer.x > this.game.width / 4 &&
    this.game.input.activePointer.x < this.game.width / 2 + this.game.width / 4);

    return isActive;
  }

}