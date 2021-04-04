import React, { useEffect, useState } from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from 'react-router-dom'
import styles from './App.module.scss'
import Leaderboard from './components/Leaderboard/Leaderboard'
import KGSClient from './core/kgs/client'
import Games from './components/Games/Games'
import Game from './components/Game/Game'
import Header from './core/ui/header/Header'

function App() {
  const [client, setClient] = useState<KGSClient>(new KGSClient())

  return (
    <div className={styles.app}>
      <Router>
        <div className={styles.globalContainer}>
          <Header />

          <Switch>
            <Route path='/board'>
              <Leaderboard client={client} />
            </Route>
            <Route path='/games/:playerName'>
              <Games client={client} />
            </Route>
            <Route path='/game/:gameId'>
              <Game />
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
