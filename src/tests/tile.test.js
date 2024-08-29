import { Tile } from '../components/tile';

describe('Tile tests', () => {
  let tile;
  let mockShip;

  beforeEach(() => {
    tile = new Tile();
    mockShip = { hit: jest.fn() };
  });

  afterEach(() => {
    tile = null;
    mockShip = null;
  });

  describe('Testing Tile instance initialisation', () => {
    test("New instance of Tile isn't hit and has no ship present", () => {
      expect(tile.hit).toBe(false);
      expect(tile.ship).toBe(null);
    });

    test('New tiles should have placeShip and receiveAttack functions, and a hasShip Boolean getter', () => {
      expect(typeof tile['receiveAttack']).toBe('function');
      expect(typeof tile['placeShip']).toBe('function');
      expect(typeof tile['isHit']).toBe('boolean');
      expect(typeof tile['hasShip']).toBe('boolean');
    });
  });

  describe('Testing placeShip and hasShip', () => {
    test('Tile should be able to receive a ship object and store reference to it in the tile', () => {
      tile.placeShip(mockShip);
      expect(tile.ship).toBe(mockShip);
    });

    test('If a tile already has a ship, placeShip() should do nothing', () => {
      tile.placeShip(mockShip);

      let mockShipTwo = {};

      tile.placeShip(mockShipTwo);

      expect(tile.ship).toBe(mockShip);
    });

    test('The hasShip method should return true if the tile instance has a ship placed in it', () => {
      tile.placeShip(mockShip);

      expect(tile.hasShip).toBe(true);
    });
  });

  describe('Testing receiveAttack and isHit', () => {
    test('Tile without a ship should correctly register a hit', () => {
      tile.receiveAttack();

      expect(tile.hit).toBe(true);
    });

    test('isHit should correctly return tile.hit', () => {
      expect(tile.isHit).toBe(false);

      tile.receiveAttack();
      expect(tile.isHit).toBe(true);
    });

    test('Tile with a ship should also call ship.hit() when receiving an attack', () => {
      tile.placeShip(mockShip);
      tile.receiveAttack();

      expect(tile.hit).toBe(true);
      expect(tile.ship.hit).toHaveBeenCalled();
    });
  });
});
