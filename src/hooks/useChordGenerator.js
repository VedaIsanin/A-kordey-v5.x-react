/* eslint-enable react/prop-types */
import { useState, useEffect } from 'react';
import {
  allChords,
  chordDiagrams,
  keyPairs,
  keySignatures,
} from '../data/vocabulary';

const TONIC = 'T';
const SUBDOMINANT = 'S';
const DOMINANT = 'D';

const TRANSITION_MATRIX = {
  [TONIC]: { [TONIC]: 1, [SUBDOMINANT]: 3, [DOMINANT]: 2 },
  [SUBDOMINANT]: { [TONIC]: 2, [SUBDOMINANT]: 1, [DOMINANT]: 4 },
  [DOMINANT]: { [TONIC]: 5, [SUBDOMINANT]: 0, [DOMINANT]: 1 }, // Запрет V -> IV здесь
};

function getChordFunction(step) {
  if ([1, 3, 6].includes(step)) return TONIC;
  if ([2, 4].includes(step)) return SUBDOMINANT;
  if ([5, 7].includes(step)) return DOMINANT;
  return null;
}

export default function useChordGenerator() {
  const [state, setState] = useState('chooseKeyNum');
  const [key, setKey] = useState('');

  // Массив объектов: {chord: 'Am', checked: true}
  const [selectedChords, setSelectedChords] = useState([]);

  const [sequenceLength, setSequenceLength] = useState(4);
  const [sequence, setSequence] = useState([]);

  const [forbidVtoIV, setForbidVtoIV] = useState(true);

  const cadenceTypes = {
    autentic: { name: 'Автентический', templateSteps: [5, 1] },
    plagal: { name: 'Плагальный', templateSteps: [4, 1] },
    full: { name: 'Полный функциональный оборот', templateSteps: [4, 5, 1] },
    interrupted: { name: 'Прерванный', templateSteps: [5, 6] },
    dominant: { name: 'Доминантовый', templateSteps: [5] },
    leading: { name: 'Вводный', templateSteps: [7, 1] },
  };

  // --- НОВАЯ ЛОГИКА ГЕНЕРАЦИИ ---

  /**
   * Выбирает следующий аккорд на основе предыдущего шага и доступных аккордов.
   * @param {number|null} prevStep - Предыдущая ступень (1-7) или null для старта.
   * @param {Array} availableChords - Массив доступных аккордов (только те, что checked).
   * @returns {{chord: string, step: number}|null}
   */
  const chooseNextChord = (prevStep, availableChords) => {
    if (availableChords.length === 0) return null;

    const steps = [1, 2, 3, 4, 5, 6, 7];
    if (prevStep === null) {
      const idx = Math.floor(Math.random() * availableChords.length);
      return { chord: availableChords[idx], step: steps[idx] };
    }

    const prevFunction = getChordFunction(prevStep);
    if (!prevFunction) return null;

    let candidates = [];
    steps.forEach((step) => {
      const stepFunction = getChordFunction(step);
      let weight = TRANSITION_MATRIX[prevFunction][stepFunction] || 0;

      // Применяем запрет перехода V -> IV
      if (forbidVtoIV && prevFunction === DOMINANT && stepFunction === SUBDOMINANT) {
        weight = 0;
      }

      // Добавляем шаг в список кандидатов только если аккорд на этой ступени выбран
      if (weight > 0 && availableChords[step - 1]) {
        for (let i = 0; i < weight; i++) candidates.push(step);
      }
    });

    if (candidates.length === 0) return null;
    const chosenStep = candidates[Math.floor(Math.random() * candidates.length)];
    return {
      chord: availableChords[chosenStep - 1],
      step: chosenStep,
    };
  };

  const generateSequence = () => {
    if (!key || selectedChords.length === 0) return;

    // Создаем массив только из выбранных (checked) аккордов.
    // Пустые слоты (false) нужны для сохранения индексов ступеней.
    const availableChords = selectedChords.map(item => item.checked ? item.chord : null);

    let sequenceChords = [];
    let currentStep = null;

    while (sequenceChords.length < sequenceLength) {
      const nextItem = chooseNextChord(currentStep, availableChords);
      if (!nextItem) break; // Если нет доступных переходов

      sequenceChords.push(nextItem.chord);
      currentStep = nextItem.step;
    }

    setSequence(sequenceChords);
    setState('askRepeat');
  };

    // --- НОВАЯ ФУНКЦИЯ ---
    const regenerateSequence = () => {
      // Сбрасываем текущую последовательность перед генерацией новой
      setSequence([]);
      // Вызываем основную функцию генерации
      generateSequence();
    };


  // --- ОБРАБОТКА ВВОДА И СОСТОЯНИЯ ---
// --- НОВАЯ ФУНКЦИЯ ДЛЯ ОБРАБОТКИ ДЛИНЫ ПОСЛЕДОВАТЕЛЬНОСТИ ---
const handleLengthChange = (value) => {
  const num = parseInt(value);
  // Проверяем, что это число и оно в диапазоне от 3 до 12
  if (!isNaN(num) && num >= 3 && num <= 12) {
    setSequenceLength(num);
  }
};


  function handleInput(userInput) {
    console.log(`--- НОВЫЙ ВВОД: '${userInput}' | Текущее состояние: '${state}' ---`);

    switch (state) {
      case 'chooseKeyNum':
        let newKey; // Переменная объявляется здесь, чтобы быть доступной во всем блоке
        if (userInput.includes(",")) {
          const [choiceNum, mode] = userInput.split(",");
          const numericChoice = parseInt(choiceNum);
          const majors = keyPairs.map((p) => p[0]);
          const minors = keyPairs.map((p) => p[1]);
          if (!isNaN(numericChoice) && numericChoice >= 1 && numericChoice <= majors.length) {
            newKey = mode === 'maj' ? majors[numericChoice - 1] : minors[numericChoice - 1];
            setKey(newKey);
            setSelectedChords(allChords[newKey].map(chord => ({ chord, checked: true })));
            setState('chooseChords');
            return;
          }
        } else if (userInput === '0') { // Случайная тональность
          const randomIdx = Math.floor(Math.random() * keyPairs.length);
          const randomMode = Math.round(Math.random());
          newKey = keyPairs[randomIdx][randomMode]; // Теперь newKey получает значение
          setKey(newKey);
          setSelectedChords(allChords[newKey].map(chord => ({ chord, checked: true })));
          setState('chooseChords');
        } else if (userInput === '00') { // Быстрая генерация
          console.log("Быстрая генерация запущена");
          const randomIdx = Math.floor(Math.random() * keyPairs.length);
          const randomMode = Math.round(Math.random());
          newKey = keyPairs[randomIdx][randomMode];

          // 1. Сначала устанавливаем список аккордов.
          // Используем колбэк-функцию, чтобы быть уверенными, что мы работаем с актуальным newKey.
          setSelectedChords(allChords[newKey].map(chord => ({ chord, checked: true })));

          // 2. Затем устанавливаем ключ.
          // setKey не принимает колбэк, поэтому мы просто вызываем его.
          setKey(newKey);

          // 3. Генерация будет запущена автоматически хуком useEffect,
          // который мы исправили в предыдущем шаге.
        }
        break;

        case 'chooseChords':
          // Проверяем, является ли ввод числом
          const num = parseInt(userInput);
          if (!isNaN(num)) {
            // Если это число, проверяем границы [3, 12]
            if (num >= 3 && num <= 12) {
              setSequenceLength(num); // Обновляем длину последовательности
            }
            // Если число вне границ или поле пустое после удаления, ничего не делаем.
            // Это позволяет стирать цифры клавишей Backspace.
          } else if (userInput === 'generate') {
            // Проверяем количество выбранных аккордов перед генерацией
            const checkedCount = selectedChords.filter(item => item.checked).length;
            
            if (checkedCount >= 3) {
                generateSequence();
            } else {
                console.warn("Ошибка генерации: Необходимо выбрать минимум 3 аккорда.");
            }
        } else {
            const num = parseInt(userInput);
            if (!isNaN(num)) {
                // Используем Math.min и Math.max для ограничения диапазона [3, 12]
                const clampedValue = Math.min(Math.max(num, 3), 12); 
                setSequenceLength(clampedValue);
            }
            // Если поле пустое ("") или введено не число, ничего не делаем,
            // позволяя пользователю стереть текущее значение.
        }
          break;

        case 'askRepeat': // <-- ИЗМЕНЯЕМ ЭТОТ БЛОК
        if (userInput === '1') {
          // Регенерация в той же тональности
          regenerateSequence();
        } else if (userInput === '2') {
          // Возврат к выбору аккордов: СБРОСИМ результат генерации
          setSequence([]);
          setState('chooseChords');
        } else if (userInput === '3') {
          // Возврат к выбору тональности: СБРОСИМ и результат, и ключ
          setSequence([]);
          setKey('');
          setState('chooseKeyNum');
        }
        break;

      default:
        console.log(`Unhandled state: ${state}`);
    }
  };


// --- НОВЫЕ ФУНКЦИИ ДЛЯ UI ---

/**
 * Обрабатывает клик по чекбоксу аккорда.
 * @param {number} index - Индекс аккорда в массиве selectedChords.
 * @param {boolean} isChecked - Новое состояние флажка.
 */
const handleCheckChange = (index, isChecked) => {
    setSelectedChords(prev => prev.map((item, i) =>
        i === index ? { ...item, checked: isChecked } : item
    ));
};

/**
 * Выбирает все доступные аккорды.
 */
const selectAll = () => {
    setSelectedChords(prev => prev.map(item => ({ ...item, checked: true })));
};

/**
 * Снимает выделение со всех аккордов.
 */
const deselectAll = () => {
    setSelectedChords(prev => prev.map(item => ({ ...item, checked: false })));
};

useEffect(() => {
  // Этот эффект сработает, когда key и selectedChords будут готовы.
  // Он проверяет, что мы находимся на шаге выбора тональности,
  // чтобы избежать зацикливания на других шагах.
  if (state === 'chooseKeyNum' && key && selectedChords.length > 0) {
    console.log("Состояния key и selectedChords установлены. Запускаем генерацию.");
    generateSequence();
  }
}, [state, key, selectedChords, generateSequence]); // Добавили state в зависимости




// --- ВОЗВРАЩАЕМ УПРАВЛЕНИЕ ---
return {
    state,
    key,
    sequence,
    sequenceLength,
    forbidVtoIV,
    handleLengthChange,
    handleInput,
    selectAll,
    deselectAll,
    regenerateSequence,
    selectedChords,
};
};