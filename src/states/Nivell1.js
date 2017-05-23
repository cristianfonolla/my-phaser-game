import Phaser from 'phaser'

export default class extends Phaser.State {

  preload() {

    this.game.load.tilemap('tilemap', '/assets/tilemaps/myterrain.json', null, Phaser.Tilemap.TILED_JSON);
    this.game.load.image('tiles', '/assets/tilemaps/terrain_atlas.png');

  }

  create() {

    this.map = this.game.add.tilemap('tilemap');
    this.map.addTilesetImage('tiles', 'tiles');

    this.layer = this.map.createLayer('MyTerrain');
    this.layer.resizeWorld();
    this.layer.wrap = true;

    this.cursors = this.game.input.keyboard.createCursorKeys();

  }


}