/** @format */

import next from "next";
import Link from "next/link";
import { createRef, useEffect } from "react";
import { X } from 'react-feather'

export default function Modal({ children, isOpen, onClose }: any) {
  const container = createRef<any>();

  // arrow key change image
  const handleKeyDown = (event: any) => {
    // scroll to top of modal with transition
    if (container.current) {
      container.current.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }

    // esc key close modal
    if (event.keyCode === 27) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  if (isOpen) {
    return (
      <div className="w-[100%] h-[100%] flex flex-row justify-center items-start fixed top-[60px] sm:top-[65px] left-0 z-40" ref={container}>
        <div className="w-[100%] h-[100%] absolute top-0 left-0 bg-neutral-900 opacity-90" onClick={onClose}></div>
        <Link href='' className="p-2 text-white text-sm bg-neutral-900 hover:bg-neutral-800 transition rounded-full absolute top-2 right-2 z-40" onClick={onClose}>
          <X width={25} />
        </Link>

        <section className="flex justify-start items-start overflow-scroll z-30 absolute">
          {children}
        </section>
      </div>
    );
  }
  return null;
}