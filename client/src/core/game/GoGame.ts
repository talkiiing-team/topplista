import { Board, Cell, CellGroup, CellType, Players, Point } from './types.d'

const pointToCell = ({ x, y }: Point): Cell => ({ i: y, j: x })

const squareMatrix = <type>(size: number, fillWith: type) =>
  Array.from({ length: size }, () =>
    Array.from({ length: size }, () => fillWith)
  )

const opponent = (player: Players) =>
  player === Players.WHITE ? Players.BLACK : Players.WHITE

export default class GoGame {
  public readonly board: Board

  private currentPlayer: Players

  constructor(public readonly boardSize: number) {
    this.board = squareMatrix<CellType>(boardSize, undefined)
    this.currentPlayer = Players.BLACK
  }

  /**
   * Applies move to the given x and y.
   * If no coordinates passed then it's a pass (skip).
   */
  applyMove(point?: Point): void {
    if (point) {
      const cell = pointToCell(point)
      const { i, j } = cell
      if (this.board[i][j]) {
        throw new Error(
          `Move to (${j}, ${i}) is illegal because the cell is not empty`
        )
      }
      this.board[i][j] = this.currentPlayer

      this.groups(opponent(this.currentPlayer))
        .filter((group) => this.isGroupSurrounded(group))
        .forEach((group) => this.removeGroup(group))
    }
    this.currentPlayer = opponent(this.currentPlayer)
  }

  /**
   * Removes the given group from the board
   * @param cells
   */
  private removeGroup({ cells }: CellGroup): void {
    cells.forEach(({ i, j }) => (this.board[i][j] = undefined))
  }

  /**
   * Returns true if the given group is surrounded by opponent
   */
  private isGroupSurrounded({ cells }: CellGroup): boolean {
    return cells.every((cell) =>
      this.neighborhood(cell).every(({ i, j }) => this.board[i][j])
    )
  }

  /**
   * Find every groups of points of the given player
   */
  private groups(player: Players): CellGroup[] {
    const groups: CellGroup[] = []

    // is needed to not include the same group multiple times
    const checked: boolean[][] = squareMatrix(this.boardSize, false)

    for (let i = 0; i < this.board.length; i++) {
      const row = this.board[i]
      for (let j = 0; j < row.length; j++) {
        const cell = row[j]
        if (!cell || cell !== player || checked[i][j]) {
          continue
        }
        const group = this.group({ i, j })
        group.cells.forEach(({ i: ci, j: cj }) => (checked[ci][cj] = true))
        groups.push(group)
      }
    }
    return groups
  }

  /**
   * Find points in the same group as the given one
   */
  private group(cell: Cell, exclude?: Cell): CellGroup {
    if (!this.board[cell.i][cell.j]) {
      throw new Error('Cannot find group of an empty cell')
    }

    const cells: Cell[] = [cell]
    this.neighborhood(cell)
      .filter(({ i, j }) => {
        if (exclude?.i === i && exclude?.j === j) {
          return false
        }
        return this.board[cell.i][cell.j] === this.board[i][j]
      })
      .forEach((_cell) => cells.push(...this.group(_cell, cell).cells))

    return {
      cells,
      player:
        this.board[cell.i][cell.j] === Players.WHITE
          ? Players.WHITE
          : Players.BLACK,
    }
  }

  /**
   * Return **every** point (including empty ones) of the neighborhood of the given one
   */
  private neighborhood({ i, j }: Cell): Cell[] {
    const result: Cell[] = []
    if (i > 0) {
      result.push({ i: i - 1, j })
    }
    if (i < this.boardSize - 1) {
      result.push({ i: i + 1, j })
    }
    if (j > 0) {
      result.push({ i, j: j - 1 })
    }
    if (j < this.boardSize - 1) {
      result.push({ i, j: j + 1 })
    }
    return result
  }
}
