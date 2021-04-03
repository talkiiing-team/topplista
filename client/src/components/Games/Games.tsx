import React, { useEffect, useState } from 'react'
import styles from './Games.module.scss'
import { useRouteMatch, useParams } from 'react-router-dom'
import KGSClient from '../../core/kgs/client'
import { Game } from '../../core/kgs/kgsClient'

const Games = ({ client }: { client?: KGSClient }) => {
  const urlMatch = useRouteMatch()
  const { playerName } = useParams() as { playerName: string }

  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    if (client) {
      console.log('fetching info for ', playerName)
      client.getGames(decodeURI(playerName), true).then(setGames)
    }
  }, [playerName, client])

  return (
    <div className='App'>
      {games.map((v) => (
        <div key={v.timestamp}>{v.timestamp}</div>
      ))}
    </div>
  )
}

export default Games
