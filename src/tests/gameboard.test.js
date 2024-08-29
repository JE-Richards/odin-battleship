import { Gameboard } from '../components/gameboard';
import { Tile } from '../components/tile';
import { Ship } from '../components/ship';

// Mock Tile
jest.mock('../components/tile', () => {
  return {
    Tile: jest.fn().mockImplementation(() => ({
      get hasShip() {
        return this._hasShip;
      },
      get isHit() {
        return this._isHit;
      },
      placeShip: jest.fn(),
      receiveAttack: jest.fn(),
      _hasShip: false,
      _isHit: false,
    })),
  };
});

// Mock Ship
jest.mock('../components/ship', () => {
  return {
    Ship: jest.fn().mockImplementation((length) => ({
      get length() {
        return length;
      },
      get isSunk() {
        return this._isSunk;
      },
      _isSunk: false,
    })),
  };
});

describe('Gameboard tests', () => {
  let board;
  let ship;
  let x;
  let y;
  let isVertical;

  beforeEach(() => {
    board = new Gameboard();
    ship = new Ship(3);
    x = 0;
    y = 0;
    isVertical = false;
  });

  afterEach(() => {
    board = null;
    ship = null;
    x = null;
    y = null;
    isVertical = null;
  });

  describe('Testing board creation', () => {
    test('A Gameboard instance should create a 10x10 "board" (by default) in the form of an array of arrays', () => {
      // test the size of the columns (parent array);
      expect(board.board.length).toBe(10);

      // test the size of the rows (child arrays);
      board.board.forEach((arr) => {
        expect(arr.length).toBe(10);
      });
    });

    test('Each element of the board inner-arrays should be an instance of a Tile class object', () => {
      board.board.forEach((innerArr) => {
        innerArr.forEach(() => {
          expect(Tile).toHaveBeenCalled(); // (element instanceof Tile) returned false as the mock wasn't being seen as an instance of Tile
        });
      });
    });
  });

  describe('Testing canPlaceShip', () => {
    describe('Testing vertically', () => {
      test('canPlaceShip should return false if ship goes out of bounds (vertical)', () => {
        y = 9;
        const length = 2;
        isVertical = true;

        const result = board.canPlaceShip(x, y, length, isVertical);

        expect(result).toBe(false);
      });

      test('canPlaceShip should return true if ship can be placed within bounds (vertical)', () => {
        const length = 2;
        isVertical = true;

        const result = board.canPlaceShip(x, y, length, isVertical);

        expect(result).toBe(true);
      });

      test('canPlaceShip should return false if the placement tile already contains a ship (vertical)', () => {
        const length = 2;

        board.board[0][0]._hasShip = true;

        const result = board.canPlaceShip(x, y, length, isVertical);

        expect(result).toBe(false);
      });

      test('canPlaceShip should return false if any part of the new ships length clashes with an already placed ship (vertical)', () => {
        const length = 2;
        isVertical = true;

        board.board[0][1]._hasShip = true;

        const result = board.canPlaceShip(x, y, length, isVertical);

        expect(result).toBe(false);
      });
    });

    describe('Testing horizontally', () => {
      test('canPlaceShip should return false if ship goes out of bounds (horizontal)', () => {
        x = 9;
        const length = 2;

        const result = board.canPlaceShip(x, y, length, isVertical);

        expect(result).toBe(false);
      });

      test('canPlaceShip should return true if ship can be placed within bounds (horizontal)', () => {
        const length = 2;

        const result = board.canPlaceShip(x, y, length, isVertical);

        expect(result).toBe(true);
      });

      test('canPlaceShip should return false if the placement tile already contains a ship (horizontal)', () => {
        const length = 2;

        board.board[0][0]._hasShip = true;

        const result = board.canPlaceShip(x, y, length, isVertical);

        expect(result).toBe(false);
      });

      test('canPlaceShip should return false if any part of the new ships length clashes with an already placed ship (horizontal)', () => {
        const length = 2;

        board.board[1][0]._hasShip = true;

        const result = board.canPlaceShip(x, y, length, isVertical);

        expect(result).toBe(false);
      });
    });
  });

  describe('Testing placeShip', () => {
    test('placeShip should get the length of the ship (to determine placement) from the Ship instance passed to it', () => {
      const lengthGetterSpy = jest.spyOn(ship, 'length', 'get');

      board.placeShip(x, y, ship, isVertical);

      expect(lengthGetterSpy).toHaveBeenCalledTimes(1);
    });

    describe('Testing horizontally', () => {
      test('placeShip should place the ship on the correct tiles (horizontal)', () => {
        board.placeShip(x, y, ship, isVertical);

        // Check that Tile.placeShip was called with correct input
        expect(board.board[0][0].placeShip).toHaveBeenCalledWith(ship);
        expect(board.board[1][0].placeShip).toHaveBeenCalledWith(ship);
        expect(board.board[2][0].placeShip).toHaveBeenCalledWith(ship);

        // Check that Tile.placeShip was only called once per tile
        expect(board.board[0][0].placeShip).toHaveBeenCalledTimes(1);
        expect(board.board[1][0].placeShip).toHaveBeenCalledTimes(1);
        expect(board.board[2][0].placeShip).toHaveBeenCalledTimes(1);
      });

      test('If a ship is successfully placed, it should be added to Gameboard.ships (horizontal)', () => {
        board.placeShip(x, y, ship, isVertical);

        expect(board.ships.length).toBe(1);
        expect(board.ships[0]).toBe(ship);
      });

      test('placeShip should NOT place the ship if one of the tiles already contains a ship (horizontal)', () => {
        board.board[1][0]._hasShip = true;

        board.placeShip(x, y, ship, isVertical);

        expect(board.board[0][0].placeShip).not.toHaveBeenCalled();
        expect(board.board[1][0].placeShip).not.toHaveBeenCalled();
        expect(board.board[2][0].placeShip).not.toHaveBeenCalled();
      });

      test('placeShip should NOT place the ship if the ship would go out of bounds (horizontal)', () => {
        x = 9;

        board.placeShip(x, y, ship, isVertical);

        expect(board.board[9][0].placeShip).not.toHaveBeenCalled();
      });
    });

    describe('Testing vertically', () => {
      test('placeShip should place the ship on the correct tiles (vertical)', () => {
        isVertical = true;

        board.placeShip(x, y, ship, isVertical);

        // Check that Tile.placeShip was called with correct input
        expect(board.board[0][0].placeShip).toHaveBeenCalledWith(ship);
        expect(board.board[0][1].placeShip).toHaveBeenCalledWith(ship);
        expect(board.board[0][2].placeShip).toHaveBeenCalledWith(ship);

        // Check that Tile.placeShip was only called once per tile
        expect(board.board[0][0].placeShip).toHaveBeenCalledTimes(1);
        expect(board.board[0][1].placeShip).toHaveBeenCalledTimes(1);
        expect(board.board[0][2].placeShip).toHaveBeenCalledTimes(1);
      });

      test('If a ship is successfully placed, it should be added to Gameboard.ships (vertical)', () => {
        isVertical = true;

        board.placeShip(x, y, ship, isVertical);

        expect(board.ships.length).toBe(1);
        expect(board.ships[0]).toBe(ship);
      });

      test('placeShip should NOT place the ship if one of the tiles already contains a ship (vertical)', () => {
        isVertical = true;

        board.board[0][1]._hasShip = true;

        board.placeShip(x, y, ship, isVertical);

        expect(board.board[0][0].placeShip).not.toHaveBeenCalled();
        expect(board.board[0][1].placeShip).not.toHaveBeenCalled();
        expect(board.board[0][2].placeShip).not.toHaveBeenCalled();
      });

      test('placeShip should NOT place the ship if the ship would go out of bounds (vertical)', () => {
        isVertical = true;
        y = 9;

        board.placeShip(x, y, ship, isVertical);

        expect(board.board[0][9].placeShip).not.toHaveBeenCalled();
      });
    });
  });

  describe('Testing receiveAttack', () => {
    test('If a Tile has already been hit, receiveAttack should do nothing to Tile', () => {
      board.board[x][y]._isHit = true;

      board.receiveAttack(x, y);

      expect(board.board[x][y].receiveAttack).not.toHaveBeenCalled();
    });

    test('If a Tile (without a ship) has not been hit yet, Tile.receiveAttack should be called', () => {
      board.receiveAttack(x, y);

      expect(board.board[x][y].receiveAttack).toHaveBeenCalledTimes(1);
    });

    test('If a Tile (with a ship) has not been hit yet, Tile.receiveAttack should be called', () => {
      board.board[x][y]._hasShip = true;
      board.receiveAttack(x, y);

      expect(board.board[x][y].receiveAttack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Testing allShipsSunk', () => {
    test('If there are no ships on the board, returns false', () => {
      expect(board.allShipsSunk).toBe(false);
    });

    test('If there are ships on the board that are not sunk, return false', () => {
      board.placeShip(x, y, ship, isVertical);

      expect(board.allShipsSunk).toBe(false);
    });

    test('If all ships on the board are sunk, return true', () => {
      ship._isSunk = true;
      board.placeShip(x, y, ship, isVertical);

      expect(board.allShipsSunk).toBe(true);
    });
  });
});
