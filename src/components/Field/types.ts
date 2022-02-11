import React from 'react';
import {Cell} from '../../types';

export interface Props {
  field: Cell[][],
  onCellClick: (x: number, y: number) => (e: React.MouseEvent) => void,
  onCellContextMenu: (x: number, y: number) => (e: React.MouseEvent) => void,
  // Передаётся сюда для  правильной стилизации
  gameWon: boolean | null,
};
