import styles from '@/styles/components/WelcomeBox.module.css'
import React, { useEffect, useRef, useState } from "react";

export default function WelcomeBox() {
   const [intro, setIntro] = useState("");

  const text = "Hii,\nWelcome !";
  const index = useRef(0);

  useEffect(() => {
    function tick() {
      setIntro((prev) => prev + text[index.current]);
      index.current++;
    }
    if (index.current < text.length - 1) {
      let addChar = setInterval(tick, 50);
      return () => clearInterval(addChar);
    }
  }, [intro]);

  function newLineText(t: string) {
    const nt = t.split("\n").map((str) => <p key={str}>{str}</p>);
    return nt;
  }
  return (   
    <div className={styles.container}>
      <div className={styles.header}>{newLineText(intro)}</div>
   </div>
  )}