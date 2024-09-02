import './styles/style.css';
import { Game } from './components/game-controller';
import { DisplayController } from './components/display-controller';

document.addEventListener('DOMContentLoaded', () => {
  const game = new Game();
  const displayController = new DisplayController(game);
});
