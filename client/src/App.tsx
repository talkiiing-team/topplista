import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
    Redirect
} from "react-router-dom";
import Leaderboard from "./components/Leaderboard/Leaderboard";

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/board">Leaderboard</Link>
              </li>
              <li>
                <Link to="/game">Game</Link>
              </li>
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/board">
              <Leaderboard />
            </Route>
            <Route path="/game">
              <Leaderboard />
            </Route>
            <Route path="/">
              <Redirect to={'/board'} />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
