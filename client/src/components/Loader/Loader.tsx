import React from 'react'
import styles from './Loader.module.scss'
import classNames from 'classnames'

interface IProps {
  centered?: boolean
  label?: boolean
}

const Loader = (props: IProps) => {
  return (
    <div className={classNames(props.centered && styles.centered)}>
      <div className={styles.loader_ripple}>
        <div></div>
        <div></div>
      </div>
      {props.label ? <p className={styles.labelled}>Загружаемся...</p> : <></>}
    </div>
  )
}

export default Loader
