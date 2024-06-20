"use client";
import { Fragment, useEffect, useState } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
  Combobox,
  ComboboxInput,
  ComboboxOptions,
  ComboboxOption,
} from "@headlessui/react";
import { checkGuess, getSuggestions } from "@/actions/actions";

export interface Props {
  delay: number;
  gridRow: number;
  gridColumn: number;
  actorName: string;
  validator: string;
  updateGameState: Function;
}
export default function GuessModal({
  delay,
  gridRow,
  gridColumn,
  actorName,
  validator,
  updateGameState,
}: Props) {
  const [open, setOpen] = useState(false);
  const [guess, setGuess] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<string>("");

  function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSuggestion) {
      const res = await checkGuess(selectedSuggestion, gridColumn, gridRow);
      console.log("res is", res);
      if (res) updateGameState(gridRow, gridColumn, res, true);
      else updateGameState(gridRow, gridColumn, "", false);
      setOpen(false);
    } else {
      alert("Please select a suggestion before submitting.");
    }
  };

  return (
    <>
      <button
        className="h-full w-full bg-lightSlate rounded shadow-md transform active:scale-95 md:hover:bg-darkSlate transition-colors duration-500"
        onClick={() => setOpen(!open)}
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
                <DialogPanel className="relative transform overflow-visible rounded bg-white text-left shadow-xl transition-all w-full sm:my-8 sm:w-full sm:max-w-sm p-6 min-h-full">
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
                    <div className="relative w-full">
                      <Combobox
                        value={selectedSuggestion}
                        onChange={(suggestion) => {
                          setGuess(suggestion ?? ''); // Update the input field to display the selected suggestion
                          setSelectedSuggestion(suggestion ?? ''); // Update the selected suggestion state
                        }}
                      >
                        <ComboboxInput
                          className="relative w-full border p-2 rounded-sm"
                          value={guess}
                          onChange={(e) => {
                            setGuess(e.target.value); // Update guess based on input change
                            setSelectedSuggestion(""); // Reset selected suggestion when the input changes
                          }}
                          autoComplete="off"
                        />
                        {suggestions.length > 0 && (
                          <ComboboxOptions className="z-100 absolute w-full rounded top-full flex flex-col max-h-[200px] overflow-scroll divide-y-gray-100 mt-1 bg-white">
                            {suggestions.map((suggestion, index) => (
                              <ComboboxOption
                                key={index}
                                value={suggestion}
                                className={({ focus }) =>
                                  classNames(
                                    "relative cursor-pointer select-none p-2",
                                    focus
                                      ? "bg-darkSlate text-white"
                                      : "text-gray-900"
                                  )
                                }
                                onClick={() => handleSuggestionClick(suggestion)}
                              >
                                {suggestion}
                              </ComboboxOption>
                            ))}
                          </ComboboxOptions>
                        )}
                      </Combobox>
                    </div>
                    <button
                      type="submit"
                      className=" mt-2 inline-flex w-full cursor-pointer justify-center rounded-md bg-darkSlate px-3 py-2 text-sm font-semibold text-white shadow-sm md:hover:bg-slate focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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
