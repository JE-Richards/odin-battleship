export class Tile {
  constructor() {
    this.hit = false;
    this.ship = null;
  }

  receiveAttack() {
    this.hit = true;

    if (this.ship) {
      this.ship.hit();
    }
  }

  placeShip(ship) {
    if (this.ship) {
      return;
    }

    this.ship = ship;
  }

  get hasShip() {
    return this.ship !== null;
  }

  get isHit() {
    return this.hit;
  }
}
