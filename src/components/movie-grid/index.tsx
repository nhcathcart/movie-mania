"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import GuessModal from "./guess-modal";

interface Row {
  id: number;
  actor_name: string;
  image_url: string;
}
interface Column {
  id: number;
  description: string;
}

interface GameState {
  date: string;
  guessesRemaining: number;
  grid: {
    [key: string]: { url: string; guessedCorrectly: boolean } | null;
  };
}
export default function MovieGrid({
  rowLabels,
  columnLabels,
}: {
  rowLabels: Row[];
  columnLabels: Column[];
}) {
  const votingCells = [];
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      votingCells.push({ row: i, col: j });
    }
  }
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

  function updateGameState(
    row: number,
    col: number,
    url: string,
    correctGuess: boolean
  ) {
    if (correctGuess) {
      console.log("url is: ", url);
      const newState = {
        ...gameState,
        grid: {
          ...gameState.grid,
          [`${row},${col}`]: {
            url: url,
            guessedCorrectly: true,
          },
        },
        guessesRemaining: gameState.guessesRemaining - 1,
      };
      setGameState(newState);
      localStorage.setItem("gameState", JSON.stringify(newState));
    } else {
      const newState = {
        ...gameState,
        guessesRemaining: gameState.guessesRemaining - 1,
      };
      setGameState(newState);
      localStorage.setItem("gameState", JSON.stringify(newState));
    }
  }

  return (
    <div className="w-full h-[calc(100vh-240px)] md:h-[calc(100vh-80px)] md:pb-12 flex justify-center items-center ">
      {/* Create a grid with additional rows and columns for labels */}
      <div className="grid grid-cols-4 grid-rows-7 transform -translate-x-[9.5%] md:-translate-x-[12.5%] h-[450px] md:h-full aspect-[2/3] gap-1">
        {/* Empty top-left cell */}
        <div className="col-start-1 row-start-1"></div>

        {/* Column labels */}

        {columnLabels.map((col, index) => {
          return (
            <div
              key={col.id}
              className={`flex w-full  justify-center items-end bg-transparent col-start-${
                index + 2
              } row-start-1 p-1 pb-3 items-end justify-center text-center text-[9px]`}
            >
              {col.description}
            </div>
          );
        })}

        {/* Row labels */}
        {rowLabels.map((row, index) => {
          return (
            <div
              key={row.id}
              className={`flex justify-center items-center bg-transparent col-start-1 row-start-${
                index * 2 + 2
              } p-1 items-center justify-center text-center text-2xs row-span-2`}
            >
              {row.actor_name}
            </div>
          );
        })}
        {/* Voting cells */}
        <div className="grid row-start-2 row-end-8 col-start-2 col-end-5 grid-rows-3 grid-cols-3 gap-2">
          {votingCells.map((cell, index) => {
            return (
              <motion.div
                key={`voting-cell-${index}`}
                className={`col-start-${cell.col + 1} row-start-${
                  cell.row + 1
                } items-center relative`}
                initial={{ y: "200px", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                {!gameState.grid[`${cell.row},${cell.col}`] ? (
                  <GuessModal
                    delay={index * 0.2}
                    gridRow={cell.row}
                    gridColumn={cell.col}
                    actorName={rowLabels[cell.row].actor_name}
                    validator={columnLabels[cell.col].description}
                    updateGameState={updateGameState}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={`https://image.tmdb.org/t/p/original${
                      gameState.grid[`${cell.row},${cell.col}`]?.url
                    }`}
                    alt="movie poster"
                    className="h-full w-full object-fit absolute rounded shadow-md"
                  />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
