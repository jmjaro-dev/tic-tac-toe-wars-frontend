import { useState, useEffect } from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUserScore } from '../../actions/authActions';
import { 
  setRoom,
  setWaiting,
  setGameStart,
  assignTokens,
  updateBoard,
  getOpponentsScore,
  onWin,
  onLose,
  onDraw,
  onJoinError,
  onSendRequest,
  onSendResponse,
  onRematchRequest,
  onRematchResponse,
  restartGame,
  resetGameState
} from '../../actions/gameActions';

import PropTypes from 'prop-types';
// Components
import Box from '../box/Box';
import GameScore from '../gamescore/GameScore';
import Wait from '../wait/Wait';
import Rematch from '../rematch/Rematch';

const Board = ({ 
  user,
  socket,
  board,
  room,
  joinError,
  token,
  turn,
  opponent,
  winner,
  msg,
  rematchMsg,
  waiting,
  isStarted,
  tokensAssigned,
  isGameOver,
  rematchRequest,
  requestSent,
  rematchResponse,
  setRoom,
  setWaiting,
  setGameStart,
  assignTokens,
  updateBoard,
  getOpponentsScore,
  onWin,
  onLose,
  onDraw,
  onJoinError,
  onSendRequest,
  onSendResponse,
  onRematchRequest,
  onRematchResponse,
  restartGame,
  resetGameState,
  getUserScore
}) => {
  const [playerMove, setPlayerMove] = useState("");
  const { roomId } = useParams();

  useEffect(() => {
  }, [
    socket, 
    user, 
    room, 
    token,
    waiting, 
    joinError, 
    tokensAssigned, 
    isStarted, 
    msg,
    rematchMsg, 
    opponent, 
    winner, 
    isGameOver, 
    rematchRequest, 
    requestSent, 
    rematchResponse
  ]); 
  
  useEffect(async () => {
    // * Initialize Room and get players info when joined
    onPlayerJoin(roomId);
    
    // Emit 'newRoomJoin'
    socket.emit("newRoomJoin", { room: roomId, userId: user._id, name: user.username, wins: user.wins });
    // Listen for joinError Event and set 'joinError' to true to redirect
    socket.on("joinError", (error) => {
      console.log(error);
      onJoiningError();
    });

    // * Wait for another player to join 
    socket.on("waiting", () => onWait());
    // * Assign tokens when Players are enough
    
    socket.on("tokenAssignment", ({ playerToken }) => {
      onTokenAssignment(playerToken);
    });

    // * Initialize the Game
    socket.on("starting", ({ boardState, firstTurn, players }) => {
      // Get Opponent Info
      const yourOpponent = players.filter(player => player.id !== socket.id)[0]; 
      const gameData = { boardState, firstTurn, yourOpponent };
      setTimeout(() => onGameStart(gameData), 2000);
    });

    // * Listen for Player moves
    // Listen for "updateBoard" event
    socket.on("updateBoard", ({ boardState, nextTurn, movesLeft, players }) => {
      // Get Opponent Info
      const yourOpponent = players.filter(player => player.id !== socket.id)[0]; 
      const updatedGameData = { boardState, nextTurn, boardMovesLeft: movesLeft, yourOpponent };
      onUpdateBoard(updatedGameData);
    });

    // * Check if there is a winner or a draw
    // Listen for "winner" event to know if a winner is already determined
    socket.on("winner", ({ boardState, playerWhoWon, players }) => {
      // Get User Info
      const userInfo = players.filter(player => player.id === socket.id)[0]; 
      // Get Opponent Info
      const yourOpponent = players.filter(player => player.id !== socket.id)[0]; 
      // Set Winner
      const playerWon = playerWhoWon !== yourOpponent.token ? true : false;
      const message = playerWon ? "You won! :O" : "You lose :(";
      if(playerWon) {
        // Update msg and increment currentScore
        const userData = { id: userInfo.userId, username: userInfo.name, wins: userInfo.wins }
        const gameData = { board: boardState, winner: playerWon, msg: message };
        const data = { userData, gameData }
        onPlayerWon(data);
      } else {
        // Update msg: message and opponent's wins
        const gameData = { board: boardState, winner: playerWon, msg: message, opponent: yourOpponent };
        onPlayerLose(gameData);
      }
    });
    // Listen for "draw" event
    socket.on("draw", ({ boardState, movesLeft }) => {
      const message = "It's a draw!";
      const gameData = { board: boardState, movesLeft, msg: message }
      onMatchDraw(gameData);
    })

    // * Listen for Rematch Request from both players
    // Listen for "rematchRequestFromOpponent" event
    socket.on("rematchRequestFromOpponent", (name) => {
      const message = `${name} requested a rematch.`
      onOpponentRematchRequest({ message });
    });

    // * Listen for Rematch Request Response
    // Listen for "rematchRequestDeclined" event
    socket.on("rematchRequestDeclined", (name) => {
      const rematchMessage = name !== user.username ? `${name} declined your rematch request.` : "Request declined.";

      const response = { rematchMsg: rematchMessage, rematchResponse: "declined" };
      onOpponentRematchResponse(response);
    });
    // Listen for "rematchConfirmed" event 
    socket.on("rematchConfirmed", ({ room, name }) => {
      const rematchMessage = name !== user.username ? `${name} accepted your rematch request.` : "Request accepted.";

      const response = { rematchMsg: rematchMessage, rematchResponse: "confirmed" };
      onOpponentRematchResponse(response);
      socket.emit("rematchAcknowledged", room);
    })

    // * Listen for Restart Game event when rematch is acknowledged 
    socket.on("restartGame", ({ boardState, firstTurn, movesLeft, players }) => {
      // Get Opponent Info
      if(players.length === 2) {
        const yourOpponent = players.filter(player => player.id !== socket.id)[0];
        const newGameData = { boardState, firstTurn, boardMovesLeft: movesLeft, yourOpponent };
        setTimeout(() => onGameRestart(newGameData), 3000);
      }
    })

    return () => {
      setPlayerMove("");
      resetGameState();
      socket.emit("roomLeave", room);
      socket.offAny();
    }
  }, []);

  const onPlayerJoin = (room) => {
    setRoom(room);
    getUserScore(user._id);
  };

  const onWait = () => setWaiting();

  const onJoiningError = () => onJoinError();

  const onTokenAssignment = (playerToken) => assignTokens(playerToken); 
  
  const onGameStart = (data) => { 
    const { boardState, firstTurn, yourOpponent } = data;
    // Get Turn Info
    const playerTurn = firstTurn !== yourOpponent.token ? true : false;
    const message = playerTurn ? `Your turn - ${yourOpponent.token === 'X' ? 'O': 'X'}` : `${yourOpponent.name}'s turn`;
    const gameData = { board: boardState, turn: playerTurn, opponent: yourOpponent, msg: message }
    setGameStart(gameData); 
  }; 

  const onUpdateBoard = (data) => {
    const { boardState, nextTurn, yourOpponent, boardMovesLeft } = data;
    // Get Turn Info
    const playerTurn = nextTurn !== yourOpponent.token ? true : false;
    const message = playerTurn ? `Your turn - ${yourOpponent.token === 'X' ? 'O': 'X'}` : `${yourOpponent.name}'s turn`;
    const updatedGameData = { board: boardState, turn: playerTurn, opponent: yourOpponent, msg: message, movesLeft: boardMovesLeft }
    updateBoard(updatedGameData);
  };  

  const onPlayerWon = (gameData) => {
    onWin(gameData);
    setTimeout(() => getUserScore(user._id), 1000);
  };  

  const onPlayerLose = (gameData) => {
    const { opponent } = gameData;
    onLose(gameData);
    setTimeout(() => getOpponentsScore(opponent.userId), 1000);
  }; 

  const onMatchDraw = (gameData) => onDraw(gameData);
  
  const onOpponentRematchRequest = (message) => onRematchRequest(message); 

  const onOpponentRematchResponse = (response) => onRematchResponse(response);  
  const onGameRestart = (data) => {
    const { boardState, firstTurn, yourOpponent, boardMovesLeft } = data;
    // Get Turn Info
    const playerTurn = firstTurn !== yourOpponent.token ? true : false;
    const message = playerTurn ? `Your turn - ${yourOpponent.token === 'X' ? 'O': 'X'}` : `${yourOpponent.name}'s turn`;
    const newGameData = { board: boardState, turn: playerTurn, opponent: yourOpponent, msg: message, movesLeft: boardMovesLeft }
    restartGame(newGameData);
  };  

  const onChageHandler = e => {
    const input = e.target.value;
    setPlayerMove(input);
  }

  // On Room Leave
  const onLeave = () => {
    resetGameState();
    socket.offAny();
    socket.emit("roomLeave", room);
  } 

  // Decline Rematch Request
  const onDecline = () => {
    const name = user.username;
    onSendResponse({ rematchResponse: "declined" });
    socket.emit("rematchDecline", { room, name });
  }

  // Confirm Rematch Request
  const onConfirm = () => {
    const name = user.username;
    onSendResponse({ rematchResponse: "confirmed" });
    socket.emit("rematchConfirm", { room, name });
  }

  const onSubmit = e => {
    e.preventDefault();

    const idx = playerMove-1;
    setPlayerMove("");

    socket.emit("playerMove", { room, token, idx });
  }

  // Request a Rematch
  const onGameRematch = () => {
    const name = user.username;

    onSendRequest();
    socket.emit("rematchRequest", { room, name });
  }

  // Renders a Box
  const renderBox = position => {
    const idx = position - 1;
    return (
      <Box
        value={board[idx]}
      />
    );
  } 
  
  if(socket && joinError) {
    resetGameState();
    socket.offAny();
    socket.emit("roomLeave", room);

    return <Redirect to="/" />;
  } else {
    if(!waiting && isStarted) {
      return (
        <div className="game">
          <div className="game-board">
            <p className="status">{msg}</p>
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
              {!isGameOver ? (
                <form onSubmit={onSubmit} className={turn && winner === null ? "user-move" : "user-move hidden" }>
                  <div>
                    <label htmlFor="playerMove">Select Cell Number: [1- 9]</label>
                    <input type="number" name="playerMove" id="playerMove" value={playerMove} onChange={onChageHandler} maxLength={1} min={1} max={9} />
                  </div>
                  <button className="btn-submit" type="submit" disabled={playerMove === "" || playerMove < 0 || playerMove > 9}>Confirm</button>
                </form> 
              ) : (
                <>
                  {(rematchRequest || requestSent) ? (
                    <Rematch 
                      msg={rematchMsg} 
                      sender={requestSent ? true : false} 
                      response={rematchResponse} 
                      onDecline={onDecline} 
                      onConfirm={onConfirm} 
                      onLeave={onLeave} 
                    /> 
                  ) : (
                    <>
                      <button className="btn-rematch" onClick={onGameRematch}>Request Rematch</button>
                      <Link to="/" onClick={onLeave}>Exit Room</Link>
                    </>
                  )}
                </>
              )}
            </>
          </div>
          {user && opponent && 
            <GameScore 
              playersData={ [
                { username: "You", wins: user.wins }, 
                { username: opponent.name, wins: opponent.wins } 
              ] }
            /> 
          }
        </div>
      )
    } else {
      return (
        <Wait room={room} onLeave={onLeave} />
      );
    }
  }
}


