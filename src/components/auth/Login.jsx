import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alertActions';
import { login } from '../../actions/authActions';
import PropTypes from 'prop-types';
// Alert Component
import Alerts from '../layout/Alerts';

const Login =  ({ isAuthenticated, error, login, setAlert, ...props })  => {
  // Check if user is authenticated
  useEffect(() => {
    if(isAuthenticated) {
      props.history.push('/');
    }

    if(error) {
      setAlert(error, 'danger');
    }
    // eslint-disable-next-line
  }, [error, isAuthenticated, props.history]);

  const [user, setUser] = useState({
    username:'',
    password: ''  
  });

  const { username, password } = user;

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();

    if(username === '' || password === '') {
      setAlert('Please fill in all fields', 'danger');
    } else {
      login({
        username,
        password
      });
    }
  }

  return (
    <div className="auth-form-container">
      <h3> Login </h3>

      <form onSubmit={onSubmit}>
        <input type="text" name="username" value={username} onChange={onChange} placeholder="username" maxLength={20} required/>
        <input type="password" name="password" value={password} onChange={onChange} placeholder="password" minLength={6} required/>
        <p>No Account yet? Register <Link to="/register">here</Link>.</p>
        <Alerts />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

Login.propTypes = {
  isAuthenticated: PropTypes.bool,
  error: PropTypes.object,
  login: PropTypes.func.isRequired,
  setAlert: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.auth.authError
});

export default connect(mapStateToProps, { login, setAlert })(Login);