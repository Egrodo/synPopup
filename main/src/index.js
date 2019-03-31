const { app, BrowserWindow, globalShortcut } = require('electron');
const Positioner = require('electron-positioner');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 200,
    transparent: false,
    backgroundColor: '#2e2c28',
    skipTaskbar: true,
    fullscreenable: false,
    alwaysOnTop: true,
    title: 'Synonym Searcher',
    darkTheme: true,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      preload: `${__dirname}/preload.js"`,
    },
  });

  const positioned = new Positioner(win);
  positioned.move('bottomRight');

  win.loadURL('http://localhost:3000');

  win.on('closed', () => {
    win = null;
  });
}

function watchCommand() {
  const ret = globalShortcut.register('CommandOrControl+X', createWindow);
  if (!ret) throw new Error('Keystroke registration failed.');
}

app.on('ready', watchCommand);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (win === null) createWindow();
});
