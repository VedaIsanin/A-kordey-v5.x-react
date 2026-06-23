/* eslint-disable react/prop-types */
import React, { useEffect, useRef } from 'react';
import '../styles/global.css';
import TonalitySelector from './TonalitySelector';
import SettingsPanel from './SettingsPanel';
import OutputDisplay from './OutputDisplay';
import useChordGenerator from '../hooks/useChordGenerator';
import { keyPairs, keySignatures } from '../data/vocabulary';

function App() {
  // --- ИСПРАВЛЕНИЕ: Вызываем хук ОДИН РАЗ здесь ---
  const {
    state,
    sequence,
    key,
    selectedChords,
    forbidVtoIV,
    sequenceLength,
    handleInput,
    regenerateSequence,
    handleCheckChange,
    selectAll,
    deselectAll,
  } = useChordGenerator();

  // Ссылка на контейнер с чекбоксами для прямой работы с DOM
  const checkboxesRef = useRef(null);

  // --- ЭФФЕКТ ДЛЯ СИНХРОНИЗАЦИИ ЧЕКБОКСОВ (КРИТИЧЕСКИ ВАЖНО) ---
  // Этот useEffect синхронизирует состояние React с DOM-элементами.
  // Он срабатывает, когда меняется массив selectedChords.
  useEffect(() => {
    if (state !== 'chooseChords' || !checkboxesRef.current) return;

    const checkboxes = checkboxesRef.current.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox, index) => {
      // Устанавливаем атрибут checked согласно состоянию
      checkbox.checked = selectedChords[index]?.checked || false;
    });
  }, [selectedChords, state]); // Зависимость от selectedChords и state

  // Проверка на загрузку данных
  if (state === undefined || sequence === undefined) {
    return <div>Загрузка...</div>;
  }

  // Экран 1: Выбор тональности из таблицы
  if (state === 'chooseKeyNum') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 space-y-8">
        <h1 className="text-3xl font-bold mb-4 text-center">Генератор аккордов</h1>
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-8">
          <button
            onClick={() => handleInput('0')}
            className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
          >
            🎲 Случайная тональность
          </button>
          <button
            onClick={() => handleInput('00')}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
          >
            ⚡️ Быстрая генерация
          </button>
        </div>
        <TonalitySelector
          onSelect={handleInput}
          keyPairs={keyPairs}
          keySignatures={keySignatures}
        />
      </div>
    );
  }

  // Экран 2: Выбор аккордов
  else if (state === 'chooseChords') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 space-y-8">
        <div className="border border-gray-600 rounded-lg p-4">
          <h2 className="text-xl font-semibold mb-4">🎹 Шаг 2. Настройки генерации</h2>
          <p className="mb-6 text-lg">
            Какие аккорды тональности <span className="font-bold">{key}</span> применить?
          </p>

          {/* Блок с чекбоксами аккордов */}
          {/* ref используется для синхронизации DOM и React */}
          <div id="chord-checkboxes" ref={checkboxesRef}>
            {selectedChords.map((item, index) => (
              <div key={index} className="chord-checkbox">
                {/* onChange вызывает handleCheckChange из хука */}
                <input
                  type="checkbox"
                  name="chord"
                  // checked управляется через useEffect, чтобы избежать конфликтов состояний
                  onChange={(e) => handleCheckChange(index, e.target.checked)}
                /> {index + 1}. {item.chord}
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full justify-center">
            <button
              type="button"
              className="select-all-btn"
              onClick={selectAll}
            >
              Выбрать все
            </button>
            <button
              type="button"
              className="deselect-all-btn"
              onClick={deselectAll}
            >
              Снять выделение
            </button>
          </div>
        </div>

        {/* Блок с настройками гармонии */}
        <div className="mb-8 flex items-center gap-3">
          <input
            type="checkbox"
            id="harmony-toggle"
            checked={forbidVtoIV}
            onChange={(e) => handleInput(e.target.checked ? '1' : '2')}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <label htmlFor="harmony-toggle" className="text-sm">
            Строго соблюдать музыкальную гармонию (переходы V→IV запрещены)
          </label>
        </div>

        {/* Блок с выбором длины последовательности */}
        <div>
          <p className="mb-2 sm:mb-0 text-lg">Длина последовательности:</p>
          <input
            type="number"
            min="3"
            value={sequenceLength}
            onChange={(e) => handleInput(e.target.value)}
            className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
          />
        </div>

        <p className="mt-8 text-sm text-gray-400">
          ⚠️ Для применения кадансов необходимо выбрать аккорды, соответствующие ступеням тональности.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full justify-center">
          <button
            type="submit"
            className="ready-btn"
            onClick={(e) => {
              e.preventDefault();
              handleInput('generate');
            }}
          >
            Готово
          </button>
        </div>
      </div>
    );
  }

  // Экран для ввода количества аккордов (если он используется)
  else if (state === 'askCount') {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 space-y-8">
        {/* ... содержимое экрана askCount ... */}
      </div>
    );
  }

  // Экран 3: Результат генерации (и другие финальные состояния)
  else {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <SettingsPanel onChange={handleInput} />
          <OutputDisplay sequence={sequence} />
          {/* НОВАЯ КНОПКА ДЛЯ ПОВТОРНОЙ ГЕНЕРАЦИИ */}
          <div className="mt-8 text-center md:text-left">
              <button
                onClick={regenerateSequence} // <-- ВЫЗЫВАЕМ НОВУЮ ФУНКЦИЮ
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md"
              >
                🔄 Сгенерировать заново в той же тональности
              </button>
            </div>
        </div>
      </div>
    );
  }
}

export default App;