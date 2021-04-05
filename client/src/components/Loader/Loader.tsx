import React, { useEffect, useState } from 'react'
import styles from './Loader.module.scss'
import classNames from 'classnames'

const statuses = [
  'Ищем...',
  'Ищем глубже...',
  'Не уверены, но...',
  'Кажется, ничего не найдено!',
]

interface ILoaderProps {
  centered?: boolean
  label?: boolean
  timeout?: number
  className?: string
}

const Loader: React.FC<ILoaderProps> = (props: ILoaderProps) => {
  const [time, setTime] = useState(Math.min(props.timeout || -1, 25))
  const [label, setLabel] = useState<number>(0)

  useEffect(() => {
    if (!time || time < 0) setLabel(0)
    if (time > 0) {
      setTimeout(() => setTime((v) => (v -= 1)), 1000)
    }
  }, [])

  useEffect(() => {
    if (props.timeout && props.timeout - time >= 10) setLabel(1)
    if (props.timeout && props.timeout - time >= 15) setLabel(2)
    if (props.timeout && props.timeout - time > 20) setLabel(3)
    time > 0 && setTimeout(() => setTime((v) => (v -= 1)), 1000)
  }, [time])

  return (
    <div
      className={classNames(props.centered && styles.centered, props.className)}
    >
      {label < 3 ? (
        <div className={classNames(styles.loader_ripple)}>
          <div></div>
          <div></div>
        </div>
      ) : (
        <></>
      )}
      {props.label ? (
        <p className={styles.labelled}>{statuses[label]}</p>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Loader
