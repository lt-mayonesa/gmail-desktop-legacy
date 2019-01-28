import { app, Menu, session } from 'electron';
import GmailWindow from './window';
import GmailTray from './tray';
import GmailMenu from './menu';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let tray;
let menubar = new GmailMenu(app);

const trayMenu = [
  {
    label: 'Show App',
    click: () => {
      if (tray && !tray.isDestroyed()) {
        tray.destroy();
      }
      mainWindow.show();
    }
  },
  {
    label: 'Quit',
    click: () => {
      app.isQuitting = true;
      app.quit();
    }
  }
];

const createWindow = () => {
  mainWindow = new GmailWindow({
    width: 1024,
    height: 600,
    webPreferences: {
      nodeIntegration: false
    }
  });

  mainWindow.on('closed', () => {
    if (tray && !tray.isDestroyed()) {
      tray.destroy();
    }
  });

  mainWindow.on('close', (e) => {
    console.log(app.isQuitting);
    if (!app.isQuitting) {
      e.preventDefault();
      mainWindow.hide();
      if (!tray || tray.isDestroyed()) {
        tray = new GmailTray(trayMenu);
      }
    } else {
      return false;
    }
  });

  // and load the index.html of the app.
  // mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.loadURL('https://mail.google.com/');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();

  // tray = new GmailTray(menu);
};

const secureSession = () => {
  session.defaultSession.webRequest.onHeadersReceived((details, calback) => {
    details.responseHeaders['Content-Security-Policy'] = [`default-src 'self' https://*.google.com 'unsafe-inline'`];
    calback({
      responseHeaders: details.responseHeaders
    });
  });
};

const createAppMenu = () => {
  Menu.setApplicationMenu(menubar.getMenu());
};

const init = () => {
  createWindow();
  createAppMenu();
  secureSession();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', init);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
