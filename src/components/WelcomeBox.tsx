import Config from '@/utils/Config';
import Image from 'next/image';
import React, { Children, useEffect, useRef, useState } from "react";
import { Mail } from "react-feather";

export default function WelcomeBox() {
  const [intro, setIntro] = useState("");
  const textBox = useRef<HTMLDivElement>(null);
  const [textIndex, setTextIndex] = useState(0);
  const texts = [
    `.............................
  .............................
  ......... initiated                 
  `,
    ` 

  Hi, 
  Welcome !
                                       
  My name is 
  Tomas.
  I'm a nerdy full-
  stack developer 
  with passion for 
  graphics design
  based in Brussels, 
  Belgium.
                  
                  
  If you're willing
  to reach out,
  feel free to
  contact me at

  
  ${Config.email}

                                                                                                                        
  Don't get fooled, 
  this is a fake CTR 
  screen effect 
  made in css.


  :)
  
                                                                                                                        
  The end.
  
                                                                                                                        
  Really...

                                                                                                                          
  Or is it? 

  `,
  ]

  const index = useRef(0);

  useEffect(() => {
    function tick() {
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
    const n = t.split("\n").map((str, i) => <p key={i} className='h-5 animate-pulse'>{str}</p>);
    return n;
  }

  return (
    <div className='w-[100%] relative flex justify-center text-sm'>
      <Image src='/tv-color.svg' alt='hero' width={500} height={500} priority={true} className='w-[250px] absolute' />
      <div className='w-[150px] h-[130px] mt-[50px] ml-[-40px] p-4 text-green-400 z-10 relative'>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1366 768" className='w-[120px] mt-[35px] ml-[-5px] fill-none stroke-green-400 stroke-[8px] absolute top-0 stroke-animate animate-pulse opacity-[.1]'>
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

        <div className='h-[100%] select-none overflow-auto scrollbar-hide transition' ref={textBox}>
          {newLineText(intro)}
        </div>
      </div>
    </div>
  )
}