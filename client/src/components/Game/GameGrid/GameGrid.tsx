import React, { useEffect, useState } from 'react'
import styles from './GameGrid.module.scss'
import { Board } from '../../../core/game/types.d'
import classNames from 'classnames'

interface IGridProps {
  board: Board
  onClick: (x: number, y: number) => void
}

const GameGrid: React.FC<IGridProps> = ({ board, onClick }: IGridProps) => {
  const [size, setSize] = useState(board.length)

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
                  styles[cell || 'empty'],
                )}
                onClick={() => onClick(colindex, rowindex)}
              >
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default GameGrid
