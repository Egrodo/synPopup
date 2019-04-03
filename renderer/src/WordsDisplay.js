import React, { useState, useEffect } from 'react';
import CSS from './css/WordsDisplay.module.css';

function WordsDisplay({ words }) {
  return (
    <section className={CSS.WordsDisplay}>
      <ul>
        {words.map((result, i) => (
          <li>{result.word}</li>
        ))}
      </ul>
    </section>
  );
}

export default WordsDisplay;
