'use client';

import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import { Fragment, useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

import { NavbarLink } from './index';
interface Props {
  linkArray: NavbarLink[];
}

export default function MobileMenu({ linkArray }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex w-full items-center md:hidden">
        <button
          type="button"
          className="rounded-md text-white"
          onClick={() => setOpen(true)}
          aria-label="Open mobile menu"
        >
          <Bars3Icon className="h-8 w-8" aria-hidden="true" />
        </button>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-background bg-opacity-10" />
          </Transition.Child>

          <div className="fixed inset-0 z-40">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="fixed inset-0 flex flex-col overflow-y-auto bg-background pb-12 shadow-xl">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="text-primary focus:outline-primary -m-2 inline-flex items-center justify-center rounded-md p-2"
                    onClick={() => setOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}
                <div className="flex flex-col items-center justify-center p-2">
                  {linkArray.map((link) => (
                    <Link
                      key={`sidebar-link-${link.linkText}`}
                      href={link.href}
                      className="text-primary flex rounded p-3 font-sans text-3xl"
                      onClick={() => setOpen(false)}
                    >
                      {link.linkText}
                    </Link>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}
