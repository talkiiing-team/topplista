import React, { useEffect, useState } from 'react'
import styles from './GameGrid.module.scss'
import { GameDetailed } from '../../../core/kgs/kgsClient'
import { Board, CellStates } from '../Game'
import classNames from 'classnames'

export interface IGridDetails {
  board: Board
  copy: Board
  onClick: (x: number, y: number) => void
}

function GameGrid({ board, copy, onClick }: IGridDetails) {
  const [loading, setLoading] = useState(true)

  const [size, setSize] = useState(board.length)

  useEffect(() => {
    setLoading(true)
  }, [])

  useEffect(() => {
    setSize(board.length)
  }, [board.length])

  useEffect(() => {
    console.log(board)
  }, [board])

  if (!board) {
    return <div>- Дорогая, что случилось? - Я не знаю...........</div>
  }

  return (
    <div className={classNames(styles.game_container, styles[`s${size}`])}>
      <div className={classNames(styles.grid)}>
        {board.map((row, rowindex) => (
          <div key={rowindex} className={styles.row}>
            {row.map((cell, colindex) => (
              <div
                key={colindex}
                className={classNames(
                  styles.cell,
                  styles[cell.state],
                  copy[rowindex][colindex].state === CellStates.SELECT &&
                    styles.select
                )}
                onClick={() => onClick(colindex, rowindex)}
              >
                {/*rowindex * size + colindex + 1*/}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameGrid
