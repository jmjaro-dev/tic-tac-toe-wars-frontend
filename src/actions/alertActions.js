import {
  SET_ALERT,
  REMOVE_ALERT
} from './types';
const { v4: uuidv4 } = require('uuid');

// Set Alert
export const setAlert = (msg, type, timeout = 4000) => async dispatch => {
  const id = uuidv4();
  
  dispatch({
    type: SET_ALERT,
    payload: { msg, type, id }
  });

  setTimeout(() => dispatch({
    type: REMOVE_ALERT, payload: id
  }), timeout);
};