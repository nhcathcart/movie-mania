"use client";
import { useState } from "react";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { XCircleIcon } from "@heroicons/react/16/solid";

export interface Props {
  actor_name: string;
  image_url: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function ActorModal({ actor_name, image_url }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="">
        {actor_name}
      </button>
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
                <DialogPanel className="relative transform overflow-visible rounded bg-white text-left shadow-xl transition-all w-full sm:my-8 sm:w-full sm:max-w-sm p-6 aspect-[2/3]">
                  <div className="flex justify-end absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2">
                    <button onClick={() => setOpen(false)}><XCircleIcon className="fill-darkSlate h-6 stroke-slate bg-white rounded-full"/></button>
                  </div>
                  <div className="h-full relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={image_url}
                      alt={"actor-image"}
                      className="object-cover absolute h-full w-full rounded"
                    />
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
