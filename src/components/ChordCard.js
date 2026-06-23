// src/components/ChordCard.jsx

import React from 'react';
import { chordDiagrams } from '../data/vocabulary';

const ChordCard = ({ chordName }) => {
  const diagram = chordDiagrams[chordName];

  if (!diagram) {
    return null;
  }

  return (
    <div className="chord-diagram-wrapper">
      <h4 className="text-lg font-semibold text-center mb-2">{chordName}</h4>
      <div className="diagram-grid-wrapper">
        <table className="chord-diagram-table">
          <tbody>
            {diagram.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {/* --- ИСПРАВЛЕННАЯ ЛОГИКА --- */}
                {/* Регулярное выражение теперь ищет:
                    1. Группы цифр: \d+
                    2. Символ 'x'
                    3. Символ 'o'
                    4. Дефис '-'
                */
                /* Порядок важен: сначала ищем группы цифр, потом отдельные символы */
                }
                {row.match(/\d+|x|o|-/g).map((token, charIndex) => (
                  <td key={charIndex} className="diagram-grid-cell" data-char={token}>
                    {/* Если token - это число, оборачиваем его в span */}
                    {/* В противном случае (это 'x', 'o' или '-') выводим как есть */}
                    {isNaN(token) ? token : <span>{token}</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChordCard;