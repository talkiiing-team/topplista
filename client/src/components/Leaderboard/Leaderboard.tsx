import React, { useEffect, useMemo, useState } from 'react'
import styles from './Leaderboard.module.scss'
import classNames from 'classnames'
import { useHistory } from 'react-router-dom'
import KGSClient, { IPlace } from '../../core/kgs/client'
import Card from './Card/Card'
import Loader from '../Loader/Loader'

const columns = ['Место', 'Имя игрока', 'Ранг']

const Leaderboard = ({ client }: { client: KGSClient }) => {
  const [topList, setTopList] = useState<IPlace[]>()

  const history = useHistory()

  useEffect(() => {
    client.getLeaderboard().then(setTopList)
  }, [])

  const seeGames = (name: string) => {
    history.push(`/games/${encodeURI(name)}`)
  }

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
