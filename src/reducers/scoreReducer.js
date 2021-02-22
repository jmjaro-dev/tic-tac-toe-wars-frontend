import {
  GET_SCORES,
  SCORES_ERROR,
  SET_SCORELOADING,
  RESET_SCORES_STATE
} from '../actions/types';

const initialState = {
  scores: null,
  error: null,
  scoreLoading: true
};

export default (state = initialState, action) => {
  switch(action.type) {
    case GET_SCORES:
      return {
        ...state,
        scores: action.payload,
        scoreLoading: false
      };
    case SCORES_ERROR:
      return {
        ...state,
        error: action.payload,
        scoreLoading: false
      };
    case SET_SCORELOADING:
      return {
        ...state,
        scoreLoading: true
      }
    case RESET_SCORES_STATE:
      return {
        scores: null,
        score: null,
        error: null,
        scoreLoading: false
      }
    default:
      return state;
  }
}