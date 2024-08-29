import { Ship } from '../components/ship';

let testShip;

describe('Testing Ship class', () => {
  beforeEach(() => {
    testShip = new Ship(3);
  });
  afterEach(() => {
    testShip = null;
  });

  describe('Testing Ship initialisation', () => {
    test('New instance of ship has correct length, zero hits, and is not sunk', () => {
      expect(testShip.length).toBe(3);
      expect(testShip.hits).toBe(0);
      expect(testShip.sunk).toBe(false);
    });

    test('Instance of Ship should have "hit" function, "isSunk" boolean getter, and "length" getter', () => {
      expect(typeof testShip['hit']).toBe('function');
      expect(typeof testShip['isSunk']).toBe('boolean');
      expect(typeof testShip['length']).toBe('number');
    });
  });

  // Note that 'isSunk' get's called within 'hit', so the 'hit' tests make tests for 'isSunk' redundant
  describe('Testing getter methods', () => {
    test('length should return the correct length', () => {
      expect(testShip.len === testShip.length).toBe(true);
    });
  });

  describe('Testing hit function', () => {
    test('Ship.hit() should increament the hits count by 1', () => {
      testShip.hit();
      expect(testShip.hits).toBe(1);

      testShip.hit();
      expect(testShip.hits).toBe(2);
    });

    test('If the number of times the ship is hit is equal to its length, the ship should sink', () => {
      testShip.hit();
      testShip.hit();
      testShip.hit();

      expect(testShip.hits).toBe(testShip.length);
      expect(testShip.sunk).toBe(true);
    });

    test('If the ship is already sunk, calling hit() does nothing', () => {
      testShip.hit();
      testShip.hit();
      testShip.hit();

      expect(testShip.sunk).toBe(true);

      testShip.hit();
      expect(testShip.hits).toBe(testShip.length);
    });
  });
});
