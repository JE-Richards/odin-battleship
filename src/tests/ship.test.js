import { Ship } from '../components/ship';

let testShip;

beforeEach(() => {
  testShip = new Ship(3);
});
afterEach(() => {
  testShip = null;
});

test('New instance of ship has correct length, zero hits, and is not sunk', () => {
  expect(testShip.length).toBe(3);
  expect(testShip.hits).toBe(0);
  expect(testShip.sunk).toBe(false);
});

test('Instance of Ship should have "hit" and "isSunk" methods', () => {
  const expectedFuncs = ['hit', 'isSunk'];

  expectedFuncs.forEach((func) => {
    expect(typeof testShip[func]).toBe('function');
  });
});

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
