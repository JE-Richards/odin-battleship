import { Tile } from './tile';

export class Gameboard {
  constructor(size = 10, TileClass = Tile) {
    this.size = size;
    this.TileClass = TileClass;
    this.board = this.#boardConstructor(size);
    this.ships = [];
  }

  #boardConstructor(size) {
    return Array.from({ length: size }, () =>
      Array.from({ length: size }, () => new this.TileClass())
    );
  }

  canPlaceShip(x, y, length, isVertical = false) {
    if (isVertical) {
      // check ship placement will be within bounds of the board (vertical)
      if (y + length >= this.size) {
        return false;
      }

      // check ship placement won't clash with an already placed ship (vertical)
      for (let i = 0; i < length; i += 1) {
        if (this.board[x][y + i].hasShip) {
          return false;
        }
      }
    } else {
      // check ship placement will be within bounds of the board (horizontal)
      if (x + length >= this.size) {
        return false;
      }

      // check ship placement won't clash with an already placed ship (horizontal)
      for (let i = 0; i < length; i += 1) {
        if (this.board[x + i][y].hasShip) {
          return false;
        }
      }
    }
    return true;
  }

  placeShip(x, y, ship, isVertical = false) {
    let len = ship.length;

    if (isVertical) {
      if (this.canPlaceShip(x, y, len, isVertical)) {
        this.ships.push(ship);
        for (let i = 0; i < len; i += 1) {
          this.board[x][y + i].placeShip(ship);
        }
      }
    } else {
      if (this.canPlaceShip(x, y, len, isVertical)) {
        this.ships.push(ship);
        for (let i = 0; i < len; i += 1) {
          this.board[x + i][y].placeShip(ship);
        }
      }
    }
  }

  receiveAttack(x, y) {
    if (this.board[x][y].isHit) {
      return;
    }

    this.board[x][y].receiveAttack();
  }

  get allShipsSunk() {
    if (this.ships.length === 0) {
      return false;
    } else {
      let sunkCount = 0;

      for (let i = 0; i < this.ships.length; i += 1) {
        if (this.ships[i].isSunk) {
          sunkCount += 1;
        }
      }

      if (sunkCount === this.ships.length) {
        return true;
      }

      return false;
    }
  }

  resetBoard() {
    this.board = this.#boardConstructor(this.size);
    this.ships = [];
  }
}
