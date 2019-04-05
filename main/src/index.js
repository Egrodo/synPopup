const electron = require('electron');
const url = require('url');
const path = require('path');
const { app, BrowserWindow, globalShortcut, Menu, Tray, protocol } = electron;

let win, tray;

function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 600,
    transparent: true,
    skipTaskbar: true,
    fullscreenable: false,
    alwaysOnTop: true,
    title: 'Synonym Searcher',
    darkTheme: true,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + '/preload.js',
    },
  });

  // Calculate correct monitor to show on depending on where cursor is.
  const point = electron.screen.getCursorScreenPoint();
  const rectangle = electron.screen.getDisplayNearestPoint(point).workArea;
  const display = electron.screen.getDisplayMatching(rectangle);
  win.setPosition(
    display.workArea.x + display.workArea.width - 405,
    display.workArea.y + display.workArea.height / 5 - 75,
  );


  if (process.env.NODE_ENV === 'dev') {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    const startUrl = url.format({
      pathname: 'index.html',
      protocol: 'file',
      slashes: true,
    });

    win.loadURL(startUrl);
  }

  // Disable moving / resizing window
  win.addListener('will-move', e => e.preventDefault());
  win.addListener('will-resize', e => e.preventDefault());

  win.addListener('close', e => {
    app.quit();
  });

  win.addListener('closed', () => {
    win = null;
    tray = null;
  });
}

function createOrOpenWindow() {
  if (!win) {
    createWindow();
  } else {
    // Calculate correct monitor to show on depending on where cursor is.
    const point = electron.screen.getCursorScreenPoint();
    const rectangle = electron.screen.getDisplayNearestPoint(point).workArea;
    const display = electron.screen.getDisplayMatching(rectangle);
    win.setPosition(
      display.workArea.x + display.workArea.width - 405,
      display.workArea.y + display.workArea.height / 5 - 75,
    );

    win.show();
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  } else win.show();
});

// On start of app
app.on('ready', () => {
  // Register keystroke ctrl+shift+'
  const ret = globalShortcut.register("CommandOrControl+Shift+'", createOrOpenWindow);
  if (!ret) throw new Error('Keystroke registration failed.');

  // // Initialize tray icon
  // const icoPath = url.format({
  //   pathname: path.normalize(`${__dirname}/icon.ico`),
  //   protocol: 'file',
  //   slashes: true,
  // });

  // tray = new Tray(icoPath);
  // const contextMenu = Menu.buildFromTemplate([
  //   { label: 'Open', click: createOrOpenWindow },
  //   { label: 'Quit', role: 'quit' },
  // ]);
  // tray.setToolTip('Quick Synonym Finder');
  // tray.setContextMenu(contextMenu);

  // tray.addListener('click', createOrOpenWindow);

  // Intercept React file calls and replace absolute with relative URLs.
  protocol.interceptFileProtocol('file', (request, callback) => {
    const url = request.url.substr(7);
    const fixedPath = path.normalize(`${__dirname}/../../build/${url}`);
    callback({ path: fixedPath });
  }, (err) => {
    if (err) console.error('Failed to register protocol');
  });

  createWindow();
  console.log('Ready');
});
