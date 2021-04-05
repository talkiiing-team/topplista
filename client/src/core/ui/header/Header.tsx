import React, { useEffect, useState } from 'react'
import styles from './Header.module.scss'
import classNames from 'classnames'
import { useHistory } from 'react-router-dom'

const Header: React.FC = () => {
  const history = useHistory()
  const [showBack, setShowBack] = useState(false)

  useEffect(() => {
    console.log(history.location.pathname.split('/')[1])
    setShowBack(history.location.pathname.split('/')[1] !== 'board')
  }, [history.location.pathname])

  return (
    <div className={classNames(styles.header)}>
      <div
        className={classNames(styles.backlink, showBack && styles.active)}
        onClick={() => history.push('/board')}
      >
        <i className={'la la-arrow-left'} />
      </div>
      <div className={styles.title}>Ko-Watcher</div>
    </div>
  )
}

export default Header
