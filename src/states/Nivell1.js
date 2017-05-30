import Phaser from 'phaser'
import Player from '../sprites/Player'
//import Nivell1 from './'

export default class extends Phaser.State {

  preload() {

    this.game.load.tilemap('tilemap', '/assets/tilemaps/myterrain.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', '/assets/tilemaps/terrain_atlas.png');
    this.game.load.image('door', '/assets/images/browndoor.png');
    this.game.load.image('mushroom', '/assets/images/mushroom.png');
    this.game.load.image('bluemushroom', '/assets/images/bluemushroom.png');
    this.game.load.image('php', '/assets/images/php.png');
    this.game.load.image('exp', '/assets/images/exp.png');
    this.game.load.image('3hearts', '/assets/images/w3hearts.png');
    this.game.load.image('2hearts', '/assets/images/w2hearts.png');
    this.game.load.image('1hearts', '/assets/images/w1hearts.png');
    this.game.load.image('minimush', '/assets/images/minimush.png');
    this.game.load.spritesheet('player', '/assets/images/player.png', 28, 22);
    this.game.load.audio('jump', '/assets/sounds/jump.wav');
    this.game.load.audio('takeMushroom', '/assets/sounds/takeMushroom.mp3');
    this.game.load.audio('dead', '/assets/sounds/dead.wav');
    this.game.load.audio('windowsIN', '/assets/sounds/windowsIN.wav');

    // console.log(game.world.width + ' preload 1 width')
    // console.log(game.world.height + ' preload 1 height')

  }

  create() {

    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    this.dsound = this.game.add.audio('dungeon')
    this.dsound.loop = true

    if (window.enableSound || window.enableSound == null) {
      this.dsound.volume = 0.2
      this.dsound.play()
    }

    this.MAX_SPEED = 500; // pixels/second
    this.ACCELERATION = 1500; // pixels/second/second
    this.DRAG = 600; // pixels/second
    this.GRAVITY = 2000; // pixels/second/second
    this.JUMP_SPEED = -1000; // pixels/second (negative y is up)

    this.map = this.game.add.tilemap('tilemap');
    this.map.addTilesetImage('tiles', 'tiles');
    this.jumpSound = this.game.add.audio('jump')
    this.tMushSound = this.game.add.audio('takeMushroom')
    this.dead = this.game.add.audio('dead')
    this.windowsIN = this.game.add.audio('windowsIN')

    this.terrainLayer = this.map.createLayer('MyTerrain1');
    this.colLayer = this.map.createLayer('Spawn');
    this.colLayer = this.map.createLayer('colisionable');
    this.map.setCollisionBetween(1, 5000, true, 'colisionable');
    this.threeHearts = this.game.add.sprite(0, 20, '3hearts');
    this.twoHearts = this.game.add.sprite(0, 20, '2hearts');
    this.oneHeart = this.game.add.sprite(0, 20, '1hearts');
    this.lifeCounter = 3

    var result = this.findObjectsByType('item', this.map, 'coinsObject')
    var resultEnemy = this.findObjectsByType('item', this.map, 'enemyObject')
    var resultOneUp = this.findObjectsByType('item', this.map, 'oneUpObject')
    var resultDown = this.findObjectsByType('item', this.map, 'downObject')
    var resultDoor = this.findObjectsByType('item', this.map, 'doorObject')

    this.terrainLayer.resizeWorld();
    this.terrainLayer.wrap = true;

    this.spawnPlayer()
    this.createItems()
    this.createEnemy()
    this.createOneUps()
    this.createDoors()
    this.setScoreText()
    this.setParticles()

    this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

    this.player.enableBody = true
    this.player.body.setSize(20, 20, 0, 0)
    this.player.body.maxVelocity.setTo(this.MAX_SPEED, this.MAX_SPEED * 10); // x, y
    this.player.body.drag.setTo(this.DRAG, 0); // x, y

    this.player.animations.add('idle', [3, 4, 5, 4], 5, true)
    this.player.animations.play('idle')
    this.player.body.gravity.y = this.GRAVITY

    this.keyEsc = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    this.Collectedcoins = 0

  }

  update() {

    this.game.physics.arcade.collide(this.player, this.colLayer);
    this.game.physics.arcade.overlap(this.player, this.items, this.collect, null, this);
    this.game.physics.arcade.overlap(this.player, this.enemys, this.die, null, this);
    this.game.physics.arcade.overlap(this.player, this.mini, this.makeDown, null, this);
    this.game.physics.arcade.overlap(this.player, this.doors, this.changeLevel, null, this);
    if (this.lifeCounter < 3) {
      this.game.physics.arcade.overlap(this.player, this.OneUps, this.oneUp, null, this);
    }

    this.inputs()

    if (this.leftInputIsActive()) {
      // If the LEFT key is down, set the player velocity to move left
      this.player.body.acceleration.x = -this.ACCELERATION;
      this.player.frame = 2
    } else if (this.rightInputIsActive()) {
      // If the RIGHT key is down, set the player velocity to move right
      this.player.body.acceleration.x = this.ACCELERATION;
      this.player.frame = 1
    } else {
      this.player.body.acceleration.x = 0;
    }

    // Set a variable that is true when the player is touching the ground
    var onTheGround = this.player.body.blocked.down;

    if (onTheGround && this.upInputIsActive()) {
      // Jump when the player is touching the ground and the up arrow is pressed
      this.player.body.velocity.y = this.JUMP_SPEED;
      this.player.frame = 3
      this.jumpSound.play()
    }

    this.seeLifes()

  }


