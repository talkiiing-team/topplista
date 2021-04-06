import React, { useMemo } from 'react'
import styles from './InfoPad.module.scss'
import classNames from 'classnames'
import { Game } from '../../kgs/types'
import { DateTime } from 'luxon'
import getOpponent from '../../utils/getOpponent'
import getGameResult from '../../utils/getGameResult'

export interface ICardProps {
  onClick: (gameId: string) => void
  model: Game
  player: string
  className?: string
}

const InfoPad: React.FC<ICardProps> = (props: ICardProps) => {
  //const { name, versus, status, date } = props.model
  const { timestamp: date } = props.model
  const dt = DateTime.fromISO(date)
  const opponent = getOpponent(props.model, props.player)
  const gameResult = useMemo(() => {
    switch (getGameResult(props.model)) {
    case -1:
      return 'W'
    case 1:
      return 'B'
    default:
      return '0'
    }
  }, [])

  return (
    <div className={classNames(styles.pad_root, props.className)} key={date}>
      <div className={styles.head} onClick={() => props.onClick(date)}>
        <div className={styles.name}>
          vs <span>{opponent.name || 'no-opponent'}</span>
        </div>
        <div className={styles.status}>{gameResult}</div>
        <div className={styles.date}>{dt.toFormat('MM/dd/yyyy')}</div>
      </div>
    </div>
  )
}

export default InfoPad
