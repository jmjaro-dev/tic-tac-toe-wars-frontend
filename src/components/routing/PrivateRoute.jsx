import { useEffect } from 'react';
import { connect } from 'react-redux';
import { loadUser, setSocket, logout } from '../../actions/authActions';
import { Route, Redirect } from 'react-router-dom';
import PreLoader from '../layout/PreLoader';
import PropTypes from 'prop-types';

const PrivateRoute = ({ component:  Component, isAuthenticated, loading, user, loadUser, logout, setSocket, ...rest }) => {
  useEffect(() => {
    if(localStorage.token && !user) {
      onUserLoad();
      loadUser();
    }
    
    return () => {
      if(user && isAuthenticated) {
        logout(user._id);
      }
    }
  }, []);
  
  const onUserLoad = () => setSocket();

  return (
    <div>
      {!user && localStorage.token ? (
        <PreLoader />
      ) : (
        <Route {...rest } render={ props => !isAuthenticated && !loading ? (
          <Redirect to='/login' />
        ) : (
          <Component {...props} />
        )}/>
      )}
    </div>
  )
}

PrivateRoute.propTypes = {
  isAuthenticated: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
  loadUser: PropTypes.func.isRequired,
  setSocket: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  loading: state.auth.authLoading,
  user: state.auth.user,
});

export default connect(mapStateToProps, { loadUser, setSocket, logout })(PrivateRoute);