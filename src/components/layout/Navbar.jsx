import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../../actions/authActions';
import { resetScoresState } from '../../actions/scoreActions';
import PropTypes from 'prop-types';

const Navbar = ({ title, isAuthenticated, user, logout, resetScoresState}) => {

  const onLogout = () => {
    // Reset all State and Logout
    resetScoresState();
    logout(user._id);
  }

  const authLinks = (
    <>
      <li>
        <Link to="/" >
          Play
        </Link>
      </li>
      <li>
        <Link to="/leaderboard" >
          Leaderboard
        </Link>
      </li>
      <li>
        <Link to="/" onClick={onLogout}>
          Logout
        </Link>
      </li>
    </>
  )

  return (
    <>
      <nav className="navbar">
        <div className="nav-wrapper">
          <Link to="/">
            {title}
          </Link>
          <ul>
            <li className="username">
              {user && isAuthenticated && `Hi! ${user.username}`}
            </li>
            {user && isAuthenticated && authLinks}
          </ul>
        </div>
      </nav>
    </>
  )
}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
  logout: PropTypes.func.isRequired,
  resetScoresState: PropTypes.func.isRequired,
}

Navbar.defaultProps = {
  title: 'Tic-Tac-Toe Wars'
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user
});

export default connect(mapStateToProps, { logout, resetScoresState })(Navbar);
