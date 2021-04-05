import React, { useEffect, useState } from 'react'
import styles from './Game.module.scss'
import { useParams } from 'react-router-dom'
import KGSClient from '../../core/kgs/client'
import { GameDetailed, Move } from '../../core/kgs/types'
import GameGrid from './GameGrid/GameGrid'
import Controller, { ControlEvents } from './Controller/Controller'
import GoGame from '../../core/game/GoGame'

interface IControllerProps {
  client?: KGSClient
}

const Game: React.FC<IControllerProps> = ({ client }: IControllerProps) => {
  const [game, setGame] = useState<GoGame>()
  const [previousMoveId, setPreviousMoveId] = useState<number>(-1)
  const [currentMoveId, setCurrentMoveId] = useState<number>(0)
  const [moves, setMoves] = useState<Move[]>([])
  const [details, setDetails] = useState<GameDetailed>()

  const { gameId } = useParams() as { gameId: string }

  useEffect(() => {
    if (client) {
      client.getGame(decodeURI(gameId)).then(setDetails)
    }
  }, [gameId, client])

  useEffect(() => {
    if (details) {
      setGame(new GoGame(details.size))
      setMoves(details.moves || [])
    }
  }, [details])

  useEffect(() => {
    if (currentMoveId > previousMoveId) {
      for (let i = previousMoveId + 1; i < currentMoveId; i++) {
        const { location, player } = moves[i]
        if (
          moves[previousMoveId]?.player !== player &&
          previousMoveId !== currentMoveId
        ) {
          game?.applyMove(location)
        } else {
          // skip
          game?.applyMove()
        }
      }
    } else {
      if (details) {
        setGame(new GoGame(details.size))
        for (let i = 0; i < currentMoveId; i++) {
          const { location, player } = moves[i]
          if (
            moves[previousMoveId]?.player !== player &&
            previousMoveId !== currentMoveId
          ) {
            game?.applyMove(location)
          } else {
            // skip
            game?.applyMove()
          }
        }
      }
    }
    setPreviousMoveId(currentMoveId)
  }, [currentMoveId])

  const handleControl = (type: ControlEvents) => {
    switch (type) {
    case ControlEvents.FIRST_STEP:
      setCurrentMoveId(0)
      break
    case ControlEvents.LAST_STEP:
      setCurrentMoveId(moves.length)
      break
    case ControlEvents.NEXT_STEP:
      setCurrentMoveId(currentMoveId + 1)
      break
    case ControlEvents.PREV_STEP:
      setCurrentMoveId(currentMoveId - 1)
      break
    default:
      break
    }
  }

  const handleClick = (x: number, y: number) => {
    game?.applyMove({ x, y })
  }

  return (
    <div className={styles.container}>
      {game && <GameGrid board={game.board} onClick={handleClick} />}
      <div className={styles.sideMenu}>
        <Controller onControl={(type: ControlEvents) => handleControl(type)} />
      </div>
    </div>
  )
}

export default Game
