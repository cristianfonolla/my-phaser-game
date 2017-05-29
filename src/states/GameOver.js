import Phaser from 'phaser'

export default class extends Phaser.State {

  preload() {
    this.game.load.tilemap('gameover', '/assets/tilemaps/gameover.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', '/assets/tilemaps/terrain_atlas.png');
  }

  create() {
    this.map = this.game.add.tilemap('gameover');
    this.map.addTilesetImage('tiles', 'tiles');
    this.colLayer = this.map.createLayer('background');
    this.colLayer = this.map.createLayer('text');

    this.setGameOverText()
    this.setRestartBtn()

  }

  setGameOverText() {
    this.titleText = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY - 250,
      "Game Over!",
      {
      font: 'bold 25pt Arial',
      fill: 'black',
      align: 'center'
      }
    );
    this.titleText.anchor.set(0.5)
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
  }

  setRestartBtn() {
    console.log(game.world.centerX)
    this.btnRestart = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY + 100,
      "RESTART",
      {
        font: 'bold 25pt Arial',
        fill: 'black',
        align: 'center'
      }
    );
    this.btnRestart.anchor.set(0.5)
    this.btnRestart.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.btnRestart.inputEnabled = true;
    this.btnRestart.events.onInputUp.add(function () {
      game.state.start('Menu');
    });
  }

}