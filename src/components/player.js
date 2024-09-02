import { Gameboard } from './gameboard';

export class Player {
  constructor(gameboardClass = Gameboard, isHuman = false) {
    this.gameboard = new gameboardClass();
    this.isHuman = isHuman;
  }

  get checkHuman() {
    return this.isHuman;
  }

  get getGameboard() {
    return this.gameboard;
  }

  resetGameboard() {
    this.gameboard.resetBoard();
  }
}
