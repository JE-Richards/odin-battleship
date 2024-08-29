export class Ship {
  constructor(len = 1) {
    this.len = len;
    this.hits = 0;
    this.sunk = false;
  }

  hit() {
    if (this.sunk === true) {
      return;
    }

    if (this.hits < this.length) {
      this.hits += 1;

      if (this.isSunk) {
        this.sunk = true;
      }
    }
  }

  get isSunk() {
    if (this.hits === this.length) {
      return true;
    }

    return false;
  }

  get length() {
    return this.len;
  }
}
