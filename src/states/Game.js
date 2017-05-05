/* globals __DEV__ */
import Phaser from 'phaser'
import Mushroom from '../sprites/Mushroom'

export default class extends Phaser.State {
  init () {}
  preload () {

    this.game.load.spritesheet('player','assets/player.png',20,22)
    this.game.load.image('ground','assets/ground.png')
    this.game.load.image('wall','assets/wall.png')
    this.game.load.image('jump','assets/jump.mp3')
    //this.game.load.image('jump',['assets/jump.wav','assets/jump.mp3'])


  }

  create () {

      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.player = this.game.add.sprite(250,50,'player')
      this.ground = this.game.add.sprite(760/2-160,400/2,'ground')
      this.wall1 = this.game.add.sprite(760/2-160,400/2-80,'wall')
      this.wall2 = this.game.add.sprite(760/2+140,400/2-80,'wall')
      this.jumpSound = this.game.add.audio('jump')



      this.game.physics.arcade.enable(this.player)
      this.game.physics.arcade.enable(this.ground)

      this.player.body.gravity.y = 600
      this.player.body.setSize(20,20,0,0)

      this.ground.body.immovable = true

      this.player.animations.add('idle',[3,4,5,4],5,true)
      this.player.animations.play('idle')


      this.cursor = this.game.input.keyboard.createCursorKeys()

      this.hasJumped = false

  }

  update(){

      this.game.physics.arcade.collide(this.player,this.ground)
//      this.ground.body.x++
      this.inputs()

      if(this.player.body.touching.down){

          this.hasJumped = false

      }

  }

  inputs (){

      if (this.cursor.left.isDown){
          this.player.body.velocity.x = -200
          this.player.frame=2
      } else  {
          this.player.body.velocity.x = 0
      }

      if (this.cursor.up.isDown){
          this.jumpplayer()
      }

  }

  jumpplayer(){


      this.player.body.velocity.y = -100

      if(!this.hasJumped) {
          this.jumpSound.play()
          this.hasJumped = true
      }




  }

  render () {
    if (__DEV__) {
      // this.game.debug.spriteInfo(this.mushroom, 32, 32)
    }
  }
}
