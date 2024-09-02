import { Game } from './game-controller';
import { Ship } from './ship';

export class DisplayController {
  constructor(game) {
    this.game = game;

    // Setup phase elements
    this.playerOneSetupBoard = document.getElementById('player-setup-board');
    this.shipPreview = document.getElementById('ship-preview');
    this.rotateButton = document.getElementById('rotate-button');
    this.startGameButton = document.getElementById('start-game-button');

    // Gameplay phase elements
    this.playerOneGameBoard = document.getElementById('player-game-board');
    this.playerTwoGameBoard = document.getElementById('opponent-game-board');

    // General elements
    this.resetButton = document.getElementById('reset-button');

    // State management
    this.isVertical = false;
    this.currentShipIndex = 0;
    this.shipSizes = [5, 4, 3, 3, 2];
    this.setupMode = true;
    this.setupCompleted = false;

    this.setupEventListeners();
    this.renderShipPreview();
    this.renderBoards();
  }

  setupEventListeners() {
    // Rotate button to toggle ship orientation
    this.rotateButton.addEventListener('click', () => {
      this.isVertical = !this.isVertical;
      this.renderShipPreview(); // Update preview after rotation
    });

    // Start game button
    this.startGameButton.addEventListener('click', () => {
      this.startGame();
    });

    // Reset game button
    this.resetButton.addEventListener('click', () => {
      this.game.reset();
      this.setupMode = true;
      this.currentShipIndex = 0;
      this.renderShipPreview();
      this.renderBoards();
      document.getElementById('setup-container').style.display = 'flex';
      document.getElementById('game-container').style.display = 'none';
    });

    // Player One's setup grid for placing ships
    this.playerOneSetupBoard.addEventListener('click', (e) => {
      if (!this.setupMode) return;
      const target = e.target;
      if (target.tagName === 'TD') {
        const x = parseInt(target.dataset.x, 10);
        const y = parseInt(target.dataset.y, 10);
        this.placePlayerOneShip(x, y);
        this.renderShipPreview(); // Update preview after placing
      }
    });

    this.playerOneSetupBoard.addEventListener('mouseout', (e) => {
      if (e.target.tagName === 'TD') {
        this.renderBoards(); // Clear highlight when mouse leaves
      }
    });

    // Player One's setup grid hover effects
    this.playerOneSetupBoard.addEventListener('mouseover', (e) => {
      if (this.setupMode && e.target.tagName === 'TD') {
        const x = parseInt(e.target.dataset.x, 10);
        const y = parseInt(e.target.dataset.y, 10);
        this.highlightTiles(x, y);
      }
    });

    // Player Two's game grid for attacking
    this.playerTwoGameBoard.addEventListener('click', (e) => {
      if (this.setupMode) return;
      const target = e.target;
      if (target.tagName === 'TD') {
        const x = parseInt(target.dataset.x, 10);
        const y = parseInt(target.dataset.y, 10);
        this.handlePlayerAttack(x, y);
      }
    });
  }

  renderShipPreview() {
    this.shipPreview.innerHTML = ''; // Clear previous preview
    const shipSize = this.shipSizes[this.currentShipIndex];
    const shipElement = document.createElement('div');

    // Apply fixed vertical orientation class
    shipElement.classList.add('ship-preview');

    // Create the correct number of tiles for the preview
    for (let i = 0; i < shipSize; i++) {
      const cell = document.createElement('div');
      cell.classList.add('ship-preview-tile');
      shipElement.appendChild(cell);
    }

    this.shipPreview.appendChild(shipElement);
  }

  highlightTiles(x, y) {
    const shipSize = this.shipSizes[this.currentShipIndex];
    const cells = this.playerOneSetupBoard.querySelectorAll('td');
    cells.forEach((cell) => cell.classList.remove('highlight'));

    for (let i = 0; i < shipSize; i++) {
      if (this.isVertical) {
        if (y + i < this.game.playerOne.getGameboard.size) {
          const cell = this.playerOneSetupBoard.querySelector(
            `td[data-x="${x}"][data-y="${y + i}"]`
          );
          if (cell) cell.classList.add('highlight');
        }
      } else {
        if (x + i < this.game.playerOne.getGameboard.size) {
          const cell = this.playerOneSetupBoard.querySelector(
            `td[data-x="${x + i}"][data-y="${y}"]`
          );
          if (cell) cell.classList.add('highlight');
        }
      }
    }
  }

  placePlayerOneShip(x, y) {
    const shipSize = this.shipSizes[this.currentShipIndex];
    if (
      this.game.playerOne.getGameboard.canPlaceShip(
        x,
        y,
        shipSize,
        this.isVertical
      )
    ) {
      const ship = new Ship(shipSize);
      this.game.playerOne.getGameboard.placeShip(x, y, ship, this.isVertical);
      this.currentShipIndex += 1;
      this.renderBoards();
    }

    // Check if all ships are placed
    if (this.currentShipIndex >= this.shipSizes.length) {
      this.setupMode = false;
      this.setupCompleted = true;
      this.startGameButton.disabled = false;
    }
  }

  startGame() {
    this.setupMode = false;
    document.getElementById('setup-container').style.display = 'none';
    document.getElementById('game-container').style.display = 'flex';
    this.renderBoards();
  }

  handlePlayerAttack(x, y) {
    this.game.playerTwo.getGameboard.receiveAttack(x, y);
    this.renderBoards();
    this.checkGameOver();

    if (!this.game.getGameOver) {
      this.game.nextTurn();
      if (this.game.getWhoseTurn === this.game.playerTwo) {
        this.computerAttack();
      }
    } else {
      alert('Game Over!');
    }
  }

  computerAttack() {
    let x, y;
    do {
      x = Math.floor(Math.random() * 10);
      y = Math.floor(Math.random() * 10);
    } while (this.game.playerOne.getGameboard.board[x][y].isHit);

    this.game.playerOne.getGameboard.receiveAttack(x, y);
    this.renderBoards();
    this.checkGameOver();

    if (!this.game.getGameOver) {
      this.game.nextTurn();
    } else {
      alert('Game Over!');
    }
  }

  checkGameOver() {
    this.game.isGameOver();
    if (this.game.getGameOver) {
      alert(
        'Game Over! ' +
          (this.game.getWhoseTurn === this.game.playerOne
            ? 'Player One'
            : 'Player Two') +
          ' wins!'
      );
    }
  }

  renderBoards() {
    this.renderBoard(
      this.playerOneSetupBoard,
      this.game.playerOne.getGameboard,
      true
    );
    this.renderBoard(
      this.playerOneGameBoard,
      this.game.playerOne.getGameboard,
      true
    );
    this.renderBoard(
      this.playerTwoGameBoard,
      this.game.playerTwo.getGameboard,
      false
    );
  }

  renderBoard(grid, gameboard, isPlayerOne) {
    grid.innerHTML = '';
    for (let i = 0; i < gameboard.size; i++) {
      const row = document.createElement('tr');
      for (let j = 0; j < gameboard.size; j++) {
        const cell = document.createElement('td');
        cell.dataset.x = i;
        cell.dataset.y = j;

        const tile = gameboard.board[i][j];
        if (tile.isHit) {
          if (tile.hasShip) {
            cell.classList.add('hit');
          } else {
            cell.classList.add('miss');
          }
        } else if (this.setupMode && isPlayerOne && tile.hasShip) {
          cell.classList.add('placing');
        } else if (!this.setupMode && isPlayerOne && tile.hasShip) {
          cell.classList.add('ship');
        }

        row.appendChild(cell);
      }
      grid.appendChild(row);
    }
  }
}
