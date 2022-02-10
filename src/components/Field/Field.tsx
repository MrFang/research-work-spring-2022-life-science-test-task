import React, { useState } from 'react'
import styles from './Field.module.css'
import { uniqWith, cloneDeep } from 'lodash'
import { CellStatus, Coord, Props } from './types'

const RANGE_10 = Array.from(Array(10).keys())

const getMinesCoordinates = (count: number): Coord[]  => {
  let coords: Coord[] = []

  while (coords.length < count) {
    coords.push([
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10)
    ])

    //Make coords uniq
    coords = uniqWith(coords, (a, b) => a[0] === b[0] && a[1] === b[1])
  }
  return coords
}

const getNeighbors = (x: number, y: number): Coord[] => {
  return ([
    [x - 1, y - 1],
    [x - 1, y],
    [x - 1, y + 1],
    [x, y - 1],
    [x, y + 1],
    [x + 1, y - 1],
    [x + 1, y],
    [x + 1, y + 1]
  ] as Coord[]).filter(([a, b]) => a >= 0 && a < 10 && b >= 0 && b < 10)
}

export const Field: React.FC<Props> = ({ minesCount }) => {
  const [field, setField] = useState((() => {
    let field: CellStatus[][] = RANGE_10.map(() => RANGE_10.map(() => "Closed"))
    getMinesCoordinates(minesCount).forEach(([x, y]) => {field[x][y] = "Mined"})
  
    return field
  })())

  const revealFrom = (x: number, y: number) => {
    // Обходим поле поиском в ширину и обновляем состояние
    let queue: Coord[] = [[x, y]]
    let newField = cloneDeep(field)

    while (queue.length > 0) {
      const [a, b] = queue.pop()!
      const neighbors = getNeighbors(a, b)
      const minedNeighbors = neighbors.filter(([x, y]) => isMined(x, y))
      newField[a][b] = minedNeighbors.length

      if (minedNeighbors.length === 0) {
        // Используем unshift, чтобы доставать через pop
        queue.unshift(...(neighbors.filter(([x, y]) => newField[x][y] === "Closed")))
      } 
    }

    setField(newField);
  }

  const isMined = (x: number, y:number) => field[x][y] === "Mined"

  const toggleMarked = (x: number, y: number) => {
    let newField = cloneDeep(field)

    switch (field[x][y]) {
      case "Closed":
        newField[x][y] = "Marked"
        break
      case "Marked":
        newField[x][y] = "Closed"
        break
    }

    setField(newField)
  }

  const renderCell = (x: number, y: number) => {
    switch (field[x][y]) {
      case "Closed":
        return (
          <button
            onClick={() => revealFrom(x, y)}
            onContextMenu={(e) => {
              e.preventDefault();
              toggleMarked(x, y)
            }}
            className={`${styles.cell} ${styles.closed}`}
          ></button>
        )
      case "Mined":
        return (
          <button
            onContextMenu={(e) => {
              e.preventDefault();
              toggleMarked(x, y)
            }}
            className={`${styles.cell} ${styles.closed}`}
          ></button>
        )
      case "Marked":
        return (
          <button
            onClick={() => revealFrom(x, y)}
            onContextMenu={(e) => {
              e.preventDefault();
              toggleMarked(x, y)
            }}
            className={`${styles.cell} ${styles.closed} ${styles.marked}`}
          >
            M
          </button>
        )
      case 0:
        return (
          <button
            className={`${styles.cell} ${styles.open}`}
          ></button>
        )
      default:
        return (
          <button
            className={`${styles.cell} ${styles.open}`}
          >
            {field[x][y]}
          </button>
        )
    }
  }
  
  return (
    <>
      {RANGE_10.map(x => (
        <div key={x} className={styles.row}>
          {RANGE_10.map(y => renderCell(x, y))}
        </div>
      ))}
    </>
  )
}