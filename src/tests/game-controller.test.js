import { Game } from '../components/game-controller';
import { Gameboard } from '../components/gameboard';
import { Player } from '../components/player';
import { Ship } from '../components/ship';

jest.mock('../components/gameboard', () => {
  return {
    Gameboard: jest.fn().mockImplementation(() => {
      return {
        canPlaceShip: jest.fn().mockReturnValue(true),
        placeShip: jest.fn(),
        allShipsSunk: true,
      };
    }),
  };
});

jest.mock('../components/player', () => {
  const { Gameboard } = require('../components/gameboard');

  return {
    Player: jest.fn().mockImplementation(() => ({
      get getGameboard() {
        return this._gameboard;
      },
      _gameboard: new Gameboard(),
    })),
  };
});

jest.mock('../components/ship', () => {
  return {
    Ship: jest.fn().mockImplementation((length) => {
      length;
    }),
  };
});

describe('Testing the game controller (Game) class', () => {
  let game;

  beforeEach(() => {
    game = new Game();
  });

  afterEach(() => {
    jest.clearAllMocks(); // reset mocks to prevent cross-test interferance
    game = null;
  });

  describe('Testing Game initialisation', () => {
    test('New Game instance should have two players, not be over, and current player should be player one', () => {
      // check has playerOne and Two
      expect(game).toHaveProperty('playerOne');
      expect(game).toHaveProperty('playerTwo');

      // Can't check it's an instance of Player due to mocking, so checking the mock was called twice with correct values
      expect(Player).toHaveBeenCalledTimes(2);
      expect(Player).toHaveBeenCalledWith(undefined, true);
      expect(Player).toHaveBeenCalledWith(undefined, false);

      // check gameOver and turn are set to correct initial values
      expect(game).toHaveProperty('gameOver', false);
      expect(game).toHaveProperty('whoseTurn', game.playerOne);
    });

    test('Each player should have 5 ships placed on their board when a game is initialised', () => {
      expect(game.playerOne.getGameboard.placeShip).toHaveBeenCalledTimes(5);
      expect(game.playerTwo.getGameboard.placeShip).toHaveBeenCalledTimes(5);
    });
  });

  describe('Testing game reset function', () => {
    test('Game state should reset correctly when reset is called', () => {
      game.reset();

      // Verify that the Player and Gameboard constructor was called 4 times in total (2 during init and 2 during reset)
      expect(Player).toHaveBeenCalledTimes(4);
      expect(Gameboard).toHaveBeenCalledTimes(4);

      // Each player should have 5 ships placed again after reset
      // 5 calls instead of 10 because it's a new instance of Gameboard
      expect(game.playerOne.getGameboard.placeShip).toHaveBeenCalledTimes(5);
      expect(game.playerTwo.getGameboard.placeShip).toHaveBeenCalledTimes(5);
    });
  });

  describe('Testing turn management', () => {
    test('getWhoseTurn should return the Game.turn', () => {
      expect(game.getWhoseTurn).toBe(game.whoseTurn);
    });

    test('nextTurn should change the turn between playerOne and playerTwo', () => {
      expect(game.getWhoseTurn).toBe(game.playerOne);
      game.nextTurn();
      expect(game.getWhoseTurn).toBe(game.playerTwo);
      game.nextTurn();
      expect(game.getWhoseTurn).toBe(game.playerOne);
    });
  });

  describe('Testing game over functionality', () => {
    test('getGameOver should return Game.gameOver', () => {
      expect(game.getGameOver).toBe(game.gameOver);
    });

    test('isGameOver should check if all ships are sunk, then if true change Game.gameOver', () => {
      expect(game.getGameOver).toBe(false);
      game.isGameOver();
      expect(game.getGameOver).toBe(true);
    });
  });
});
