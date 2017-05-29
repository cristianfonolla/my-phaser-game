import Phaser from 'phaser'
import Player from '../sprites/Player'
//import Nivell1 from './'

export default class extends Phaser.State {

  preload() {

    this.game.load.tilemap('tilemap2', '/assets/tilemaps/myterrain2.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('terrain_atlas', '/assets/tilemaps/terrain_atlas.png');
    this.game.load.image('bullet', '/assets/images/cr7.png');
    this.game.load.image('target', '/assets/images/rm.png');
    this.game.load.image('dollar', '/assets/images/dollar.png');
    this.game.load.spritesheet('player', '/assets/images/fcb.png', 32, 32);
    this.game.load.audio('gol1', '/assets/sounds/gol1.wav');
    this.game.load.audio('gol2', '/assets/sounds/gol2.wav');

  }

  create() {

    this.gol1 = this.game.add.audio('gol1')
    this.gol2 = this.game.add.audio('gol2')

    this.map = this.game.add.tilemap('tilemap2');
    this.map.addTilesetImage('terrain_atlas', 'terrain_atlas');

    this.colLayer = this.map.createLayer('background');
    this.colLayer = this.map.createLayer('spawn');
    this.colLayer = this.map.createLayer('collisionable');
    this.map.setCollisionBetween(1, 5000, true, 'collisionable');

    this.goalsDone = 0

    this.initBullet()

    this.setGoalCounter()

    this.createTargets()

  }

  setGoalCounter() {
    this.goalText = game.add.text(32, 35, "Goals: 0", {
      font: 'bold 15pt Arial',
      fill: 'black',
      align: 'center'
    });
  }

  createTargets() {

    this.target = this.game.add.group();
    this.target.enableBody = true;
    var item;
    var result = this.findObjectsByType('aim', this.map, 'layerObject');
    result.forEach(function(element){
      this.createFromTiledObject(element, this.target);
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

  createFromTiledObject(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);
    //copy all properties to the sprite
    Object.keys(element.properties).forEach(function(key){
      sprite[key] = element.properties[key];
    });
  }

  shootBullet(){
    if (this.lastBulletShotAt === undefined) this.lastBulletShotAt = 0;
    if (this.game.time.now - this.lastBulletShotAt < this.SHOT_DELAY) return;
    this.lastBulletShotAt = this.game.time.now;

    // Get a dead bullet from the pool
    var bullet = this.bulletPool.getFirstDead();
    this.bullets = bullet

    // If there aren't any bullets available then don't shoot
    if (bullet === null || bullet === undefined) return;

    // Revive the bullet
    // This makes the bullet "alive"
    bullet.revive();

    // Bullets should kill themselves when they leave the world.
    // Phaser takes care of this for me by setting this flag
    // but you can do it yourself by killing the bullet if
    // its x,y coordinates are outside of the world.
    bullet.checkWorldBounds = true;
    bullet.outOfBoundsKill = true;

    // Set the bullet position to the gun position.
    bullet.reset(this.gun.x, this.gun.y);
    bullet.rotation = this.gun.rotation;

    // Shoot it in the right direction
    bullet.body.velocity.x = Math.cos(bullet.rotation) * this.BULLET_SPEED;
    bullet.body.velocity.y = Math.sin(bullet.rotation) * this.BULLET_SPEED;
  }

  update() {

    this.game.physics.arcade.overlap(this.bullets, this.target, function (bullet,target) {
      this.goalsDone = this.goalsDone + 1
      this.goalText.setText('Goals: ' + this.goalsDone)

      if(this.goalsDone<5) {
        this.gol1.play()
      } else {
        this.enableRain()
        this.gol2.play()
        this.setRestartText()
      }
      target.destroy()
    }, null, this);


    if (this.goalsDone==5) {
      this.youWinText = game.add.text(game.world.centerX, game.world.centerY - 200, "YOU WIN! BARÇA 5 MADRID 0!!!", {
        font: 'bold 40pt Arial',
        fill: 'red',
        align: 'center'
      });
      this.youWinText.anchor.set(0.5);
      this.blockAll()
    }


    this.gun.rotation = this.game.physics.arcade.angleToPointer(this.gun);

    // Shoot a bullet
    if (this.game.input.activePointer.isDown) {
      this.shootBullet();
    }

    
  }

  setRestartText() {
    this.restartText = game.add.text(game.world.centerX, game.world.centerY, "RESTART", {
      font: 'bold 20pt Arial',
      fill: 'black',
      align: 'center'
    });
    this.restartText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.restartText.anchor.set(0.5);
    this.restartText.inputEnabled = true;
    var that = this
    this.restartText.events.onInputUp.add(function () {
      that.gol2.stop()
      game.state.start('Menu');
    });
  }

  enableRain() {
    var emitter = game.add.emitter(game.world.centerX, 0, 400);

    emitter.width = game.world.width;
    // emitter.angle = 30; // uncomment to set an angle for the rain.

    emitter.makeParticles('dollar');

    emitter.minParticleScale = 0.1;
    emitter.maxParticleScale = 0.5;

    emitter.setYSpeed(300, 500);
    emitter.setXSpeed(-5, 5);

    emitter.minRotation = 0;
    emitter.maxRotation = 0;

    emitter.start(false, 1600, 5, 0);
  }

  blockAll() {
    this.gun.destroy()
    //this.bullets.destroy()
  }

  initBullet() {
    this.SHOT_DELAY = 100; // milliseconds (10 bullets/second)
    this.BULLET_SPEED = 500; // pixels/second
    this.NUMBER_OF_BULLETS = 1;

    // Create an object representing our gun
    this.gun = this.game.add.sprite(80, 600, 'player');

    // Set the pivot point to the center of the gun
    this.gun.anchor.setTo(0.5, 0.5);

    // Create an object pool of bullets
    this.bulletPool = this.game.add.group();
    for(var i = 0; i < this.NUMBER_OF_BULLETS; i++) {
      // Create each bullet and add it to the group.
      var bullet = this.game.add.sprite(0, 0, 'bullet');
      this.bulletPool.add(bullet);

      // Set its pivot point to the center of the bullet
      bullet.anchor.setTo(0.5, 0.5);

      // Enable physics on the bullet
      this.game.physics.enable(bullet, Phaser.Physics.ARCADE);

      // Set its initial state to "dead".
      bullet.kill();
    }

    // Simulate a pointer click/tap input at the center of the stage
    // when the example begins running.
    this.game.input.activePointer.x = this.game.width/2;
    this.game.input.activePointer.y = this.game.height/2;
  }




}