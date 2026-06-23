// src/components/OutputDisplay.js

import React from 'react';
import ChordBlock from './ChordBlock'; // Импортируем наш новый компонент

const OutputDisplay = ({ sequence }) => {
  return (
    <div>
      <ChordBlock sequence={sequence} />
    </div>
  );
};

export default OutputDisplay;