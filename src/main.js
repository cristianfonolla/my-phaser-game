import 'pixi'
import 'p2'
import Phaser from 'phaser'


import MenuState from './states/Menu'
import N1State from './states/Nivell1'
import N2State from './states/Nivell2'
import GameOver from './states/GameOver'

import config from './config'

class Game extends Phaser.Game {
  constructor () {
    const docElement = document.documentElement
    const width = docElement.clientWidth > config.gameWidth ? config.gameWidth : docElement.clientWidth
    const height = docElement.clientHeight > config.gameHeight ? config.gameHeight : docElement.clientHeight
    super(width, height, Phaser.CANVAS, 'content', null)

    // this.state.add('Boot', BootState, false)
    // this.state.add('Splash', SplashState, false)
    // this.state.add('Game', GameState, false)
    this.state.add('Menu', MenuState, false)
    this.state.add('Nivell1', N1State, false)
    this.state.add('Nivell2', N2State, false)
    this.state.add('GameOver', GameOver, false)

    this.state.start('Menu')

  }
}

window.game = new Game()
