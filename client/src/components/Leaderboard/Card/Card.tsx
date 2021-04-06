import React, { useEffect, useState } from 'react'
import styles from './Card.module.scss'
import { Game } from '../../../core/kgs/types'
import { Place } from '../../../core/kgs/types.d'
import classNames from 'classnames'
import Loader from '../../Loader/Loader'
import InfoPad from '../../../core/ui/InfoPad/InfoPad'
import { useHistory } from 'react-router-dom'

interface ICardProps {
  player: Place
  fetch: (name: string) => Promise<Game[]>
}

const Card: React.FC<ICardProps> = (props: ICardProps) => {
  const [games, setGames] = useState<Game[]>()
  const [isExpanded, setExpanded] = useState(false)
  const history = useHistory()
  const { name, rank, place } = props.player

  useEffect(() => {
    if (games) props.fetch(name).then(setGames)
  }, [name])

  const handleClick = () => {
    if (!games) props.fetch(name).then(setGames)
    setExpanded(!isExpanded)
  }

  const openGame = (date: string) => {
    history.push('/game/' + encodeURI(date))
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
        <div>{place}</div>
        <div className={styles.name}>{name}</div>
        <div>{rank}</div>
      </div>
      <div className={classNames(styles.body, isExpanded && styles.opened)}>
        {games ? (
          games.map((v) => (
            <InfoPad
              key={v.timestamp}
              onClick={(date) => openGame(date)}
              model={v}
              player={name}
              className={styles.pad}
            />
          ))
        ) : isExpanded ? (
          <Loader centered label timeout={20} className={styles.body_loader} />
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}

export default Card
