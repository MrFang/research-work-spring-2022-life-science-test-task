import React, {useEffect, useState} from 'react';
import {cloneDeep, uniqWith} from 'lodash';
import {RANGE_10} from 'consts';
import {Cell, Coord} from 'types';
import {Field} from 'components/Field';
import styles from './App.module.css';

const getMinesCoordinates = (count: number): Coord[] => {
  let coords: Coord[] = [];

  while (coords.length < count) {
    coords.push([
      Math.floor(Math.random() * 10),
      Math.floor(Math.random() * 10),
    ]);

    // Make coords uniq
    coords = uniqWith(coords, (a, b) => a[0] === b[0] && a[1] === b[1]);
  }

  return coords;
};

const createField = () => {
  const field: Cell[][] = RANGE_10.map(() =>
    RANGE_10.map(() =>
      ({status: 'Closed', marker: false}),
    ),
  );
  getMinesCoordinates(MINES_COUNT).forEach(([x, y]) => {
    field[x][y].status = 'Mined';
  });

  return field;
};

const getNeighbors = (x: number, y: number): Coord[] => {
  return ([
    [x - 1, y - 1],
    [x - 1, y],
    [x - 1, y + 1],
    [x, y - 1],
    [x, y + 1],
    [x + 1, y - 1],
    [x + 1, y],
    [x + 1, y + 1],
  ] as Coord[]).filter(([a, b]) => a >= 0 && a < 10 && b >= 0 && b < 10);
};

const MINES_COUNT = 10;

export const App: React.FC = () => {
  const [gameWon, setGameWon] = useState<boolean | null>(null);
  const [field, setField] = useState(createField());

  useEffect(() => {
    // Не осталось закрытых свободных ячеек
    if (!field.flat().some(({status}) => status === 'Closed')) {
      setGameWon(true);
    }
  }, [field]);


  const isMined = (x: number, y:number) => field[x][y].status === 'Mined';

  const revealFrom = (x: number, y: number) => {
    if (gameWon == null) {
      // Обходим поле поиском в ширину и обновляем состояние
      const queue: Coord[] = [[x, y]];
      const newField = cloneDeep(field);

      while (queue.length > 0) {
        const [a, b] = queue.pop()!;
        const neighbors = getNeighbors(a, b);
        const minedNeighbors = neighbors.filter(([x, y]) => isMined(x, y));
        newField[a][b] = {
          status: minedNeighbors.length,
          marker: false,
        };

        if (minedNeighbors.length === 0) {
          // Используем unshift, чтобы доставать через pop
          queue.unshift(...(neighbors.filter(([x, y]) =>
            newField[x][y].status === 'Closed')
          ));
        }
      }

      setField(newField);
    }
  };

  const toggleMarked = (x: number, y: number) => {
    if (gameWon == null) {
      const newField = cloneDeep(field);

      if (typeof field[x][y].status === 'string') { // Ячейка закрыта
        newField[x][y].marker = !field[x][y].marker;
      }

      setField(newField);
    }
  };

  return (
    <>
      <Field
        field={field}
        gameWon={gameWon}
        onCellClick={(x, y) => (e) => {
          if (isMined(x, y)) {
            setGameWon(false);
          } else {
            revealFrom(x, y);
          }
        }}
        onCellContextMenu={(x, y) => (e) => {
          e.preventDefault();
          toggleMarked(x, y);
        }}
      />
      {
        gameWon !== null ?
        (<h1>{gameWon ? 'You won!' : 'Game over'}</h1>) :
        false
      }
      <div><button
        className={styles.resetButton}
        onClick={() => {
          setGameWon(null);
          setField(createField());
        }}>Reset</button></div>
    </>
  );
};
