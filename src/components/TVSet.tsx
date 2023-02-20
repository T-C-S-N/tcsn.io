import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from "react";

export default function TVSet({ width = 250, texts = [''], colorIndexInit = 0 }: { width: number, texts: string[], colorIndexInit: number }) {
  const [intro, setIntro] = useState("");
  const tvSet = useRef<HTMLDivElement>(null);
  const tvContent = useRef<HTMLDivElement>(null);
  const tvButton1 = useRef<any>(null);
  const tvButton2 = useRef<any>(null);
  const textBox = useRef<HTMLDivElement>(null);
  const [textIndex, setTextIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(colorIndexInit);
  const textColors = ['text-green-400', 'text-yellow-400', 'text-rose-400', 'text-blue-400', 'text-white', 'text-cyan-400', 'text-lime-400', 'text-pink-400'];
  const strokeColors = ['stroke-green-400', 'stroke-yellow-400', 'stroke-rose-400', 'stroke-blue-400', 'stroke-white', 'stroke-cyan-400', 'stroke-lime-400', 'stroke-pink-400'];

  const index = useRef(0);

  const handleChangeColor = (direction: boolean) => {
    if (direction) {
      if (colorIndex < textColors.length - 1) setColorIndex(colorIndex + 1)
      else setColorIndex(0)
    } else {
      if (colorIndex < 0) setColorIndex(colorIndex - 1)
      else setColorIndex(textColors.length - 1)
    }
  }

  const updateSize = () => {
    const tvSetSize = width
    tvSet.current?.classList.add(`w-[${tvSetSize}px]`);
    tvSet.current?.classList.add(`h-[${tvSetSize}px]`);

    const contentSize = (width / 10).toFixed().toString() + 'px';
    tvContent.current?.classList.add(`w-[${contentSize}px]`);
    tvContent.current?.classList.add(`h-[${contentSize}px]`);

    const buttonSize = (width / 10).toFixed().toString() + 'px';
    tvButton1.current?.classList.add(`w-[${buttonSize}]`);
    tvButton1.current?.classList.add(`h-[${buttonSize}]`);
    tvButton2.current?.classList.add(`w-[${buttonSize}]`);
    tvButton2.current?.classList.add(`h-[${buttonSize}]`);

    const textBoxSize = (150).toFixed().toString() + 'px';
    console.log(textBoxSize)
    textBox.current?.classList.add(`!max-h-[${textBoxSize}]`);
  }

  useEffect(() => {
    updateSize();
    function tick() {
      if (textIndex === 2) {
        textBox.current?.classList.remove('text-[8px]')
        textBox.current?.classList.remove('[&>*]:h-3')
      } else {
        textBox.current?.classList.add('text-[8px]')
        textBox.current?.classList.add('[&>*]:h-3')
      }

      setIntro((prev) => prev.slice(0, prev.length - 1) + texts[textIndex][index.current] + '_');
      index.current++;
    }

    if (index.current < texts[textIndex].length - 1) {
      let addChar = setInterval(tick, 30);
      return () => clearInterval(addChar);
    } else {
      if (textIndex < texts.length - 1) {
        setIntro('')
        index.current = 0
        setTextIndex(textIndex + 1);
      }
    }
  }, [intro]);

  useEffect(() => {
    // scroll to bottom
    if (textBox.current?.children && textBox.current?.children.length > 0) textBox.current.scrollTop = textBox.current.scrollHeight;
  }, [textBox.current?.children.length]);


  function newLineText(t: string) {
    const n = t.split("\n").map((str, i) => <p key={i} className='min-h-5'>{str}</p>);
    return n;
  }

  return (
    <div className='relative flex justify-center text-sm' ref={tvSet}>
      <Image src='/tcsn/tv-color.svg' alt='hero' width={500} height={500} priority={true} className='absolute' />
      <div className='w-[88%] border border-red-300 mt-[17%] p-4 z-10 relative' ref={tvContent}>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1366 768" className={['w-[50%] mt-[20%] ml-[5%] fill-none stroke-[8px] absolute top-0 stroke-animate animate-pulse opacity-[.1]', strokeColors[colorIndex]].join(' ')}>
          <polygon points="384.2,352.8 580.5,549.2 635.7,604.5 649.2,537.4 397.6,286 	" />
          <polygon points="384.2,352.8 397.6,286 649.2,537.4 397.6,285.8 	" />
          <polygon points="535.6,262.3 415.6,195.7 397.6,285.8 490,270 	" />
          <polygon points="397.6,285.8 7,352.8 384.2,352.8 	" />
          <polygon points="384.2,352.8 7,352.8 258.4,604.5 635.7,604.5 580.5,549.2 	" />
          <polygon points="1107.4,164.3 698.6,352.8 849,503.2 950.2,604.5 1359,415.7 	" />
          <polygon points="1107.4,164.3 535.6,262.3 698.6,352.8 	" />
          <polygon points="698.6,352.8 535.6,262.3 787,513.8 950.2,604.5 849,503.2 	" />
          <polygon points="490,270 397.6,285.8 649.2,537.4 787,513.8 535.6,262.3 	" />
        </svg>

        <Link href='' className='rounded-xl z-20 absolute right-0 top-0 mr-[7.8%] mt-[15.5px] border border-red-300'
          onClick={() => handleChangeColor(true)} ref={tvButton1} />
        <Link href='' className='rounded-xl z-20 absolute right-0 top-0 mr-[7.8%] mt-[37.5px] border border-red-300'
          onClick={() => handleChangeColor(false)} ref={tvButton2} />

        <div className={['w-[66%] h-[85px] mt-[0%] ml-[5%] select-none overflow-auto scrollbar-hide transition border border-yellow-300', textColors[colorIndex]].join(' ')} ref={textBox}>
          {newLineText(intro)}
        </div>
      </div>
    </div>
  )
}