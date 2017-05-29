import Phaser from 'phaser'

export default class extends Phaser.State {

  preload() {
    this.game.load.image('btnMusicOff', 'assets/images/moff.png');
    this.game.load.audio('dungeon', '/assets/sounds/dsound.mp3', true)
  }

  create() {

    game.stage.backgroundColor = "black";
    game.stage.disableVisibilityChange = true;
    window.enabled = true
    this.dsound = this.game.add.audio('dungeon')
    this.dsound.loop = true
    this.dsound.volume = 0.2
    this.dsound.play()

    this.setTitle();
    this.setBtn();
    this.setBtnMusicOff();
    this.setBtnMusicOn();
    this.btnMusicOn.visible = false

  }

  setTitle() {

    this.titleText = game.add.text(game.camera.width / 2, 100, "Game Cristian Fonolla!", {
      font: 'bold 58pt Arial',
      fill: 'red',
      align: 'center'
    });

    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
  }

  setBtnMusicOff() {
    this.btnMusicOff = game.add.text(700, 550, "Apagar Música", {
      font: '15pt Arial',
      fill: 'green',
      align: 'center'
    });
    this.btnMusicOff.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.btnMusicOff.anchor.set(0.5);
    this.btnMusicOff.inputEnabled = true;
    var that = this
    this.btnMusicOff.events.onInputUp.add(function () {
      window.enableSound = false
      that.btnMusicOff.visible = false
      that.btnMusicOn.visible = true
      that.dsound.mute = true
    });
  }

  setBtnMusicOn() {
    this.btnMusicOn = game.add.text(700, 550, "Engegar Música", {
      font: '15pt Arial',
      fill: 'green',
      align: 'center'
    });
    this.btnMusicOn.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.btnMusicOn.anchor.set(0.5);
    this.btnMusicOn.inputEnabled = true;
    var that = this
    this.btnMusicOn.events.onInputUp.add(function () {
      window.enableSound = true
      that.btnMusicOn.visible = false
      that.btnMusicOff.visible = true
      that.dsound.mute = false
    });
  }

  setBtn() {

    this.startText = game.add.text(game.camera.width / 2, 300, "START", {
      font: '45pt Arial',
      fill: 'green',
      align: 'center'
    });
    this.startText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.startText.anchor.set(0.5);
    this.startText.inputEnabled = true;
    var that = this
    this.startText.events.onInputUp.add(function () {
      that.dsound.stop()
      game.state.start('Nivell1');
    });

  }


}



