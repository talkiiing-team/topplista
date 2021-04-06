import React, { useEffect, useState } from 'react'
import styles from './Leaderboard.module.scss'
import classNames from 'classnames'
import KGSClient from '../../core/kgs/client'
import { Place } from '../../core/kgs/types.d'
import Card from './Card/Card'
import Loader from '../Loader/Loader'

const columns = ['Место', 'Имя игрока', 'Ранг']

interface ILeaderboardProps {
  client: KGSClient
}

const Leaderboard: React.FC<ILeaderboardProps> = ({
  client,
}: ILeaderboardProps) => {
  const [topList, setTopList] = useState<Place[]>()

  useEffect(() => {
    client.getLeaderboard().then(setTopList)
  }, [])

  const fetchGames = async (name: string) => {
    console.log('fetching info for ', name)
    return await client.getGames(name)
  }

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        {topList ? (
          <>
            <div className={classNames(styles.flexRow, styles.heading)}>
              {columns.map((v) => (
                <div key={v}>{v}</div>
              ))}
            </div>
            <div>
              {topList.slice(0, 100).map((v, i) => (
                <Card key={i} player={v} fetch={fetchGames} />
              ))}
            </div>
          </>
        ) : (
          <Loader centered label />
        )}
      </div>
      {topList ? (
        <div className={styles.rightSide}>
          <div className={styles.hint}>
            <i className={classNames('la la-arrow-left', styles.arrow)} />
            <p className={styles.large}>Выбери игрока</p>
            <p className={styles.little}>и открой игру</p>
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Leaderboard
