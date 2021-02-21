import './App.scss';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import io from 'socket.io-client';
// Components
import Main from './components/main/Main';
import Board from './components/board/Board';

const App = () => {
  const serverUrl = 'http://localhost:5000/';
  const [socket, setSocket] = useState("");

  useEffect(() => {
    setSocket(io(serverUrl));
  }, [])

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path='/'>
            <Main socket={socket} />
          </Route>
          <Route path='/game'>
            <Board socket={socket} />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
