import React, { useEffect, useState } from 'react'
import styles from './Card.module.scss'
import { Game } from '../../../core/kgs/kgsClient'
import KGSClient, { IPlace } from '../../../core/kgs/client'
import classNames from 'classnames'

export interface ICardProps {
  player: IPlace
  client: KGSClient
}

const Card = (props: ICardProps) => {
  const [games, setGames] = useState<Game[]>([])
  const [isExpanded, setExpanded] = useState(false)

  useEffect(() => {
    if (games.length && props.client) fetch()
  }, [props.player.name, props.client])

  const fetch = () => {
    console.log('fetching info for ', props.player.name)
    props.client.getGames(props.player.name).then(setGames)
  }

  const handleClick = () => {
    if (!games.length && props.client) fetch()
    setExpanded((v) => !v)
  }

  return (
    <div
      className={classNames(
        styles.card_root,
        isExpanded && styles.card_expanded
      )}
    >
      <div className={styles.head} onClick={() => handleClick()}>
        {isExpanded ? 'OPENED' : 'CLOSED'}
        {props.player.place} {props.player.name} {props.player.rank}
      </div>
      <div className={styles.body}>{games.map((v) => JSON.stringify(v))}</div>
    </div>
  )
}

export default Card
