// useGameState.tsx
import { useState, useEffect, useMemo } from 'react';

export interface GameState {
  date: string;
  guessesRemaining: number;
  grid: {
    [key: string]: { url: string; guessedCorrectly: boolean } | null;
  };
}

export const useGameState = () => {
  const defaultState = useMemo(
    () => ({
      date: new Date().toISOString(),
      guessesRemaining: 9,
      grid: {
        "0,0": null,
        "0,1": null,
        "0,2": null,
        "1,0": null,
        "1,1": null,
        "1,2": null,
        "2,0": null,
        "2,1": null,
        "2,2": null,
      },
    }),
    []
  );

  const [gameState, setGameState] = useState<GameState>(defaultState);
  const [scoreModalOpen, setScoreModalOpen] = useState(false);

  useEffect(() => {
    const stateFromStorage = localStorage.getItem("gameState");
    if (stateFromStorage) {
      const storedState = JSON.parse(stateFromStorage);
      const storedDate = new Date(storedState.date);
      const today1am = new Date();
      today1am.setHours(1, 0, 0, 0); // set time to 1:00:00

      if (storedDate >= today1am) {
        setGameState(storedState);
      } else {
        localStorage.setItem("gameState", JSON.stringify(defaultState));
      }
    } else {
      localStorage.setItem("gameState", JSON.stringify(defaultState));
    }
  }, [defaultState]);

  const updateGameState = (
    row: number,
    col: number,
    url: string,
    correctGuess: boolean
  ) => {
    const newState = {
      ...gameState,
      grid: correctGuess ? {
        ...gameState.grid,
        [`${row},${col}`]: {
          url: url,
          guessedCorrectly: true,
        },
      } : gameState.grid,
      guessesRemaining: gameState.guessesRemaining - 1,
    };
    if (newState.guessesRemaining === 0) setScoreModalOpen(true);
    setGameState(newState);
    localStorage.setItem("gameState", JSON.stringify(newState));
  };

  return { gameState, scoreModalOpen, setScoreModalOpen, updateGameState };
};