"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import GuessModal from "./guess-modal";
import ScoreModal from "./score-modal";
import { useGameState } from "@/hooks/use-game-state";
import ActorModal from "./actor-modal";

interface Row {
  id: number;
  actor_name: string;
  image_url: string;
}
interface Column {
  id: number;
  description: string;
}

export interface GameState {
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

  const { gameState, updateGameState, scoreModalOpen, setScoreModalOpen } =
    useGameState();
  console.log("game state in movie grid", gameState);
  return (
    <div className="flex flex-col h-fit">
      <div className="w-full h-[calc(100vh-240px)] md:h-[calc(100vh-80px)] md:pb-12 flex flex-col justify-center items-center ">
        {/*Score modal that shows when we are out of guesses*/}
        <ScoreModal
          open={scoreModalOpen}
          setOpen={setScoreModalOpen}
          gameState={gameState}
        />

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
                } row-start-1 p-1 pb-3 items-end justify-center text-center text-[10px] lg:text-[14px]`}
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
                className={`relative flex justify-center items-center bg-transparent col-start-1 row-start-${
                  index * 2 + 2
                } p-1 items-center justify-center text-center row-span-2 text-[10px] lg:text-[14px]`}
              >
                <ActorModal
                  actor_name={row.actor_name}
                  image_url={`https://image.tmdb.org/t/p/original${row.image_url}`}
                />
              </div>
            );
          })}
          {/* Voting cells */}
          <div className="grid row-start-2 row-end-8 col-start-2 col-end-5 grid-rows-3 grid-cols-3 gap-2 lg:gap-4">
            {votingCells.map((cell, index) => {
              return (
                <motion.div
                  key={`voting-cell-${index}`}
                  className={`col-start-${cell.col + 1} row-start-${
                    cell.row + 1
                  } items-center relative`}
                  initial={{ y: "200px", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{
                    delay: index * 0.1,
                    type: "spring",
                    bounce: 0.38,
                    ease: "easeIn",
                    duration: 1,
                  }}
                >
                  {!gameState.grid[`${cell.row},${cell.col}`] ? (
                    <GuessModal
                      delay={index * 0.2}
                      gridRow={cell.row}
                      gridColumn={cell.col}
                      actorName={rowLabels[cell.row].actor_name}
                      validator={columnLabels[cell.col].description}
                      updateGameState={updateGameState}
                      outOfGuesses={gameState.guessesRemaining === 0}
                      setScoreModalOpen={setScoreModalOpen}
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
        {/* div to display remaining guesses and tmdb logo*/}
        <h3 className="mt-8 font-newZealand text-2xs lg:text-xs font-[200] w-full text-center">{`${gameState.guessesRemaining} guesses remaining`}</h3>
      </div>
      <div className="flex flex-col w-full items-center my-4">
        <div className="flex items-center gap-4 mt-10">
          <span className="text-2xs">Powered by</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={"/images/tmdb-logo.svg"}
            alt={"The Movie Database Logo"}
            className="aspect-[980/797] w-[75px]"
          />
        </div>
      </div>
    </div>
  );
}
