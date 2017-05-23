import Phaser from 'phaser'

export default class extends Phaser.State {

  create() {

    game.stage.backgroundColor = "black";
    game.stage.disableVisibilityChange = true;

    this.setTitle();
    this.setBtn();
  }

  setTitle() {

    this.titleText = game.add.text(game.camera.width / 2, 100, "Platform Game Cristian Fonolla!", {
      font: 'bold 60pt Arial',
      fill: 'red',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
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
    this.startText.events.onInputUp.add(function () {
      game.state.start('Nivell1');
    });

  }


}



