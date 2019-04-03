import React, { useState, useEffect, useRef } from 'react';
import CSS from './css/WordsDisplay.module.css';

function WordsDisplay({ words, displayMsg, changeHeight }) {
  const [oldHeight, setOldHeight] = useState(0);
  const dispRef = useRef();

  const onClick = e => {
    const str = e.currentTarget.innerText;
    // Copy to clipboard.

    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    displayMsg(`Copied "${str}" to clipboard`);
  };

  // TODO: On receive of new words, save last height and keep that height for .6s while it transitions.
  useEffect(() => {
    // On first load and on word list change, update height for animation.
    if (dispRef.current) {
      const newHeight = dispRef.current.clientHeight;
      if (newHeight < oldHeight) {
        dispRef.current.style.height = `${oldHeight}px`;
        changeHeight(newHeight);
        setTimeout(() => {
          dispRef.current.style.height = '';
        }, 600);
      } else {
        setOldHeight(newHeight);
        changeHeight(newHeight);
      }
    }
  }, [words]);

  return (
    <section className={CSS.WordsDisplay} ref={dispRef}>
      <ol className={CSS.wordList}>
        {words.map(({ word }, i) => (
          <li className={CSS.wordItem} key={`${i}_${word}`} onClick={onClick}>
            {word}
          </li>
        ))}
      </ol>
    </section>
  );
}

export default WordsDisplay;