  makeDown(player, collectable) {

    this.Collectedcoins = this.Collectedcoins + 2
    this.scoreText.setText('Score: ' + this.Collectedcoins)

    this.player.scale.setTo(0.3, 0.3)
    collectable.destroy()

  }

  changeLevel(player, door) {
    this.dsound.stop()
    this.game.state.start('Nivell2');
  }

  oneUp(player, collectable) {
    this.lifeCounter = this.lifeCounter + 1
    this.windowsIN.volume = 15
    this.windowsIN.play()
    collectable.destroy()
  }

  createDoors() {

    this.doors = this.game.add.group();
    this.doors.enableBody = true;
    var OneUp;
    var result = this.findObjectsByType('door', this.map, 'doorObject');
    result.forEach(function (element) {
      this.createFromTiledObject(element, this.doors);
    }, this);

  }

  createOneUps() {

    this.OneUps = this.game.add.group();
    this.OneUps.enableBody = true;
    var OneUp;
    var result = this.findObjectsByType('oneUp', this.map, 'oneUpObject');
    result.forEach(function (element) {
      this.createFromTiledObject(element, this.OneUps);
    }, this);

    this.mini = this.game.add.group();
    this.mini.enableBody = true;
    var mini;
    var resultMini = this.findObjectsByType('mini', this.map, 'downObject');
    resultMini.forEach(function (element) {
      this.createFromTiledObject(element, this.mini);
    }, this);

  }

  seeLifes() {
    if (this.lifeCounter == 3) {
      this.threeHearts.visible = true
    } else if (this.lifeCounter == 2) {
      this.threeHearts.visible = false
      this.twoHearts.visible = true
    } else if (this.lifeCounter == 1) {
      this.twoHearts.visible = false
    }
  }

  setScoreText() {
    this.scoreText = game.add.text(32, 35, "Score: 0", {
      font: 'bold 15pt Arial',
      fill: 'red',
      align: 'center'
    });
  }

  setParticles() {
    this.explosion = game.add.emitter(0, 0, 20)
    this.explosion.makeParticles('exp')
    this.explosion.setYSpeed(-150, 150)
    this.explosion.setXSpeed(-150, 150)
    // this.explosion.gravity.set(0,200)
  }

  die(player, enemy) {
    this.player.scale.setTo(1, 1)
    // Effect
    this.game.camera.shake(0.05, 200)
    // So de morir
    this.dead.play()
    // Descomptar vides
    // Tornar a colocar usuari en posicio inicial
    this.playerIsDead = true

    this.explosion.x = this.player.x
    this.explosion.y = this.player.y + 10
    this.explosion.start(true, 300, null, 20)
    this.lifeCounter = this.lifeCounter - 1
    this.spawnPlayer()

    if (this.lifeCounter <= 0) {
      this.dsound.stop()
      setTimeout(function () {
        this.game.state.start('GameOver');
      }, 200)
    }
  }


  collect(player, collectable) {

    this.Collectedcoins = this.Collectedcoins + 1
    this.scoreText.setText('Score: ' + this.Collectedcoins)
    this.tMushSound.play()
    //this.player.scale.setTo(this.Collectedcoins+0.2,this.Collectedcoins+0.2)
    collectable.destroy();
  }

  createItems() {
    this.items = this.game.add.group();
    this.items.enableBody = true;
    var item;
    var result = this.findObjectsByType('item', this.map, 'coinsObject');
    result.forEach(function (element) {
      this.createFromTiledObject(element, this.items);
    }, this);

  }

  createEnemy() {
    this.enemys = this.game.add.group();
    this.enemys.enableBody = true;
    var enemy;
    var resultE = this.findObjectsByType('enemy', this.map, 'enemyObject');
    resultE.forEach(function (element) {
      this.createFromTiledObject(element, this.enemys);
    }, this);

  }

  createFromTiledObject(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);
    //copy all properties to the sprite
    Object.keys(element.properties).forEach(function (key) {
      sprite[key] = element.properties[key];
    });
  }

  findObjectsByType(type, map, layer) {
    var result = []
    map.objects[layer].forEach(function (element) {
      if (element.properties.type === type) {
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
      this.dsound.stop()
      this.game.state.start('Menu');
    }
  }

  spawnPlayer() {
    if (this.playerIsDead) {
      this.player.x = 80
      this.player.y = 615
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