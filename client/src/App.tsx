import React, { useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import styles from './App.module.scss'
import Leaderboard from './components/Leaderboard/Leaderboard'
import KGSClient from './core/kgs/client'
import Game from './components/Game/Game'
import Header from './core/ui/header/Header'

const App: React.FC = () => {
  const [client] = useState<KGSClient>(new KGSClient())

  return (
    <div className={styles.app}>
      <Router>
        <div className={styles.globalContainer}>
          <Header />

          <Switch>
            <Route path='/board'>
              <Leaderboard client={client} />
            </Route>
            <Route path='/game/:gameId'>
              <Game client={client} />
            </Route>
            <Route path='/'>
              <Redirect to={'/board'} />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  )
}

export default App
