import { combineReducers } from 'redux';
import authReducer from './authReducer.js';
import alertReducer from './alertReducer';
import gameReducer from './gameReducer';
import scoreReducer from './scoreReducer';

export default combineReducers({
  auth: authReducer,
  alert: alertReducer,
  game: gameReducer,
  score: scoreReducer
});