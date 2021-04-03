import React, { useEffect, useState } from 'react'
import styles from './Card.module.scss'
import { Game } from '../../../core/kgs/kgsClient'
import { IPlace } from '../../../core/kgs/client'
import classNames from 'classnames'
import Loader from '../../Loader/Loader'

export interface ICardProps {
  player: IPlace
  fetch: (name: string) => Promise<Game[]>
}

const Card = (props: ICardProps) => {
  const [games, setGames] = useState<Game[]>()
  const [isExpanded, setExpanded] = useState(false)

  useEffect(() => {
    if (games) props.fetch(props.player.name).then(setGames)
  }, [props.player.name])

  //props.player.name === 'larc' && console.log('rendered')

  const handleClick = () => {
    if (!games) props.fetch(props.player.name).then(setGames)
    setExpanded((v) => !v)
  }

  return (
    <div
      className={classNames(
        styles.card_root,
        isExpanded && styles.card_expanded
      )}
      key={props.player.name}
    >
      <div className={styles.head} onClick={() => handleClick()}>
        <div>
          {props.player.place} {isExpanded ? 'O' : 'C'}
        </div>
        <div className={styles.name}>{props.player.name}</div>
        <div>{props.player.rank}</div>
      </div>
      <div className={classNames(styles.body, isExpanded && styles.opened)}>
        {games ? games.map((v) => JSON.stringify(v)) : <Loader centered />}
      </div>
    </div>
  )
}

export default Card
