import Phaser from 'phaser'

export default class extends Phaser.State {

  preload() {

    this.game.world.width = 864
    this.game.world.height = 704

    this.game.load.tilemap('gameover', '/assets/tilemaps/gameover.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', '/assets/tilemaps/terrain_atlas.png');

    console.log(game.world.width + ' preload go width')
    console.log(game.world.height + ' preload go height')
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
      this.game.world.centerY - 200,
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