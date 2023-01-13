/** @format */
import { useState, useEffect, useRef } from "react";
import ColorBg from "../components/ColorBg";
import HeaderSketch from "../components/HeaderSketch";

const Home = () => {
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

  function newLineText(t) {
    const nt = t.split("\n").map((str) => <p key={str}>{str}</p>);
    return nt;
  }

  return (
    <div className='home'>
      <div className='container'>
        <div className='header'>{newLineText(intro)}</div>
      </div>
    </div>
  );
};

export default Home;
