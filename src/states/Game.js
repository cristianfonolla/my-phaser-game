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


    }

    create() {

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.player = this.game.add.sprite(250, 101, 'player')
        this.ground = this.game.add.sprite(0, 400 - 20, 'ground')
        this.ground.width = 760
        this.top = this.game.add.sprite(0, 0 - 20, 'ground')
        this.top.width = 760
        this.wall1 = this.game.add.sprite(0 - 20, 0, 'wall')
        this.wall1.height = 400
        this.wall2 = this.game.add.sprite(760, 0, 'wall')
        this.wall2.height = 400
        this.jumpSound = this.game.add.audio('jump')
        this.enemy = this.game.add.sprite(485, 180, 'enemy')


        this.game.physics.arcade.enable(this.player)
        this.game.physics.arcade.enable(this.ground)
        this.game.physics.arcade.enable(this.wall1)
        this.game.physics.arcade.enable(this.wall2)
        this.game.physics.arcade.enable(this.enemy)
        this.game.physics.arcade.enable(this.top)

        this.player.body.gravity.y = 600
        this.enemy.body.gravity.y = 600
        this.player.body.setSize(20, 20, 0, 0)
        this.enemy.body.setSize(20, 20, 0, 0)

        this.ground.body.immovable = true
        this.wall1.body.immovable = true
        this.wall2.body.immovable = true
        this.top.body.immovable = true

        this.player.animations.add('idle', [3, 4, 5, 4], 5, true);
        this.player.animations.play('idle')


        this.cursor = this.game.input.keyboard.createCursorKeys()
        this.gKey = this.game.input.keyboard.addKey(Phaser.Keyboard.G)
        this.wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
        this.aKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A)
        this.sKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S)
        this.dKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D)
        this.hKey = this.game.input.keyboard.addKey(Phaser.Keyboard.H)

        this.hasJumped = false
        this.dvMode = false


    }

    update() {

        this.game.physics.arcade.collide(this.player, this.ground)
        this.game.physics.arcade.collide(this.player, this.wall1)
        this.game.physics.arcade.collide(this.player, this.wall2)
        this.game.physics.arcade.collide(this.enemy, this.ground)
        this.game.physics.arcade.collide(this.player, this.top)


        this.inputs()


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

        if (this.dvMode) {

            this.enableFly()

        } else {
            this.player.body.gravity.y = 600
        }


    }

    enableFly() {


        this.player.body.gravity.y = 0

        this.hasJumped = false
        if (this.wKey.isDown) {
            this.player.body.velocity.y = -200
        } else {
            this.player.body.velocity.y = 0
        }

        if (this.aKey.isDown) {
            this.player.body.velocity.x = -200
        } else {

        }

        if (this.dKey.isDown) {
            this.player.body.velocity.x = +200
        } else {

        }

        if (this.sKey.isDown) {
            this.player.body.velocity.y = +200
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
