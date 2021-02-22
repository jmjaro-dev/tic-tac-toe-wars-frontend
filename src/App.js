import './App.scss';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Navbar from './components/layout/Navbar';
import PrivateRoute from './components/routing/PrivateRoute';
import Main from './components/main/Main';
import Board from './components/board/Board';
import Leaderboard from './components/leaderboard/Leaderboard';
// Utils
import setAuthToken from './utils/setAuthToken';
// Redux
import { Provider } from 'react-redux';
import store from './store';

if(localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {

  return (  
    <Provider store={store}>
      <div className="App">
        <Router>
          <Navbar />
          <Switch>
            <PrivateRoute exact path='/' component={Main} />
            <PrivateRoute exact path='/game/:roomId' component={Board} />
            <PrivateRoute exact path='/leaderboard' component={Leaderboard} />
            <Route exact path ='/login' component={Login} />
            <Route exact path ='/register' component={Register} />
          </Switch>
        </Router>
      </div>
    </Provider>
  );
}

export default App;
