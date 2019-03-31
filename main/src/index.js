const { app, BrowserWindow, globalShortcut } = require('electron');
const Positioner = require('electron-positioner');

let win;

// require('electron-react-devtools').install()
function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 150,
    transparent: true,
    skipTaskbar: true,
    fullscreenable: false,
    alwaysOnTop: true,
    title: 'Synonym Searcher',
    darkTheme: true,
    frame: false,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + '/preload.js',
    },
  });

  const positioned = new Positioner(win);
  positioned.move('bottomRight');

  win.loadURL('http://localhost:3000');
  win.webContents.openDevTools();

  win.on('close', e => {
    e.preventDefault();
    win.hide();
  });

  win.on('closed', () => {
    win = null;
  });
}

function createOrOpenWindow() {
  if (!win) {
    createWindow();
  } else {
    win.show();
    win.webContents.openDevTools();
  }
}

// Make it so it runs in the background and doesn't close.
function watchCommand() {
  console.log('Ready');
  const ret = globalShortcut.register('CommandOrControl+B', createOrOpenWindow);
  if (!ret) throw new Error('Keystroke registration failed.');
}

app.on('ready', watchCommand);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (win === null) createWindow();
});
