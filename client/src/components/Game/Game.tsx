import React, { useEffect, useState } from 'react'
import styles from './Game.module.scss'
import { useParams, useRouteMatch } from 'react-router-dom'
import KGSClient from '../../core/kgs/client'
import { GameDetailed } from '../../core/kgs/kgsClient'

function Game({ client }: { client?: KGSClient }) {
  const urlMatch = useRouteMatch()
  const { gameId } = useParams() as { gameId: string }

  const [details, setDetails] = useState<GameDetailed>()

  useEffect(() => {
    if (client) {
      console.log('fetching info for game ', gameId)
      client.getGame(decodeURI(gameId)).then(setDetails)
    }
  }, [gameId, client])

  return <div className='App'></div>
}

export default Game
