import { Player } from './player';
import { Ship } from './ship';

export class Game {
  constructor() {
    this.initialiseGame();
  }

  initialiseGame(playerClass = Player, shipClass = Ship) {
    this.playerOne = new playerClass(undefined, true);
    this.playerTwo = new playerClass(undefined, false);
    this.gameOver = false;
    this.whoseTurn = this.playerOne;

    // auto place ships for computer player
    this.autoPlaceShips(this.playerTwo, shipClass);
  }

  autoPlaceShips(player, shipClass) {
    const shipSizes = [5, 4, 3, 3, 2];
    const coordTries = [];

    function randomShipCoord() {
      return Math.floor(Math.random() * 10);
    }

    function canPlaceShip(player, inputs) {
      return player.getGameboard.canPlaceShip(
        inputs[0],
        inputs[1],
        inputs[2].length,
        inputs[3]
      );
    }

    function placeShip(player, ship) {
      let coords = [
        randomShipCoord(), // x coord
        randomShipCoord(), // y coord
        ship, // ship object
        Math.random() < 0.5, // random true/false
      ];

      if (coordTries.includes(coords)) {
        placeShip(player, ship);
      }

      coordTries.push(coords);

      if (!canPlaceShip(player, coords)) {
        placeShip(player, ship);
      }

      player.getGameboard.placeShip(coords[0], coords[1], coords[2], coords[3]);
    }

    for (let i = 0; i < shipSizes.length; i += 1) {
      let ship = new shipClass(shipSizes[i]);
      placeShip(player, ship);
    }
  }

  reset() {
    this.initialiseGame();
  }

  isGameOver() {
    let playerOneAllSunk = this.playerOne.getGameboard.allShipsSunk;
    let playerTwoAllSunk = this.playerTwo.getGameboard.allShipsSunk;

    if (playerOneAllSunk || playerTwoAllSunk) {
      this.gameOver = true;
    }
  }

  nextTurn() {
    this.whoseTurn === this.playerOne
      ? (this.whoseTurn = this.playerTwo)
      : (this.whoseTurn = this.playerOne);
  }

  get getGameOver() {
    return this.gameOver;
  }

  get getWhoseTurn() {
    return this.whoseTurn;
  }
}
