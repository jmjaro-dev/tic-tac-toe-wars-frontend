import './App.scss';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
// Components
import Main from './components/main/Main';
import Board from './components/board/Board';

function App() {

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path ='/' component={Main} />
          <Route exact path ='/game/:id' component={Board} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
