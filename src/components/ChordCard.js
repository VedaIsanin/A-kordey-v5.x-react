// src/components/Chord.jsx

import React from 'react';
import { chordDiagrams } from '../data/vocabulary';

const ChordCard = ({ chordName }) => {
    const diagrams = chordDiagrams[chordName];

    if (!diagrams) {
        return null;
    }

    return (
        <div className="chord-diagram-wrapper">
            {/* Заголовок с именем аккорда по центру */}
            <h4 className="text-lg font-semibold text-center mb-2">{chordName}</h4>
            
            {/* Перебираем каждый ВАРИАНТ схемы */}
            {diagrams.map((diagramGrid, diagramIndex) => (
                <div key={diagramIndex} className="diagram-grid-wrapper">
                    {/* Перебираем струны (каждая строка - это массив ладов) */}
                    {diagramGrid.map((stringFrets, stringIndex) => (
                        <div key={stringIndex} className="diagram-string-row"> 
                            {/* Используем регулярное выражение /\d+/g для поиска всех последовательностей цифр */
                                /* Это корректно обработает и однозначные ('5'), и двузначные ('10', '13') лады */}
                            {stringFrets.match(/\d+|[^\d]/g).map((fretCharOrSymbol, fretIndex) => (
                                <div key={fretIndex} className="diagram-fret-cell" data-char={fretCharOrSymbol}>
                                    {/* Если найденная часть - число, оборачиваем в <span> */}
                                    {!isNaN(fretCharOrSymbol) && <span>{fretCharOrSymbol}</span>}
                                    {/* Если это не цифра (например, 'x'), просто выводим её */}
                                    {isNaN(fretCharOrSymbol) && fretCharOrSymbol}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default ChordCard;