import React, { useEffect, useMemo, useState } from 'react'
import styles from './Leaderboard.module.scss'
import classNames from 'classnames'
import { useHistory } from 'react-router-dom'
import KGSClient, { IPlace } from '../../core/kgs/client'

const columns = ['Place', 'Player Name', 'Rank']

const Leaderboard = ({ client }: { client: KGSClient }) => {
  const [topList, setTopList] = useState<IPlace[]>([])

  const history = useHistory()

  useEffect(() => {
    client.getLeaderboard().then(setTopList)
    console.log('1')
  }, [])

  const seeGames = (name: string) => {
    history.push(`/games/${encodeURI(name)}`)
  }

  return (
    <div className='App'>
      {topList.length ? (
        <>
          <div className={classNames(styles.flexRow, styles.heading)}>
            {columns.map((v) => (
              <div key={v}>{v}</div>
            ))}
          </div>
          <div>
            {topList.map((v, i) => (
              <div
                key={i}
                className={styles.flexRow}
                onClick={() => seeGames(v.name)}
              >
                {Object.entries(v).map(
                  ([key, value]) =>
                    key !== 'games' && <div key={value}>{value}</div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>ХУле тебе нада, уёба</div>
      )}
    </div>
  )
}

export default Leaderboard
