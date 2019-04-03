import React, { useState, useReducer, useEffect, useRef } from 'react';
import WordsDisplay from './WordsDisplay';
import CSS from './css/App.module.css';

// If loses focus for longer than 5 seconds, fade out.
// On fadeout or close, clear all internal data and window.close()
function App() {
  const [input, setInput] = useState('');
  const [msg, setMsg] = useState('');
  const [result, dispatch] = useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'success':
          return {
            error: false,
            errorMsg: '',
            words: action.words,
          };
        case 'error':
          return {
            error: true,
            errorMsg: action.errorMsg,
            words: prevState.words,
          };
        default:
          return prevState;
      }
    },
    { error: false, errorMsg: '', words: [] },
  );

  const AppRef = useRef();
  const hideTimerRef = useRef();
  const msgTimerRef = useRef();
  const inpRef = useRef();
  const msgRef = useRef();

  const showWin = () => {
    document.body.style.opacity = 1;
    AppRef.current.style.opacity = 1;
    AppRef.current.style.background = 'rgba(236, 236, 219, 1)';

    // Focus input box
    inpRef.current.focus();
  };

  const hideWin = () => {
    // Fade transparency, then hide window entirely.
    document.body.style.opacity = 0;
    AppRef.current.style.opacity = 0;
    AppRef.current.style.background = 'rgba(236, 236, 219, 0)';
    setTimeout(() => {
      setInput('');
      window.electron.remote.getCurrentWindow().hide();
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    }, 800);
  };

  const isBlurred = () => {
    // Hide the window after 4s of being blurred.
    hideTimerRef.current = window.setTimeout(hideWin, 4000);
  };

  const isFocused = () => {
    // If focused, check if there's a timer going. If there is, cancel it.
    if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
  };

  const onSubmit = async e => {
    e.preventDefault();
    if (!input) return false;

    try {
      const resp = await fetch(`https://api.datamuse.com/words?rel_syn=${input}`);
      const json = await resp.json();
      if (!json.length) throw new Error(`No synonyms found for "${input}"`);
      dispatch({ type: 'success', words: json });
    } catch ({ message }) {
      dispatch({ type: 'error', errorMsg: message });
    }

    setInput('');
    inpRef.current.focus();
  };

  const displayMsg = newMsg => {
    setMsg(newMsg);
    msgRef.current.style.opacity = 1;
    if (msgTimerRef.current) {
      // If there's already a timer going, reset it so the message stays for 5s.
      window.clearTimeout(msgTimerRef.current);
    }

    msgTimerRef.current = window.setTimeout(() => {
      msgRef.current.style.opacity = 0;
      msgTimerRef.current = null;
    }, 3000);
  };

  useEffect(() => {
    // First, when app starts make everything visible.
    document.body.style.opacity = 1;
    AppRef.current.style.opacity = 1;
    AppRef.current.style.background = 'rgba(4236, 236, 219, 1)';

    // Set focus listeners.
    window.addEventListener('blur', isBlurred);
    window.addEventListener('mouseout', () => {
      // Mouseout is special, only blur if is also not focused.
      if (!document.hasFocus()) isBlurred();
    });
    window.addEventListener('focus', isFocused);
    window.addEventListener('mouseover', isFocused);

    // Fade in transparency.
    const currWin = window.electron.remote.getCurrentWindow();
    currWin.addListener('show', showWin);

    // Focus input box.
    return () => {
      currWin.removeListener('show', showWin);
      window.removeEventListener('blur', isBlurred);
      window.removeEventListener('mouseout', isBlurred);
      window.removeEventListener('focus', isFocused);
      window.removeEventListener('mouseover', isFocused);
    };
  }, []);

  useEffect(() => {
    if (result.error) displayMsg(result.errorMsg);
  }, [result]);

  const changeHeight = addedHeight => {
    AppRef.current.style.maxHeight = `${188 + addedHeight}px`;
  };

  return (
    <div className={CSS.App} ref={AppRef}>
      <section className={CSS.Main}>
        <p className={CSS.label}>Synonym Search</p>
        <div className={CSS.inputContainer}>
          <form onSubmit={onSubmit}>
            <input
              className={CSS.input}
              value={input}
              onChange={({ target }) => setInput(target.value)}
              onSubmit={onSubmit}
              ref={inpRef}
              placeholder="Type word here..."
              maxLength={30}
              autoComplete="off"
              autoCorrect="off"
              autoFocus
            />
          </form>
        </div>
      </section>
      {Boolean(result.words.length) && (
        <WordsDisplay words={result.words} displayMsg={displayMsg} changeHeight={changeHeight} />
      )}
      <p className={CSS.msg} ref={msgRef}>
        {msg}
      </p>
    </div>
  );
}

export default App;
