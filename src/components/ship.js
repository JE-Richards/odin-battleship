export class Ship {
  constructor(len) {
    this.length = len;
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    if (this.sunk === true) {
      return;
    }

    if (this.hits < this.length) {
      this.hits += 1;

      if (this.isSunk()) {
        this.sunk = true;
      }
    }
  }

  isSunk() {
    if (this.hits === this.length) {
      return true;
    }

    return false;
  }
}
