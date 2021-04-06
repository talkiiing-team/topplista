export enum Players {
  WHITE = 'white',
  BLACK = 'black',
}

export type CellType = Players | undefined

export type Board = CellType[][]

// point is a client interface
export interface Point {
  x: number
  y: number
}

// cell is an inner interface
export interface Cell {
  i: number
  j: number
}

export interface CellGroup {
  cells: Cell[]
  player: Players
}
