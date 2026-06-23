/* eslint-enable react/prop-types */
// src/components/TonalitySelector.jsx

import React from 'react';
import { useState } from 'react';
import { keyPairs, keySignatures } from '../data/vocabulary'; // Импортируем keySignatures

function TonalitySelector({ onSelect, keyPairs, keySignatures }) { // Добавляем keySignatures в пропсы
   return (
     <div>
       <h2 className="text-xl font-semibold mb-4">Шаг 1. Выберите тональность</h2>
       <table className="min-w-full divide-y divide-gray-700">
         <thead className="bg-gray-800">
           <tr>
             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">№</th>
             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Мажор (M)</th>
             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Минор (m)</th>
             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Ключевые знаки</th>
           </tr>
         </thead>
         <tbody className="bg-gray-700 divide-y divide-gray-800">
           {keyPairs.map(([major, minor], index) => (
             <tr key={index}>
               <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
               
               {/* Ячейка Мажор - КНОПКА */}
               <td
                 className="px-6 py-4 whitespace-nowrap cursor-pointer transition-colors hover:bg-gray-800"
                 onClick={() => onSelect(`${index+1},maj`)}
               >
                 {major}
               </td>
               
               {/* Ячейка Минор - КНОПКА */}
               <td
                 className="px-6 py-4 whitespace-nowrap cursor-pointer transition-colors hover:bg-red-800"
                 onClick={() => onSelect(`${index+1},min`)}
               >
                 {minor}
               </td>
               
               {/* Ячейка с ключевыми знаками */}
               <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold">
                {keySignatures[major]} {/* Используем пропс */}
              </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
   );
}

export default TonalitySelector;