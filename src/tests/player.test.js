import { Player } from '../components/player';
import { Gameboard } from '../components/gameboard';

jest.mock('../components/gameboard', () => {
  return {
    Gameboard: jest.fn().mockImplementation(),
  };
});

describe('Player tests', () => {
  let player;

  beforeEach(() => {
    player = new Player(Gameboard, false);
  });

  describe('Testing Player initialisation', () => {
    test('Player instance should have gameboard and isHuman properties, and checkHuman, getGameboard methods', () => {
      expect(player).toHaveProperty('gameboard');
      expect(player).toHaveProperty('isHuman');

      const checkHumanDesc = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(player),
        'checkHuman'
      );
      expect(checkHumanDesc).toBeDefined();
      expect(typeof checkHumanDesc.get).toBe('function');

      const getGameboardDesc = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(player),
        'getGameboard'
      );
      expect(getGameboardDesc).toBeDefined();
      expect(typeof getGameboardDesc.get).toBe('function');
    });

    test('isHuman should take a default value of false', () => {
      expect(player.isHuman).toBe(false);
    });

    test('gameboard should be an instance of the gameboard class passed to Player', () => {
      expect(player.gameboard instanceof Gameboard).toBe(true);
    });
  });

  describe('Testing checkHuman getter', () => {
    test('checkHuman should return the value of player.isHuman', () => {
      expect(player.checkHuman === player.isHuman).toBe(true);

      player.isHuman = true;
      expect(player.checkHuman === player.isHuman).toBe(true);
    });
  });

  describe('Testing getGameboard getter', () => {
    test('getGameboard should return player.gameboard', () => {
      expect(player.getGameboard === player.gameboard).toBe(true);
    });
  });
});
