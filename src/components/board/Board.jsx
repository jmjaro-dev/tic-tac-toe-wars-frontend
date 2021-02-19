import { useState } from 'react';
import Box from '../box/Box';

const Board = ({ determineWinner }) => {
  const initialState = {
    boxes: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    isPlayerOnesTurn: true,
    movesLeft: 9
  }
  // Board State
  const [boardState, setBoardState] = useState(initialState);
  const [userMove, setUserMove] = useState("");

  // local variables
  let status;
  const winner = determineWinner(boardState.boxes);

  // Updates the status
  if (winner) {
    status = `Player ${winner === 'X' ? '1' : '2'} wins!`;
  } else {
    if(boardState.movesLeft === 0) {
      status = "It's a draw!";
    } else {
      status = `Player ${boardState.isPlayerOnesTurn ? "1's [X]" : "2's [O]"} turn.`;
    }
  }

  const onChageHandler = e => {
    const input = e.target.value;
    setUserMove(input);
  }

  const onSubmit = e => {
    e.preventDefault();
    const idx = Number(userMove) - 1;

    const boxes = boardState.boxes.slice();
  
    if (determineWinner(boxes) || (boxes[idx] === 'X' || boxes[idx] === 'O')) {
      return;
    }
    if(boardState.movesLeft > 0) {
      boxes[idx] = boardState.isPlayerOnesTurn ? 'X' : 'O';
      setBoardState({
        boxes,
        isPlayerOnesTurn: !boardState.isPlayerOnesTurn,
        movesLeft: boardState.movesLeft-1
      });
      setUserMove("");
    }
  }

  // Resets the game
  const onReset = _ => {
    setBoardState(initialState);
    setUserMove("");
  }

  // Renders a Box
  const renderBox = position => {
    const idx = position - 1;

    return (
      <Box
        value={boardState.boxes[idx]}
      />
    );
  } 
  
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        {renderBox(1)}
        {renderBox(2)}
        {renderBox(3)}
      </div>
      <div className="board-row">
        {renderBox(4)}
        {renderBox(5)}
        {renderBox(6)}
      </div>
      <div className="board-row">
        {renderBox(7)}
        {renderBox(8)}
        {renderBox(9)}
      </div>
      <>
        {boardState.movesLeft > 0 && winner === null ? (
          <form onSubmit={onSubmit} className="user-move">
            <div>
              <label htmlFor="userMove">Select Cell Number: [1- 9]</label>
              <input type="text" name="userMove" value={userMove} onChange={onChageHandler} maxLength="1" />
            </div>
            <button className="btn-submit" type="submit" disabled={userMove === "" || userMove === "0"}>Confirm</button>
          </form>
        ) : (
          <button className="btn-reset" onClick={onReset}>Play Again</button>
        )}
      </>
    </>
  )
}

export default Board;