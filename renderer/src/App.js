import React, { useState, useEffect, useRef } from 'react';
import CSS from './css/App.module.css';

// If loses focus for longer than 5 seconds, fade out.
// On fadeout or close, clear all internal data and window.close()
function App() {
  const [input, setInput] = useState('');

  useEffect(() => {
    document.body.style.opacity = 1;
    document.body.style.background = 'rgba(46, 44, 40, 1)';

    const onShow = () => {
      document.body.style.opacity = 1;
      document.body.style.background = 'rgba(46, 44, 40, 1)';
    };

    window.electron.remote.getCurrentWindow().addListener('show', onShow);

    return () => {
      window.electron.remote.getCurrentWindow().removeListener('show', onShow);
    };
  }, []);

  const hideWin = () => {
    console.log('Hiding');
    document.body.style.opacity = 0;
    document.body.style.background = 'rgba(46, 44, 40, 0)';
    setTimeout(() => {
      setInput('');
      window.electron.remote.getCurrentWindow().hide();
    }, 700);
  };

  return (
    <div className={CSS.App}>
      <header className={CSS.Header}>
        <button onClick={hideWin}>X</button>
      </header>
      <section className={CSS.Main}>
        <div className={CSS.inputContainer}>
          <p className={CSS.label}>Synonym Search...</p>
          <input className={CSS.input} value={input} onChange={({ target }) => setInput(target.value)} />
        </div>
      </section>
    </div>
  );
}

export default App;