Board.propTypes = {
  user: PropTypes.object.isRequired,
  socket: PropTypes.object.isRequired,
  board: PropTypes.array.isRequired,
  room: PropTypes.string.isRequired,
  token: PropTypes.string.isRequired,
  turn: PropTypes.any.isRequired,
  opponent: PropTypes.object.isRequired,
  winner: PropTypes.any,
  msg: PropTypes.string.isRequired,
  rematchMsg: PropTypes.string.isRequired,
  waiting: PropTypes.bool.isRequired,
  joinError: PropTypes.bool.isRequired,
  isStarted: PropTypes.bool.isRequired,
  tokensAssigned: PropTypes.bool.isRequired,
  isGameOver: PropTypes.bool.isRequired,
  rematchRequest: PropTypes.bool.isRequired,
  requestSent: PropTypes.bool.isRequired,
  rematchResponse: PropTypes.string.isRequired,
  setRoom: PropTypes.func.isRequired,
  setWaiting: PropTypes.func.isRequired,
  setGameStart: PropTypes.func.isRequired,
  assignTokens: PropTypes.func.isRequired,
  updateBoard: PropTypes.func.isRequired,
  getOpponentsScore: PropTypes.func.isRequired,
  onJoinError: PropTypes.func.isRequired,
  onWin: PropTypes.func.isRequired,
  onLose: PropTypes.func.isRequired,
  onDraw: PropTypes.func.isRequired,
  onRematchRequest: PropTypes.func.isRequired,
  onRematchResponse: PropTypes.func.isRequired,
  onSendRequest: PropTypes.func.isRequired,
  onSendResponse: PropTypes.func.isRequired,
  restartGame: PropTypes.func.isRequired,
  resetGameState: PropTypes.func.isRequired,
  getUserScore: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  user: state.auth.user,
  socket: state.auth.socket,
  board: state.game.board,
  room: state.game.room,
  token: state.game.token,
  turn: state.game.turn,
  opponent: state.game.opponent,
  winner: state.game.winner,
  msg: state.game.msg,
  rematchMsg: state.game.rematchMsg,
  waiting: state.game.waiting,
  joinError: state.game.joinError,
  isStarted: state.game.isStarted,
  tokensAssigned: state.game.tokensAssigned,
  isGameOver: state.game.isGameOver,
  rematchRequest: state.game.rematchRequest,
  requestSent: state.game.requestSent,
  rematchResponse: state.game.rematchResponse
});

export default connect(mapStateToProps, { 
  setRoom,
  setWaiting,
  setGameStart,
  assignTokens,
  updateBoard,
  getOpponentsScore,
  onJoinError,
  onWin,
  onLose,
  onDraw,
  onSendRequest,
  onSendResponse,
  onRematchRequest,
  onRematchResponse,
  restartGame,
  resetGameState,
  getUserScore
})(Board);