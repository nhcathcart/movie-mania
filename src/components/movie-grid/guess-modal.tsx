"use client";
import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { motion } from "framer-motion";
import { getSuggestions } from "@/actions/actions";

export interface Props {
  delay: number;
  gridRow: number;
  gridColumn: number;
  actorName: string;
  validator: string;
}
export default function GuessModal({
  delay,
  gridRow,
  gridColumn,
  actorName,
  validator,
}: Props) {
  const [open, setOpen] = useState(false);
  const [guess, setGuess] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>("");

  useEffect(() => {
    const fetchSuggestions = async () => {
      const res = await getSuggestions(guess);
      setSuggestions(res);
    };
    fetchSuggestions();
  }, [guess]);

  const handleSuggestionClick = (suggestion: string) => {
    setSelectedSuggestion(suggestion);
    setGuess(suggestion);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSuggestion) {
      setOpen(false);
      console.log("Guess submitted:", selectedSuggestion);
    } else {
      alert("Please select a suggestion before submitting.");
    }
  };

  return (
    <>
      <motion.button
        className="h-full w-full bg-gray-100 rounded-sm"
        onClick={() => setOpen(!open)}
        initial={{ y: "200px", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: delay }}
      />
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
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </TransitionChild>

          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <DialogPanel className="relative transform overflow-hidden rounded bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <DialogTitle
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900"
                      >
                        Take a Guess!
                      </DialogTitle>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          {`${validator} x ${actorName}`}
                        </p>
                      </div>
                    </div>
                  </div>
                  <form className="mt-5 sm:mt-6" onSubmit={handleSubmit}>
                    <input
                      type="text"
                      className="w-full border p-2 rounded-sm"
                      value={guess}
                      onChange={(e) => setGuess(e.target.value)}
                    />
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="cursor-pointer hover:bg-gray-200"
                      >
                        {suggestion}
                      </div>
                    ))}
                    <button
                      type="submit"
                      className=" mt-2 inline-flex w-full cursor-pointer justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Guess
                    </button>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
