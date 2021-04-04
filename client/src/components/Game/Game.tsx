import React, { useEffect, useState } from 'react'
import styles from './Game.module.scss'
import { useParams, useRouteMatch } from 'react-router-dom'
import KGSClient from '../../core/kgs/client'
import { GameDetailed, Move } from '../../core/kgs/kgsClient'
import GameGrid from './GameGrid/GameGrid'
import Controller, { ControlEvents } from './Controller/Controller'

export type Board = ICell[][]

export interface ICell {
  state: CellStates
}

export interface IBounds {
  top: boolean
  right: boolean
  bottom: boolean
  left: boolean
}

export enum CellStates {
  EMPTY = 'empty',
  WHITE = 'white',
  BLACK = 'black',
  SELECT = 'select',
}

export enum DirState {
  BLOCK = 'block',
  FREE = 'free',
  ME = 'me',
}

export const arrayCopy = (cur: any[][]) => cur.map((a) => [...a])

function Game({ client }: { client?: KGSClient }) {
  const [loading, setLoading] = useState(true)
  const urlMatch = useRouteMatch()
  const { gameId } = useParams() as { gameId: string }

  const [details, setDetails] = useState<GameDetailed | undefined>()
  const [moves, setMoves] = useState<Move[]>([])
  const [board, setBoard] = useState<Board>([])
  const [boardCopy, setBoardCopy] = useState<Board>([])
  const [currentStep, setStep] = useState<number>(0)

  useEffect(() => {
    setLoading(true)
    if (client) {
      console.log('fetching info for game ', gameId)
      client.getGame(decodeURI(gameId)).then(setDetails)
    }
  }, [gameId, client])

  useEffect(() => {
    if (details) {
      initializeBoard()
      setLoading(false)
      console.log('moves', details.moves)
      setMoves(details.moves)
    }
  }, [details])

  const initializeBoard = () => {
    if (details) {
      const arr = Array.from({ length: details.size }, () =>
        Array.from({ length: details.size }, () => ({
          state: CellStates.EMPTY,
        }))
      )
      setBoardCopy(arrayCopy(arr))
      setBoard(arrayCopy(arr))
    }
  }

  const applyStep = (s: number) => {
    const { player, location, nodeId } = moves[s]
    const b: Board = board
    b[location.y][location.x] = { state: player } as ICell
    //console.log(player, `[${location.x}; ${location.y}]`)
    setBoard(b)
  }

  const colorPoint = (player: CellStates, x: number, y: number) => {
    const b: Board = arrayCopy(boardCopy)
    b[y][x] = { state: player } as ICell
    //console.log(player, `[${y}; ${x}]`)
    setBoardCopy(arrayCopy(b))
  }

  const goToStep = (step: number) => {
    initializeBoard()
    if (step >= currentStep) {
      for (let s = currentStep; s < step; s += 1) {
        console.log('step')
        applyStep(s)
      }
    } else {
      for (let s = 0; s < step; s += 1) {
        applyStep(s)
      }
    }
    setStep(step)
  }

  const getBoundsOf = (x: number, y: number) => {
    const bounds = { top: true, right: true, bottom: true, left: true }

    if (
      x === 0 ||
      (board[y][x - 1].state !== CellStates.EMPTY &&
        board[y][x - 1].state !== board[y][x].state) ||
      boardCopy[y][x - 1].state === CellStates.SELECT
    )
      bounds.left = false
    if (
      x === board.length - 1 ||
      (board[y][x + 1].state !== CellStates.EMPTY &&
        board[y][x + 1].state !== board[y][x].state) ||
      boardCopy[y][x + 1].state === CellStates.SELECT
    )
      bounds.right = false
    if (
      y === 0 ||
      (board[y - 1][x].state !== CellStates.EMPTY &&
        board[y - 1][x].state !== board[y][x].state) ||
      boardCopy[y - 1][x].state === CellStates.SELECT
    )
      bounds.top = false
    if (
      y === board.length - 1 ||
      (board[y + 1][x].state !== CellStates.EMPTY &&
        board[y + 1][x].state !== board[y][x].state) ||
      boardCopy[y + 1][x].state === CellStates.SELECT
    )
      bounds.bottom = false

    console.log(x, y, bounds)
    return bounds
  }

  const boundsToArray = (bounds: IBounds) => {
    const res = []
    bounds.left && res.push([-1, 0])
    bounds.right && res.push([1, 0])
    bounds.top && res.push([0, -1])
    bounds.bottom && res.push([0, 1])
    return res
  }

  const selectPoint = (x: number, y: number) => {
    getBoundsOf(x, y)
    colorPoint(CellStates.SELECT, x, y)
    /*boundsToArray(
      (() => {
        const r = getBoundsOf(x, y)
        colorPoint(CellStates.SELECT, x, y)
        return r
      })()
    ).forEach(([dx, dy]) => {
      selectPoint(x + dx, y + dy)
    })*/
  }

  const selectPointWrapper = (x: number, y: number) => {
    selectPoint(x, y)
  }

  const handleControl = (type: ControlEvents) => {
    //console.log('Action: ', type, 'on step ', currentStep)
    switch (type) {
      case ControlEvents.FIRST_STEP:
        goToStep(0)
        break
      case ControlEvents.LAST_STEP:
        goToStep(moves.length)
        break
      case ControlEvents.NEXT_STEP:
        goToStep(currentStep + 1)
        break
      case ControlEvents.PREV_STEP:
        goToStep(currentStep - 1)
        break
      default:
        break
    }
  }

  return (
    <div className={styles.container}>
      <GameGrid board={board} copy={boardCopy} onClick={selectPointWrapper} />
      <div className={styles.sideMenu}>
        <Controller onControl={(type: ControlEvents) => handleControl(type)} />
      </div>
    </div>
  )
}

export default Game
