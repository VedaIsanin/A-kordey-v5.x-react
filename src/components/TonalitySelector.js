/* eslint-enable react/prop-types */
// src/components/TonalitySelector.jsx

import React from 'react';
import { useState } from 'react';
import { keyPairs, keySignatures } from '../data/vocabulary';

function TonalitySelector({ onSelect }) { // Пропсы keyPairs и keySignatures можно убрать, если они импортируются здесь
   // Если вы используете Tailwind CSS или переменные дизайна:
   const gap = '1rem'; // Замените на ваше значение отступа (например, '16px')
   const borderWidth = '1px';
   const borderColor = '#e2e8f0'; // Цвет границы строк

   return (
     <div>
       <h2 className="text-xl font-semibold mb-4">Шаг 1. Выберите тональность</h2>
       
       <table
         className="tonality-table"
         style={{
             '--gap': gap,
             '--border-width': borderWidth,
             '--border-color': borderColor,
         }}
       >
         <thead>
           <tr>
             <th scope="col" className="whitespace-nowrap">№</th>
             <th scope="col" className="whitespace-nowrap">Мажор (M)</th>
             <th scope="col" className="whitespace-nowrap">Минор (m)</th>
             <th scope="col" className="whitespace-nowrap text-center">Ключевые знаки</th>
           </tr>
         </thead>
         <tbody>
           {keyPairs.map(([major, minor], index) => (
             <tr key={index}>
               <td className="whitespace-nowrap">{index + 1}</td>
               {/* Ячейка Мажор */}
               <td className="whitespace-nowrap" onClick={() => onSelect(`${index+1},maj`)}>
                 {major}
               </td>
               {/* Ячейка Минор */}
               <td className="whitespace-nowrap" onClick={() => onSelect(`${index+1},min`)}>
                 {minor}
               </td>
               {/* Ячейка с ключевыми знаками */}
               <td className="whitespace-nowrap text-center">
                {keySignatures[major]}
              </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
   );
}

export default TonalitySelector;