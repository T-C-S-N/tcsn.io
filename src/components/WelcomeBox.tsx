import styles from '@/styles/components/WelcomeBox.module.css'
import Link from 'next/link';
import React, { useEffect, useRef, useState } from "react";
import { Mail } from "react-feather";

export default function WelcomeBox() {
  const [intro, setIntro] = useState("");

  const text = "Hii,\nWelcome ! \nThis page displays all the social media linked to tocausan. \nFor any inquiries, click here below :";
  const index = useRef(0);

  useEffect(() => {
    function tick() {
      setIntro((prev) => prev + text[index.current]);
      index.current++;
    }
    if (index.current < text.length - 1) {
      let addChar = setInterval(tick, 30);
      return () => clearInterval(addChar);
    }
  }, [intro]);

  function newLineText(t: string) {
    const n = t.split("\n").map((str) => <p key={str}>{str}</p>);
    return n;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {newLineText(intro)}
        {intro.length === text.length - 1 &&
          <div className="links">
            <Link href='mailto:hello@tcsn.io'>
              <Mail color='white' size='20' />
            </Link>
          </div>
        }
      </div>
    </div>
  )
}