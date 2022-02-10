/**
 * Статус ячейки
 * "Mined" -- В ячеке мина
 * "Closed" -- Ячейка закрыта
 * Число -- Число мин в соседних ячейках
 */
export type CellStatus = "Mined" | "Closed" | "Marked" | number

export type Coord = [number, number]

export interface Props {
  minesCount: number
}
