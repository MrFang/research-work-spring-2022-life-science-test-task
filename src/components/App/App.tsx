import React from 'react';
import {Field} from '../Field';

export const App: React.FC = () => {
  return (
    <Field
      minesCount={10}
      onWin={() => {
        console.log('Win');
      }}
      onLose={() => {
        console.log('Lose');
      }}
    />
  );
};
