// src/components/ChordBlock.jsx

import React from 'react';
import ChordCard from './ChordCard';

const ChordBlock = ({ sequence }) => {
  if (!sequence || sequence.length === 0) {
    return null;
  }

  return (
    <div className="output-display">
      <h2 className="text-2xl font-bold mb-4 text-center">Ваша последовательность:</h2>
      
      <div className="grid grid-cols-4 gap-4 justify-items-center">
        {sequence.map((chord, index) => (
          <div key={index} className="chord-box text-center">
            {chord}
          </div>
        ))}
      </div>

      {sequence.length > 0 && (
    <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4 text-center">Схемы аппликатур:</h3>
        
        {/* НОВОЕ: Добавляем обертку с классом flex */}
        <div className="flex flex-wrap justify-center gap-4" class="grid-cols-4">
            {sequence.map((chord, index) => (
                <ChordCard key={index} chordName={chord} />
            ))}
        </div>
    </div>
)}
    </div>
  );
};

export default ChordBlock;