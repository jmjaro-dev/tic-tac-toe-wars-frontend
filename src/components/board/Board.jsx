import { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import socketIOClient from 'socket.io-client';
import qs from 'qs';
// Box Component
import Box from '../box/Box';

// Determines the winner of the game
const determineWinner = (boxes) => {
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (boxes[a] && boxes[a] === boxes[b] && boxes[a] === boxes[c]) {
      return boxes[a];
    }
  }
  return null;
}

const Board = () => {
  const initialState = {
    boxes: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    isPlayerOnesTurn: true,
    movesLeft: 9
  }
  const [socket, setSocket] = useState(null);
  const [socketID, setSocketID] = useState(null);
  // Game Room State
  const [gameRoom, setGameRoom] = useState({
    room: null,
    token: 'X',
    opponent: {},
    waiting: false,
    joinError: false
  });
  // Board State
  const [boardState, setBoardState] = useState(initialState);
  const [userMove, setUserMove] = useState("");
  const ENDPOINT = 'http://localhost:5000/';

  useEffect(() => {
    if(socket === null) {
      // Initialize Socket Connection to server 
      setSocket(socketIOClient(ENDPOINT));
    } else {
      // Listen for joinError Event and set 'joinError' to true to redirect
      socket.on("joinError", onJoinError);

      if(gameRoom.room === null && !gameRoom.joinError) {
        // Get room and name information from the url
        const {room, name} = qs.parse(window.location.search, {
          ignoreQueryPrefix: true
        });
        // Set room id
        setGameRoom({ ...gameRoom, room });
        // Emit 'newRoomJoin'
        socket.emit("newRoomJoin", { room, name });
      } 

      if(gameRoom.room !== null) {
        // Set waiting state to true when not enough players in room
        socket.on("waiting", () => setGameRoom({ ...gameRoom, waiting: true }));

        // If there are enough players then set waiting state to false by listening to 'starting' event
        socket.on("starting", () => setGameRoom({ ...gameRoom, waiting: false })); 
      }
    }
  }, [socket, gameRoom, boardState]); 

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

  const onJoinError = _ => {
    setGameRoom({ ...gameRoom, joinError: true });
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
  
  if(gameRoom.joinError) {
    return (
      <Redirect to="/" />
    )
  } else {
    if(!gameRoom.waiting) {
      return (
        <div className="game">
          <Link to="/">Back</Link>
          <div className="game-board">
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
          </div>
        </div>
      )
    } else {
      return (
        <h1>waiting for other player to join</h1>
      );
    }
  }
}

export default Board;