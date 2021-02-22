import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  SET_SOCKET,
  UPDATE_USERNAME,
  UPDATE_PASSWORD,
  AUTH_ERROR,
  ACCOUNT_ERROR,
  USERNAME_ERROR,
  PASSWORD_ERROR,
  GET_USER_SCORE,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
  DELETE_ACCOUNT,
  SET_AUTHLOADING,
  RESET_STATUS
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: null,
  authLoading: false,
  user: null,
  socket: null,
  authError: null,
  accountError: null,
  userError: null,
  usernameError: null,
  usernameUpdateStatus: null,
  passwordChangeStatus: null
}

export default (state = initialState, action) => {
  switch(action.type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        authLoading: false,
        user: action.payload
      }
    case UPDATE_PASSWORD:
      return {
        ...state,
        passError: null,
        passwordChangeStatus: 'success',
        authLoading: false
      };
    case UPDATE_USERNAME: 
      return {
        ...state,
        user: action.payload,
        usernameError: null,
        authLoading: false
      }
    case GET_USER_SCORE:
      return {
        ...state,
        user: { ...state.user, wins: action.payload },
        authLoading: false
      };
    case DELETE_ACCOUNT: {
      return {
        ...state,
        accountDeleteStatus: 'success',
        authLoading: false
      }
    }
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        authLoading: false
      };
    case REGISTER_FAIL:
    case LOGIN_FAIL:
    case AUTH_ERROR:
    case LOGOUT:
      localStorage.removeItem('token');
      if(state.socket !== null) {
        state.socket.disconnect();
      }
      return {
        ...state,
        token: null,
        isAuthenticated: null,
        authLoading: false,
        user: null,
        socket: null,
        authError: action.payload,
        accountError: null,
        userError: null,
        usernameError: null,
        usernameUpdateStatus: null,
        passwordChangeStatus: null
      };
    case ACCOUNT_ERROR: 
      return {
        ...state,
        accountError: action.payload,
        accountDeleteStatus: 'failed',
        authLoading:false
      }
    case USERNAME_ERROR: 
      return {
        ...state,
        usernameError: action.payload,
        authLoading:false
      }
    case PASSWORD_ERROR: 
      return {
        ...state,
        passError: action.payload,
        passwordChangeStatus: 'failed',
        authLoading:false
      }
    case CLEAR_ERRORS:
      return {
        ...state,
        authError: null,
        userError: null,
        accountError: null,
        usernameError: null,
        passError: null,
      }
    case SET_SOCKET:
      return {
        ...state,
        socket: action.payload
      }
    case SET_AUTHLOADING:
      return {
        ...state,
        authLoading: true
      }
    case RESET_STATUS:
      switch(action.payload) {
        case 'username' :
          return {
            ...state,
            usernameUpdateStatus: null
          }
        case 'account':
          return {
            ...state,
            accountDeleteStatus: null,
          }
        case 'password': 
          return {
            ...state,
            passwordChangeStatus: null
          }
        default:
          return {
            ...state
          }
      }
    default:
      return state;
  }
}