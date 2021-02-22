import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import io from 'socket.io-client';

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  SET_SOCKET,
  UPDATE_USERNAME,
  UPDATE_PASSWORD,
  GET_USER_SCORE,
  AUTH_ERROR,
  ACCOUNT_ERROR,
  USERNAME_ERROR,
  PASSWORD_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
  DELETE_ACCOUNT,
  SET_AUTHLOADING,
  RESET_STATUS,
  USER_ERROR
} from './types';

// Load User
export const loadUser = () => async dispatch => {
  // Set Loading to True
  dispatch({
    type: SET_AUTHLOADING
  });

  // Set global header token
  if(localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('http://localhost:5000/api/auth');
    
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });

  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: err.response.data
    });
  }
};

// Get User Score
export const getUserScore = (userId) => async dispatch => {
  dispatch({
    type: SET_AUTHLOADING
  });

  try {
    const res = await axios.get(`http://localhost:5000/api/scores/${userId}`);
  
    dispatch({
      type: GET_USER_SCORE,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: USER_ERROR,
      payload: err.response.msg
    });
  }
};

// Set Socket
export const setSocket = () => async dispatch => {
  // Set Loading to True
  dispatch({
    type: SET_AUTHLOADING
  });

  try {
    const serverUrl = 'http://localhost:5000/';
    const socket =  io(serverUrl);
    
    dispatch({
      type: SET_SOCKET,
      payload: socket
    });

  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: err.response.data
    });
  }
};

// Register User
export const register = formData => async dispatch => {
  // Set Loading to True
  dispatch({
    type: SET_AUTHLOADING
  });

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }

  try {
    const res = await axios.post('http://localhost:5000/api/users', formData, config);

    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: REGISTER_FAIL,
      payload: err.response.data.msg
    });

    setTimeout(() => {
      dispatch({
        type: CLEAR_ERRORS
      });
    }, 4000);
  }
};

// Login User
export const login = formData => async (dispatch) => {
  // Set Loading to True
  dispatch({
    type: SET_AUTHLOADING
  });

  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  }
  
  try {
    const res = await axios.post('http://localhost:5000/api/auth', formData, config);
    
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
  } catch (err) {
    console.log(err.response.data.msg);
    dispatch({
      type: LOGIN_FAIL,
      payload: err.response.data.msg
    });
    
    setTimeout(() => {
      dispatch({
        type: CLEAR_ERRORS
      });
    }, 4000);
  }
};

// Logout
export const logout = id => async dispatch => {
  // Set Loading to True
  dispatch({
    type: SET_AUTHLOADING
  });
  
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    await axios.put('http://localhost:5000/api/auth/logout', { id }, config);
    
    dispatch({ type: LOGOUT });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
      payload: err.response.data
    });
  }
}

// Update User's username
export const updateUsername = user => async dispatch => {
  // Set Loading to True
  dispatch({
    type: SET_AUTHLOADING
  });

  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    // Update User's username in users database
    const res = await axios.put(`http://localhost:5000/api/users/${user.id}`, user, config);

    dispatch({
      type: UPDATE_USERNAME,
      payload: res.data
    });
  } catch (err) {
    dispatch({
      type: USERNAME_ERROR,
      payload: err.response.msg
    });

    setTimeout(() => {
      dispatch({
        type: CLEAR_ERRORS
      });
    }, 4000);
  }
};

// Update User's Password
export const updatePassword = (user_id, passwords) => async dispatch => {
  // Set Loading to True
  dispatch({
    type: SET_AUTHLOADING
  });

  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    // Update User's password in users database
    const res = await axios.put(`/api/users/update/password/${user_id}`, passwords, config);

    dispatch({
      type: UPDATE_PASSWORD,
      payload: res.data.msg
    });
  } catch (err) {
    dispatch({
      type: PASSWORD_ERROR,
      payload: err.response.data.msg
    });

    setTimeout(() => {
      dispatch({
        type: CLEAR_ERRORS
      });
    }, 4000);
  }
};

// Delete User Account
export const deleteAccount = (id, password) => async dispatch => {
  // Set Loading to True
  dispatch({
    type: SET_AUTHLOADING
  });

  const config = {
    headers: {
      password
    }
  }

  try {
    // Delete user in users database
    await axios.delete(`/api/users/${id}`, config);

    dispatch({ type: DELETE_ACCOUNT });
  } catch (err) {
    dispatch({
      type: ACCOUNT_ERROR,
      payload: err.response.data.msg
    });

    setTimeout(() => {
      dispatch({
        type: CLEAR_ERRORS
      });
    }, 4000);
  }
};

// Reset Status
export const resetStatus = status => async dispatch => dispatch({ type: RESET_STATUS, payload: status });