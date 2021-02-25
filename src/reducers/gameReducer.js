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
} from '../actions/types';

const initialState = {
  board: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
  turn: true,
  movesLeft: 9,
  room: "",
  token: "X",
  opponent: {},
  winner: null,
  msg: "",
  rematchMsg: "",
  gameLoading: false,
  waiting: false,
  joinError: false,
  isStarted: false,
  tokensAssigned: false,
  isGameOver: false,
  rematchRequest: false,
  requestSent: false,
  responseSent: false,
  rematchResponse: ""
};

export default (state = initialState, action) => {
  switch(action.type) {
    case SET_ROOM:
      return {
        ...state,
        room: action.payload,
        gameLoading: false
      };
    case SET_GAME_START:
      return {
        ...state,
        board: action.payload.board,
        turn: action.payload.turn,
        opponent: action.payload.opponent,
        msg: action.payload.msg,
        waiting: false,
        isStarted: true,
        gameLoading: false
      };
    case ASSIGN_TOKENS:
      return {
        ...state,
        token: action.payload,
        tokensAssigned: true,
        gameLoading: false
      };
    case UPDATE_BOARD:
      return {
        ...state,
        board: action.payload.board,
        turn: action.payload.turn,
        msg: action.payload.msg,
        movesLeft: action.payload.movesLeft,
        gameLoading: false
      }
    case GET_OPPONENT_SCORE:
      return {
        ...state,
        opponent: { ...state.opponent, wins: action.payload },
        gameLoading: false,
      };  
    case ON_JOIN_ERROR:
      return {
        ...state,
        joinError: !state.joinError,
        gameLoading: false
      }
    case ON_WIN:
      return {
        ...state,
        board: action.payload.board,
        winner: action.payload.winner,
        msg: action.payload.msg,
        isGameOver: true,
        gameLoading: false
      }
    case ON_LOSE:
      return {
        ...state,
        board: action.payload.board,
        winner: action.payload.winner,
        msg: action.payload.msg,
        isGameOver: true,
        gameLoading: false
      }
    case ON_DRAW:
      return {
        ...state,
        board: action.payload.board,
        movesLeft: action.payload.movesLeft,
        msg: action.payload.msg,
        isGameOver: true,
        gameLoading: false
      }
    case ON_REMATCH_REQUEST:
      return {
        ...state,
        rematchMsg: action.payload,
        rematchRequest: true,
        gameLoading: false
      }
    case ON_REMATCH_RESPONSE:
      return {
        ...state,
        rematchMsg: action.payload.rematchMsg,
        rematchResponse: action.payload.rematchResponse,
        gameLoading: false
      }
    case ON_SEND_REQUEST:
      return {
        ...state,
        requestSent: true,
        gameLoading: false
      }
    case ON_SEND_RESPONSE:
      return {
        ...state,
        responseSent: true,
        rematchResponse: action.payload
      }
    case GAME_ERROR:
      return {
        ...state,
        error: action.payload,
        gameLoading: false
      };
    case SET_WAITING:
      return {
        ...state,
        board: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        turn: true,
        movesLeft: 9,
        token: "X",
        opponent: {},
        winner: null,
        joinError: false,
        isStarted: false,
        tokensAssigned: false,
        isGameOver: false,
        rematchRequest: false,
        requestSent: false,
        responseSent: false,
        rematchResponse: "",
        waiting: true,
        gameLoading: false
      };
    case SET_GAME_LOADING:
      return {
        ...state,
        gameLoading: true
      };
    case RESTART_GAME:
      return {
        ...state,
        board: action.payload.board,
        turn: action.payload.turn,
        movesLeft: action.payload.movesLeft,
        msg: action.payload.msg,
        winner: null,
        isGameOver: false,
        rematchMsg: "", 
        rematchRequest: false,
        requestSent: false,
        responseSent: false,
        rematchResponse: "",
        gameLoading: false
      }
    case RESET_GAME_STATE:
      return {
        board: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        turn: true,
        movesLeft: 9,
        room: "",
        token: "X",
        opponent: {},
        winner: null,
        msg: "",
        rematchMsg: "",
        gameLoading: false,
        waiting: false,
        joinError: false,
        isStarted: false,
        tokensAssigned: false,
        isGameOver: false,
        rematchRequest: false,
        requestSent: false,
        responseSent: false,
        rematchResponse: ""
      }
    default:
      return state;
  }
}