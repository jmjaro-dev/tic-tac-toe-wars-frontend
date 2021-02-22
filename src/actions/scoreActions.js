import axios from 'axios';
import {
  GET_SCORES,
  SCORES_ERROR,
  SET_SCORELOADING,
  RESET_SCORES_STATE
} from './types';

// Get Scores
export const getScores = () => async dispatch => {
  dispatch({
    type: SET_SCORELOADING
  });

  try {
    const res = await axios.get('http://localhost:5000/api/scores/');
  
    dispatch({
      type: GET_SCORES,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: SCORES_ERROR,
      payload: err.response.msg
    });
  }
};

// Add Score
export const addScore = (playerData) => async dispatch => { 
  dispatch({
    type: SET_SCORELOADING
  });
  
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    await axios.post(`http://localhost:5000/api/scores/update/score/${playerData._id}`, playerData, config);

  } catch (err) {
    dispatch({
      type: SCORES_ERROR,
      payload: err.response.msg
    });
  }
};

// Update Score
export const updateScore = (playerData) => async dispatch => {
  dispatch({
    type: SET_SCORELOADING
  });
  
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    await axios.post(`http://localhost:5000/api/scores/update/score/${playerData._id}`, playerData, config);
  } catch (err) {
    dispatch({
      type: SCORES_ERROR,
      payload: err.response.msg
    });
  }
};

// Reset Scores State on Log out
export const resetScoresState = () => async dispatch => dispatch({ type: RESET_SCORES_STATE });