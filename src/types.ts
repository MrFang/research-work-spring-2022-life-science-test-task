export type Coord = [number, number];

/**
 * Статус ячейки
 * "Mined" -- Ячейка закрыта В ячейке мина
 * "Closed" -- Ячейка закрыта и свободна
 * Число -- Ячейка открыта. Число мин в соседних ячейках
 */
export interface Cell {
  status: 'Mined' | 'Closed' | number,
  marker: boolean,
};
