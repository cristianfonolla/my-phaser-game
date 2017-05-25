import Phaser from 'phaser'
import Player from '../sprites/Player'

export default class extends Phaser.State {

  preload() {

    this.game.load.tilemap('tilemap', '/assets/tilemaps/myterrain.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', '/assets/tilemaps/terrain_atlas.png');
    this.game.load.image('browndoor', '/assets/images/browndoor.png');
    this.game.load.spritesheet('player', '/assets/images/player.png', 28, 22)
    this.game.load.audio('jump', '/assets/sounds/jump.wav')

  }

  create() {

    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    this.browndoor = this.game.add.sprite(80, 615 , 'browndoor');

    this.MAX_SPEED = 500; // pixels/second
    this.ACCELERATION = 1500; // pixels/second/second
    this.DRAG = 600; // pixels/second
    this.GRAVITY = 2000; // pixels/second/second
    this.JUMP_SPEED = -1000; // pixels/second (negative y is up)

    this.map = this.game.add.tilemap('tilemap');
    this.map.addTilesetImage('tiles', 'tiles');
    this.jumpSound = this.game.add.audio('jump')

    this.terrainLayer = this.map.createLayer('MyTerrain1');
    this.colLayer = this.map.createLayer('Spawn');
    this.colLayer = this.map.createLayer('colisionable');
    this.map.setCollisionBetween(1, 5000, true, 'colisionable');

    var result = this.findObjectsByType('item', this.map, 'object')

    this.terrainLayer.resizeWorld();
    this.terrainLayer.wrap = true;

    this.spawnPlayer()
    //this.createItems()

    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

    this.player.enableBody = true
    this.player.body.setSize(20, 20, 0, 0)
    this.player.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10); // x, y
    this.player.body.drag.setTo(this.DRAG, 0); // x, y
    game.physics.arcade.gravity.y = this.GRAVITY;

    this.player.animations.add('idle', [3, 4, 5, 4], 5, true)
    this.player.animations.play('idle')

    this.keyEsc = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    //new SoundManager(this.game).add('dungeon',1,true)


  }

  update() {


    this.game.physics.arcade.collide(this.player, this.colLayer);

    // this.player.body.velocity.y = 0;
    // this.player.body.velocity.x = 0;

    this.inputs()

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

  createItems() {
    this.items = this.game.add.group();
    this.items.enableBody = true;
    var item;
    var result = this.findObjectsByType('item', this.map, 'object');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.items);
    }, this);

  }

  findObjectsByType(type, map, layer) {
    var result = []
    map.objects[layer].forEach(function(element){
      if(element.properties.type === type) {
        //Phaser uses top left, Tiled bottom left so we have to adjust the y position
        //also keep in mind that the cup images are a bit smaller than the tile which is 16x16
        //so they might not be placed in the exact pixel position as in Tiled
        element.y -= map.tileHeight;
        result.push(element);
      }
    });
    return result;
  }

  inputs() {
    if (this.keyEsc.isDown) {
      this.game.state.start('Menu');

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