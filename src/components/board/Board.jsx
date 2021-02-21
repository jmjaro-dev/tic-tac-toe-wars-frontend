import { useState, useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
import qs from 'qs';
// Components
import Box from '../box/Box';
import Wait from '../wait/Wait';
import Rematch from '../rematch/Rematch';

const Board = ({ socket }) => {
  // Game Room Initial State
  const gameInitialState = {
    socketID: "",
    board: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
    turn: true,
    movesLeft: 9,
    room: "",
    token: "",
    name: "",
    opponent: [],
    playerMove: "",
    winner: null,
    msg: "",
    rematchMsg: "",
    waiting: false,
    joinError: false,
    isStarted: false,
    tokensAssigned: false,
    isGameOver: false,
    rematchRequest: false,
    requestSent: false,
    responseSent: false,
    rematchResponse: null
  };
  // Game Room State
  const [gameState, setGameState] = useState(gameInitialState);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Runs when component unmounts
    return () => {

      if(socket !== "" && isLeaving) {
        // Listen to players leaving the room
        socket.emit("roomLeave", gameState.room);
      }
    }
  }, [])
  
  useEffect(() => {
    if(socket !== "") {
      // Set socket ID if empty
      if(gameState.socketID === "") {
        // Set socket ID state
        setGameState({ ...gameState, socketID: socket.id });
      }

      if(gameState.room === "" && gameState.joinError === false && gameState.tokensAssigned === false && gameState.isStarted === false) {
        // Get room and name information from the url
        const {room, name} = qs.parse(window.location.search, {
          ignoreQueryPrefix: true
        });
        // Set room id
        setGameState({ ...gameState, room, name });
        // Emit 'newRoomJoin'
        socket.emit("newRoomJoin", { room, name });
        // Listen for joinError Event and set 'joinError' to true to redirect
        socket.on("joinError", onJoinError);
      }

      if(gameState.room !== "" && !gameState.joinError && gameState.tokensAssigned === false && gameState.isStarted === false) {
        socket.on("waiting", () => setGameState({ ...gameState, waiting: true, opponent: [] }))
        socket.on("tokenAssignment", ({ token }) => { 
          setGameState({ ...gameState, token, tokensAssigned: true, waiting: false })
        });
      }

      if(gameState.room !== "" && !gameState.joinError && gameState.tokensAssigned === true && !gameState.isStarted) {
        socket.on("starting", ({ boardState, turn, players }) => {
          // Get Opponent Info
          const opponent = players.filter(player => player.id !== socket.id);
          // Get Turn Info
          const playerTurn = gameState.token === turn ? true : false;
          const msg = playerTurn ? "Your turn" : `${opponent[0].name}'s turn`;

          setGameState({ ...gameState, board: boardState, turn: playerTurn, opponent, msg, isStarted: true, waiting: false });

        });
      }

      if(gameState.room !== "" && !gameState.joinError && gameState.tokensAssigned === true && gameState.isStarted === true && gameState.winner === null && gameState.isGameOver === false) {
        // Listen for "updateBoard" event
        socket.on("updateBoard", ({ boardState, turn, movesLeft }) => {
          // Get Turn Info
          const playerTurn = gameState.token === turn ? true : false;
          // Update msg
          const msg = playerTurn ? "Your turn" : `${gameState.opponent[0].name}'s turn`;
          setGameState({ ...gameState, board: boardState, turn: playerTurn, msg, movesLeft });
        });

        // Listen for "winner" event to know if a winner is already determined
        socket.on("winner", ({ boardState, winner }) => {
          // Set Winner
          const playerWon = winner === gameState.token ? true : false;
          // Update msg
          const msg = playerWon ? "You won!" : "You lose :(";
          setGameState({ ...gameState, board: boardState, winner: playerWon, msg, isGameOver: true });
        });

        // Listen for "draw" event
        socket.on("draw", ({ boardState, movesLeft }) => {
          const msg = "It's a draw!";
          setGameState({ ...gameState, board: boardState, movesLeft, msg, isGameOver: true });
        })
      }

      // TODO: Listen for Rematch Request from Opponent
      if(gameState.room !== "" && !gameState.joinError && gameState.tokensAssigned === true && gameState.isStarted === true && gameState.winner !== null && gameState.isGameOver === true) {
        // Listen for "rematchRequestFromOpponent" event
        socket.on("rematchRequestFromOpponent", (name) => {
          const rematchMsg = `${name} requested a rematch.`
          setGameState({ ...gameState, rematchMsg, rematchRequest: true });
        });
        
        // TODO: Listen for "restartGame" event
        socket.on("restartGame", ({ boardState, turn }) => {
          // Get Turn Info
          const playerTurn = gameState.token === turn ? true : false;
          const msg = playerTurn ? "Your turn" : `${gameState.opponent[0].name}'s turn`;

          setGameState({ ...gameState, board: boardState, turn: playerTurn, winner: null, msg, waiting: false, isStarted: true, rematchMsg: "", rematchRequest: false, rematchSent: false, rematchResponse: null, isGameOver: false });
        });
      }

      // Listen for Rematch Response 
      if(gameState.room !== "" && !gameState.joinError && gameState.tokensAssigned === true && gameState.isStarted === true && gameState.winner !== null && gameState.isGameOver === true && gameState.requestSent === true) {
        // Listen for "rematchRequestDeclined" event
        socket.on("rematchRequestDeclined", (name) => {
          const rematchMsg = `${name} declined your rematch request.`;
          const rematchResponse = "declined";
          setGameState({ ...gameState, rematchMsg, rematchResponse });
        });

        // Listen for "rematchConfirmed" event
        socket.on("rematchConfirmed", (name) => {
          const rematchMsg = `${name} declined your rematch request.`;
          const rematchResponse = "confirmed";
          setGameState({ ...gameState, rematchMsg, rematchResponse });
        });
      }
    }
  }, [socket, gameState.socketID, gameState.room, gameState.joinError, gameState.tokensAssigned, gameState.isStarted, gameState.waiting, gameState.token, gameState.opponent, gameState.winner, gameState.isGameOver, gameState.rematchMsg, gameState.rematchRequest, gameState.requestSent, gameState.rematchSent, gameState.rematchResponse ]); 

  const onJoinError = _ => {
    setGameState({ ...gameState, joinError: true });
  }

  const onChageHandler = e => {
    const input = e.target.value;
    setGameState({ ...gameState, playerMove: input });
  }

  // Decline Rematch Request
  const onDecline = _ => {
    const room = gameState.room;
    const name = gameState.name;

    socket.emit("rematchDecline", { room, name });
    setGameState({ ...gameState, responseSent: true, rematchResponse: "declined" })
  }

  // Confirm Rematch Request
  const onConfirm = _ => {
    const room = gameState.room;
    socket.emit("rematchConfirm", room);
  }

  const onSubmit = e => {
    e.preventDefault();
    const idx = Number(gameState.playerMove) - 1;
    const room = gameState.room;
    const token = gameState.token;

    socket.emit("playerMove", { room, token, idx });
  }

  // Request a Rematch
  const onGameRematch = _ => {
    const room = gameState.room;
    const name = gameState.name;

    setGameState({ ...gameState, requestSent: true });
    socket.emit("rematchRequest", { room, name });
  }

  // Renders a Box
  const renderBox = position => {
    const idx = position - 1;
    return (
      <Box
        value={gameState.board[idx]}
      />
    );
  } 
  
  if(gameState.joinError) {
    return (
      <Redirect to="/" />
    )
  } else {
    if(!gameState.waiting && gameState.isStarted ) {
      return (
        <div className="game">
          <div className="game-board">
            <div className="status">{gameState.msg}</div>
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
              {!gameState.isGameOver ? (
                <>
                  {gameState.turn && gameState.winner === null && 
                    <form onSubmit={onSubmit} className="user-move">
                      <div>
                        <label htmlFor="playerMove">Select Cell Number: [1- 9]</label>
                        <input type="text" name="playerMove" value={gameState.playerMove} onChange={onChageHandler} maxLength="1" />
                      </div>
                      <button className="btn-submit" type="submit" disabled={gameState.playerMove === "" || gameState.playerMove === "0"}>Confirm</button>
                    </form>
                  } 
                </>
              ) : (
                <>
                  {(gameState.rematchRequest === true || gameState.requestSent) ? (
                    <Rematch msg={gameState.rematchMsg} sender={gameState.requestSent ? true : false} response={gameState.rematchResponse} onDecline={onDecline} onConfirm={onConfirm} /> 
                  ) : (
                    <button className="btn-reset" onClick={onGameRematch}>Request Rematch</button>
                  )}
                </>
              )}
            </>
          </div>
        </div>
      )
    } else {
      return (
        <Wait room={gameState.room} />
      );
    }
  }
}

export default Board;