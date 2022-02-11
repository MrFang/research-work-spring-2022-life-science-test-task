import React from 'react';
import styles from './Field.module.css';
import {Props} from './types';
import {RANGE_10} from '../../consts';

export const Field: React.FC<Props> = ({
  field,
  onCellClick,
  onCellContextMenu,
  gameWon,
}) => {
  const renderCell = (x: number, y: number) => {
    switch (field[x][y].status) {
      case 'Closed':
        return (
          <button
            key={y}
            onClick={onCellClick(x, y)}
            onContextMenu={onCellContextMenu(x, y)}
            className={
              `${styles.cell} ` +
              `${styles.closed} ` +
              `${field[x][y].marker ? styles.marked : ''}`
            }
          >{field[x][y].marker ? 'M' : ''}</button>
        );
      case 'Mined':
        return (
          <button
            key={y}
            onClick={onCellClick(x, y)}
            onContextMenu={onCellContextMenu(x, y)}
            className={
              `${styles.cell} ` +
              `${styles.closed} ` +
              `${field[x][y].marker ? styles.marked : ''} ` +
              `${gameWon !== null ? styles.mined : ''}`
            }
          >{field[x][y].marker ? 'M' : ''}</button>
        );
      case 0:
        return (
          <button
            key={y}
            className={`${styles.cell} ${styles.open}`}
          ></button>
        );
      default:
        return (
          <button
            key={y}
            className={`${styles.cell} ${styles.open}`}
          >
            {field[x][y].status}
          </button>
        );
    }
  };

  return (
    <>
      {RANGE_10.map((x) => (
        <div key={x} className={styles.row}>
          {RANGE_10.map((y) => renderCell(x, y))}
        </div>
      ))}
    </>
  );
};
