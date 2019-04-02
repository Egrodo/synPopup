import React, { useState, useEffect, useRef } from 'react';
import CSS from './css/App.module.css';

// If loses focus for longer than 5 seconds, fade out.
// On fadeout or close, clear all internal data and window.close()
function App() {
  const [input, setInput] = useState('');
  const timerRef = useRef(null);
  const inpRef = useRef(null);

  const showWin = () => {
    document.body.style.opacity = 1;
    document.body.style.background = 'rgba(236, 236, 219, 1)';

    // Focus input box
    inpRef.current.focus();
  };

  const hideWin = () => {
    // // Fade transparency, then hide window entirely.
    // document.body.style.opacity = 0;
    // document.body.style.background = 'rgba(236, 236, 219, 0)';
    // setTimeout(() => {
    //   setInput('');
    //   window.electron.remote.getCurrentWindow().hide();
    //   if (timerRef.current) window.clearTimeout(timerRef.current);
    // }, 800);
  };

  const isBlurred = () => {
    // Hide the window after 4s of being blurred.
    timerRef.current = window.setTimeout(hideWin, 4000);
  };

  const isFocused = () => {
    // If focused, check if there's a timer going. If there is, cancel it.
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
    }

    // Also focus input box when app is focused.
    inpRef.current.focus();
  };

  useEffect(() => {
    // First, when app starts make everything visible.
    document.body.style.opacity = 1;
    document.body.style.background = 'rgba(4236, 236, 219, 1)';

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

  return (
    <div className={CSS.App}>
      <section className={CSS.Main}>
        <p className={CSS.label}>Synonym Search</p>
        <div className={CSS.inputContainer}>
          <input
            className={CSS.input}
            value={input}
            onChange={({ target }) => setInput(target.value)}
            ref={inpRef}
            autoFocus
          />
        </div>
      </section>
    </div>
  );
}

export default App;
