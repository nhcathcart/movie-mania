"use client";

import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { GameState } from "@/hooks/use-game-state";

export interface Props {
  open: boolean;
  gameState: GameState;
  setOpen: (open: boolean) => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ScoreModal({ open, setOpen, gameState }: Props) {
    const handleCopy = async () => {
        const todayDate = new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
        });
        const text =
          `movie-mania - ${todayDate} \n\n${
            Object.values(gameState.grid).filter((obj) => obj?.guessedCorrectly).length
          }/9 correct\n` +
          Object.values(gameState.grid).reduce((acc, obj, index) => {
            acc += obj?.guessedCorrectly ? "✅ " : "❌ ";
            if ((index + 1) % 3 === 0) acc += "\n";
            return acc;
          }, "\n");
      
        if (!navigator.clipboard) {
          // Fallback for browsers without clipboard API support
          copyToClipboardFallback(text);
          alert("Results copied to clipboard (fallback)!");
          return;
        }
      
        try {
          await navigator.clipboard.writeText(text);
          alert("Results copied to clipboard!");
        } catch (err) {
          // Fallback for when clipboard API fails (e.g., due to permissions issues)
          copyToClipboardFallback(text);
          alert("Results copied to clipboard (fallback)!");
        }
      };
      
      const copyToClipboardFallback = (text: string) => {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
          document.execCommand('copy');
        } catch (err) {
          console.error("Fallback: Oops, unable to copy", err);
        }
        document.body.removeChild(textArea);
      };
  return (
    <>
      <Transition show={open}>
        <Dialog className="relative z-10" onClose={setOpen}>
          <TransitionChild
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-darkSlate bg-opacity-75 transition-opacity " />
          </TransitionChild>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="flex flex-col items-center gap-2 relative transform overflow-visible rounded bg-white text-left shadow-xl transition-all w-full sm:my-8 sm:w-full sm:max-w-sm p-6 min-h-full">
                  <h3 className="text-4xl">Game Over!</h3>
                  <div className="w-full flex justify-center text-2xl">{`You got ${
                    Object.values(gameState.grid).filter(
                      (obj) => obj?.guessedCorrectly
                    ).length
                  }/9 correct`}</div>
                  <div className="grid grid-cols-3 grid-rows-3 w-2/3 gap-2 aspect-[2/3]">
                    {Array.from({ length: 3 }, (_, i) => i).map((row) =>
                      Array.from({ length: 3 }, (_, j) => j).map((col) => {
                        const cellKey = `${row},${col}`;
                        const guessedCorrectly =
                          gameState.grid[cellKey]?.guessedCorrectly;
                        const cellClass = classNames(
                          `col-start-${col + 1}`,
                          `row-start-${row + 1}`,
                          `${guessedCorrectly ? "bg-green-500" : "bg-red-500"}`,
                          `rounded`,
                        );

                        return (
                          <div
                            key={`score-grid-item-${row}-${col}`}
                            className={cellClass}
                          />
                        );
                      })
                    )}
                  </div>
                  <div className="flex gap-2 w-full">
                    <button
                      onClick={() => handleCopy()}
                      className="active:scale-95 mt-2 inline-flex w-full cursor-pointer justify-center rounded-md bg-darkSlate px-3 py-2 text-sm font-semibold text-white shadow-sm md:hover:bg-slate focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Copy Results
                    </button>
                    <button className=" mt-2 inline-flex w-full cursor-pointer justify-center rounded-md bg-darkSlate px-3 py-2 text-sm font-semibold text-white shadow-sm md:hover:bg-slate focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                      Exit
                    </button>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
