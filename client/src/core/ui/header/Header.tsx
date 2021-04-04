import React, { useEffect, useState } from 'react'
import styles from './Header.module.scss'
import classNames from 'classnames'
import { useHistory } from 'react-router-dom'

const Header = () => {
  const history = useHistory()
  const [showBack, setShowBack] = useState(false)

  useEffect(() => {
    console.log(history.location.pathname.split('/')[1])
    setShowBack(history.location.pathname.split('/')[1] !== 'board')
  }, [history.location.pathname])

  return (
    <div className={classNames(styles.header)}>
      <div className={styles.title}>Ko-Watcher</div>
      {showBack && (
        <div className={styles.backlink} onClick={() => history.goBack()}>
          Fuck, NO! Go back!
        </div>
      )}
    </div>
  )
}

export default Header
