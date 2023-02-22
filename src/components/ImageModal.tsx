/** @format */

import Image from "next/image";
import Link from "next/link";
import { createRef, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, X } from 'react-feather'

export default function ImageModal({ images, isOpen, onClose }: any) {
  const [imageIndex, setImageIndex] = useState(0);
  const container = createRef<any>();

  const next = () => {
    if (imageIndex < images.length - 1) {
      setImageIndex(imageIndex + 1);
    } else {
      setImageIndex(0);
    }
  };

  const previous = () => {
    // scroll to top of modal with transition
    if (container.current) {
      container.current.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }

    if (imageIndex > 0) {
      setImageIndex(imageIndex - 1);
    } else {
      setImageIndex(images.length - 1);
    }

  };

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

    if (event.keyCode === 37) {
      previous();
    } else if (event.keyCode === 39) {
      next();
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
      <div className="w-[100%] h-[100%] flex flex-row justify-center items-start fixed top-0 left-0 z-[3]">
        <div className="w-[100%] h-[100%] fixed top-0 left-0 bg-neutral-900 opacity-90" onClick={onClose}></div>
        <Link href='' className="p-2 sm:m-2 text-white text-sm absolute top-10 right-10" onClick={onClose}>
          <X width={25} />
        </Link>
        <Link href='' className="p-2 sm:m-2 ml-2 text-white text-sm absolute top-[50%] left-10 bg-neutral-900 hover:bg-neutral-800 transition rounded-full" onClick={() => previous()}>
          <ArrowLeft width={25} />
        </Link>
        <Link href='' className="p-2 sm:m-2 mr-2 text-white text-sm absolute top-[50%] right-10 bg-neutral-900 hover:bg-neutral-800 transition rounded-full" onClick={() => next()}>
          <ArrowRight width={25} />
        </Link>

        <div className="w-[100%] max-w-[1000px] max-h-[100%] sm:w-[80%] top-[60px] flex flex-col justify-start items-center absolute overflow-y-auto scrollbar-hide bg-neutral-900 transition z-50" ref={container}>
          {images[imageIndex] && (
            <>
              {images[imageIndex].type === 'image' && (
                <Image src={images[imageIndex].src} width={1000} height={1000} alt={images[imageIndex].alt} priority={false} loading='lazy' className='max-w-[90%] lg:max-w-[80%] max-h-[90%] p-5' />
              )}

              {images[imageIndex].type === 'desktop-ui' && (
                <Image src={images[imageIndex].src} width={1000} height={1000} alt={images[imageIndex].alt} priority={false} loading='lazy' className='max-w-[100%] p-5' />
              )}

              {images[imageIndex].type === 'mobile-ui' && (
                <Image src={images[imageIndex].src} width={1000} height={1000} alt={images[imageIndex].alt} priority={false} loading='lazy' className='max-w-[100%] sm:max-w-[60%] lg:max-w-[40%] max-h-[90%] p-5' />
              )}
            </>
          )}
        </div>
      </div>
    );
  }
  return null;
}