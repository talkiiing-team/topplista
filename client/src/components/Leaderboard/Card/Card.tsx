import React, { useEffect, useState } from 'react'
import styles from './Card.module.scss'
import { Game } from '../../../core/kgs/kgsClient'
import { IPlace } from '../../../core/kgs/client'
import classNames from 'classnames'
import Loader from '../../Loader/Loader'
import InfoPad from '../../../core/ui/InfoPad/InfoPad'

export interface ICardProps {
  player: IPlace
  fetch: (name: string) => Promise<Game[]>
}

const Card = (props: ICardProps) => {
  const [games, setGames] = useState<Game[]>()
  const [isExpanded, setExpanded] = useState(false)

  const { name, rank, place } = props.player

  useEffect(() => {
    if (games) props.fetch(name).then(setGames)
  }, [name])

  const handleClick = () => {
    if (!games) props.fetch(name).then(setGames)
    setExpanded(!isExpanded)
  }

  return (
    <div
      className={classNames(
        styles.card_root,
        isExpanded && styles.card_expanded
      )}
      key={place}
    >
      <div className={styles.head} onClick={() => handleClick()}>
        <div>
          {place} {isExpanded ? 'O' : 'C'}
        </div>
        <div className={styles.name}>{name}</div>
        <div>{rank}</div>
      </div>
      <div className={classNames(styles.body, isExpanded && styles.opened)}>
        {games ? (
          games.map((v) => (
            <InfoPad
              key={v.timestamp}
              onClick={(date) => console.log(date)}
              model={v}
              player={name}
            />
          ))
        ) : isExpanded ? (
          <Loader centered label={'Ищем...'} />
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default Card
