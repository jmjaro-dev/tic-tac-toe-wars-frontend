import axios from 'axios';
import {
  SET_ROOM,
  SET_GAME_START,
  ASSIGN_TOKENS,
  UPDATE_BOARD,
  GET_OPPONENT_SCORE,
  ON_JOIN_ERROR,
  ON_WIN,
  ON_LOSE,
  ON_DRAW,
  GAME_ERROR,
  ON_REMATCH_REQUEST,
  ON_REMATCH_RESPONSE,
  ON_SEND_RESPONSE,
  ON_SEND_REQUEST,
  SET_WAITING,
  SET_GAME_LOADING,
  RESTART_GAME,
  RESET_GAME_STATE
} from './types';

// Set Room
export const setRoom = (room) => async dispatch => {
  dispatch({ type: SET_GAME_LOADING });

  dispatch({
    type: SET_ROOM,
    payload: room
  });
};

// Set Game Start
export const setGameStart = (gameData) => async dispatch => { 
  dispatch({ type: SET_GAME_LOADING });

  dispatch({
    type: SET_GAME_START,
    payload: gameData
  });
};

// Assign Tokens
export const assignTokens = (token) => async dispatch => { 
  dispatch({ type: SET_GAME_LOADING });

  dispatch({
    type: ASSIGN_TOKENS,
    payload: token
  });
};

// Update Board
export const updateBoard = (updatedGameData) => async dispatch => { 
  dispatch({ type: SET_GAME_LOADING });
  
  dispatch({
    type: UPDATE_BOARD,
    payload: updatedGameData
  });
};

// Get Opponent's Score
export const getOpponentsScore = (userId) => async dispatch => {
  dispatch({ type: SET_GAME_LOADING });

  try {
    const res = await axios.get(`http://localhost:5000/api/scores/${userId}`);
  
    dispatch({
      type: GET_OPPONENT_SCORE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: GAME_ERROR,
      payload: err.response.msg
    });
  }
};

// On Join Error
export const onJoinError = () => async dispatch => { 
  dispatch({ type: SET_GAME_LOADING });

  dispatch({
    type: ON_JOIN_ERROR
  });
};

// On Rematch Request
export const onRematchRequest = ({ message }) => async dispatch => { 
  dispatch({ type: SET_GAME_LOADING });

  dispatch({
    type: ON_REMATCH_REQUEST,
    payload: message
  });
};

// On Rematch Response
export const onRematchResponse = (response) => async dispatch => { 
  dispatch({ type: SET_GAME_LOADING });

  dispatch({
    type: ON_REMATCH_RESPONSE,
    payload: response
  });
};

// On Send Rematch Request
export const onSendRequest = () => async dispatch => { 
  dispatch({ type: SET_GAME_LOADING });

  dispatch({
    type: ON_SEND_REQUEST
  });
};

// On Send Rematch Response
export const onSendResponse = ({ rematchResponse }) => async dispatch => { 
  dispatch({ type: SET_GAME_LOADING });

  dispatch({
    type: ON_SEND_RESPONSE,
    payload: rematchResponse
  });
};

// On Draw
export const onDraw = (gameData) => async dispatch => { 
  dispatch({ type: SET_GAME_LOADING });
  
  dispatch({
    type: ON_DRAW,
    payload: gameData
  });
};

// On Win
export const onWin = ({ userData, gameData }) => async dispatch => { 
  dispatch({
    type: SET_GAME_LOADING
  })

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  
  const { id, username, wins } = userData;
  const data = { id, username, wins }

  try {
    await axios.post(`http://localhost:5000/api/scores/update/score/${id}`, data, config);
  
    dispatch({
      type: ON_WIN,
      payload: gameData
    });
  } catch (err) {
    dispatch({
      type: GAME_ERROR,
      payload: err.response.msg
    });
  }
};

// On Lose
export const onLose = (gameData) => async dispatch => { 
  dispatch({ type: SET_GAME_LOADING });

  dispatch({
    type: ON_LOSE,
    payload: gameData
  });
};

// Restart Game
export const restartGame = (newGameData) => async dispatch => {
  dispatch({ type: SET_GAME_LOADING });
  
  dispatch({ 
    type: RESTART_GAME,
    payload: newGameData
  })
};

// Set Waiting to true
export const setWaiting = () => async dispatch => dispatch({ type: SET_WAITING });

// Reset Game State
export const resetGameState = () => async dispatch =>{ 
  dispatch({ type: SET_GAME_LOADING });
  dispatch({ type: RESET_GAME_STATE })
};