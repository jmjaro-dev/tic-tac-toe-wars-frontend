import './App.scss';
// Component
import Board from './components/board/Board';

function App() {
  // Determines the winner of the game
  const determineWinner = (boxes) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (boxes[a] && boxes[a] === boxes[b] && boxes[a] === boxes[c]) {
        return boxes[a];
      }
    }
    return null;
  }

  return (
    <div className="App">
      <div className="game">
        <div className="game-board">
          <Board determineWinner={determineWinner} />
        </div>
      </div>
    </div>
  );
}

export default App;
