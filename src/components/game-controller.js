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

    // Below is code to randomly place ships for both players
    let coordTries = [];

    function randomShipCoord() {
      return Math.floor(Math.random() * 10);
    }

    // helper function to check if ship is placeable
    function canPlaceShip(player, inputs) {
      return player.getGameboard.canPlaceShip(
        inputs[0],
        inputs[1],
        inputs[2].length,
        inputs[3]
      );
    }

    // helper function to place a ship
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

    const shipSizes = [5, 4, 3, 3, 2];
    const players = [this.playerOne, this.playerTwo];

    for (let p = 0; p < players.length; p += 1) {
      for (let i = 0; i < shipSizes.length; i += 1) {
        let ship = new shipClass(shipSizes[i]);
        placeShip(players[p], ship);

        if (i === shipSizes.length - 1) {
          coordTries = [];
        }
      }
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
