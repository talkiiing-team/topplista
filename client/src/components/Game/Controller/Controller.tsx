import React from 'react'
import styles from './Controller.module.scss'

export interface IControllerProps {
  onControl: (type: ControlEvents) => void
}

export enum ControlEvents {
  NEXT_STEP = 'next',
  PREV_STEP = 'prev',
  FIRST_STEP = 'first',
  LAST_STEP = 'last',
}

function Controller(props: IControllerProps) {
  const handleControl = (type: ControlEvents) => {
    props.onControl(type)
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.button}
        onClick={() => handleControl(ControlEvents.NEXT_STEP)}
      >
        Next
      </div>
      <div
        className={styles.button}
        onClick={() => handleControl(ControlEvents.PREV_STEP)}
      >
        Prev
      </div>
      <div
        className={styles.button}
        onClick={() => handleControl(ControlEvents.FIRST_STEP)}
      >
        First
      </div>
      <div
        className={styles.button}
        onClick={() => handleControl(ControlEvents.LAST_STEP)}
      >
        Last
      </div>
    </div>
  )
}

export default Controller
