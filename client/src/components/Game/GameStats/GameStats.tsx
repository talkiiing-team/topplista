import React, { useEffect, useState } from 'react'
import styles from './GameStats.module.scss'
import { PlayerInfo } from '../../../core/kgs/types'
import classNames from 'classnames'
import { DateTime } from 'luxon'

export enum Players {
  WHITE = 'white',
  BLACK = 'black',
}

export interface Point {
  x: number
  y: number
}

export interface ITimeSetup {
  rule: string
}

export interface ITimeState {
  left: number
  mode: string
}

export interface IGameState {
  turn?: Players
  point?: Point
  timeWhite?: ITimeState
  timeBlack?: ITimeState
}

export interface IGameSetup {
  time?: ITimeSetup
  players?: {
    white: PlayerInfo
    black: PlayerInfo
  }
  timestamp?: string
}

interface IGameStatsProps {
  state: IGameState
  params: IGameSetup
}

const GameStats: React.FC<IGameStatsProps> = ({
  state,
  params,
}: IGameStatsProps) => {
  const [timeString, setTimeString] = useState<string>('')

  useEffect(() => {
    if (params.timestamp) {
      setTimeString(DateTime.fromISO(params.timestamp).toFormat('dd.MM.yyyy hh:mm'))
    }
  }, [params.timestamp])

  return (
    <div className={styles.container}>
      {timeString ? <div className={styles.time}>{timeString}</div> : <></>}
      <div className={styles.general}>
        {params.players ? (
          <>
            <div className={classNames(styles.info, styles.white)}>
              <span>{params.players.white.name}</span>{' '}
              {params.players.white.rank}
              <div className={classNames(styles.w, styles.turn, styles.mini)} />
            </div>
            <div
              className={classNames(
                state.turn === Players.BLACK ? styles.b : styles.w,
                styles.turn
              )}
            />
            <div className={classNames(styles.info, styles.black)}>
              <span>{params.players.black.name}</span>{' '}
              {params.players.black.rank}
              <div className={classNames(styles.b, styles.turn, styles.mini)} />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default GameStats
