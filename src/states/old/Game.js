/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'

export default class extends Phaser.State {
    init() {
    }

    preload() {


        this.game.load.spritesheet('player', 'assets/player.png', 28, 22)
        this.game.load.image('ground', 'assets/ground.png')
        this.game.load.image('wall', 'assets/wall.png')
        this.game.load.audio('jump', ['assets/jump.wav', 'assets/jump.mp3'])
        this.game.load.image('enemy', 'assets/enemy.png')
        this.game.load.image('coin', 'assets/coin.png')
        this.game.load.spritesheet('boom', 'assets/boom.png',64,64)


    }

    create() {

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.player = this.game.add.sprite(250, 101, 'player')
        this.jumpSound = this.game.add.audio('jump')
        this.enemy = this.game.add.sprite(485, 180, 'enemy')
        this.coin = this.game.add.sprite(100, 400 - 40, 'coin')

        this.loadLevel

        this.game.physics.arcade.enable(this.player)
        this.game.physics.arcade.enable(this.enemy)

        this.player.body.gravity.y = 600
        this.enemy.body.gravity.y = 600
        this.player.body.setSize(20, 20, 0, 0)
        this.enemy.body.setSize(20, 20, 0, 0)

        this.player.animations.add('idle', [3, 4, 5, 4], 5, true);
        this.player.animations.play('idle')

      this.cursor = this.game.input.keyboard.createCursorKeys()
      this.gKey = this.game.input.keyboard.addKey(Phaser.Keyboard.G)
      this.wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
      this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A)
      this.sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S)
      this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D)
      this.hKey = this.game.input.keyboard.addKey(Phaser.Keyboard.H)
      this.bKey = this.game.input.keyboard.addKey(Phaser.Keyboard.B)


        this.hasJumped = false
        this.dvMode = false




    }

    loadLevel () {
        this.level = this.game.add.group()
        this.level.enableBody = true


        this.ground = this.game.add.sprite(0, 400 - 20, 'ground',0,this.level)
        this.top = this.game.add.sprite(0, 0 - 20, 'ground',0,this.level)
        this.wall1 = this.game.add.sprite(0 - 20, 0, 'wall',0,this.level)
        this.wall2 = this.game.add.sprite(760, 0, 'wall',0,this.level)

        this.level.setAll('body.immovable' , true)

        this.game.physics.arcade.enable(this.level)


        this.ground.width = 760
        this.top.width = 760
        this.wall1.height = 400
        this.wall2.height = 400

        // this.ground.body.immovable = true
        // this.wall1.body.immovable = true
        // this.wall2.body.immovable = true
        // this.top.body.immovable = true

    }

    update() {

        this.game.physics.arcade.collide(this.player, this.level)
        this.game.physics.arcade.collide(this.player, this.wall1)
        this.game.physics.arcade.collide(this.player, this.wall2)
        this.game.physics.arcade.collide(this.enemy, this.ground)
        this.game.physics.arcade.collide(this.player, this.top)


        this.inputs()


    }

    takeCoin(a,b) {
        b.body.enable = false;
        game.add.tween(b.scale).to({x:0}, 150).start();
        game.add.tween(b).to({y:50}, 150).start();
    }

    inputs() {

        if (this.cursor.left.isDown) {
            this.player.body.velocity.x = -200
            this.player.frame = 2
        } else {
            this.player.body.velocity.x = 0
        }

        if (this.cursor.right.isDown) {
            this.player.frame = 1
            this.player.body.velocity.x = +200
        }

        if (this.cursor.up.isDown) {
            this.jumpplayer()
        }

        if (this.player.body.touching.down) {

            this.hasJumped = false

        }


        if (this.player.y > 100) {
            this.player.hasJumped = true
        }


        if (this.gKey.isDown) {

            this.dvMode = true

        }

        if (this.hKey.isDown) {

            this.dvMode = false

        }

        if (this.bKey.isDown) {
            this.boom()
        }

        if (this.dvMode) {

            this.enableFly()

        } else {
            this.player.body.gravity.y = 600
        }


    }

    boom() {

      this.bomba = this.game.add.sprite(this.player.body.x, this.player.body.y, 'boom')
      this.bomba.anchor.setTo(0.2,0.4)
      this.bomba.animations.add('explotar', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,0], 30, true);
      //this.bomba.animations.add('explotar', [10], 30, true);
      this.bomba.animations.play('explotar')



    }

    enableFly() {


        this.player.body.gravity.y = 0

        this.hasJumped = false
        if (this.wKey.isDown) {
            this.player.body.velocity.y = -1000
        } else {
            this.player.body.velocity.y = 0
        }

        if (this.aKey.isDown) {
            this.player.body.velocity.x = -1000
        } else {

        }

        if (this.dKey.isDown) {
            this.player.body.velocity.x = +1000
        } else {

        }

        if (this.sKey.isDown) {
            this.player.body.velocity.y = +1000
        } else {

        }


    }

    jumpplayer() {

        if (!this.hasJumped) {
            this.jumpSound.play()
            this.player.body.velocity.y = -280
            this.hasJumped = true
        }
    }

    render() {
        if (__DEV__) {
            // this.game.debug.spriteInfo(this.mushroom, 32, 32)
        }
    }
}
