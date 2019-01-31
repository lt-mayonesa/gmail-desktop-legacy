import { app, session } from 'electron';
import GmailTray from './tray';
import { GmailMenu, ComposeMenu } from './menu';
import { GmailWindow, ComposeWindow } from './window';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let composeWindow;
let tray;
let menubar;

const trayMenu = [
  {
    label: 'Compose New Message',
    click: () => {
      composeWindow = new ComposeWindow();
      composeWindow.loadURL(`https://mail.google.com/mail/?view=cm&fs=1`);
      let menu = new ComposeMenu(app, composeWindow);
      composeWindow.setMenu(menu.build());
    }
  },
  { type: 'separator' },
  {
    label: 'Show App',
    click: () => {
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
  mainWindow = new GmailWindow();

  mainWindow.on('closed', () => {
    if (tray && !tray.isDestroyed()) {
      tray.destroy();
    }
  });

  mainWindow.on('close', (e) => {
    if (!app.isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    } else {
      return false;
    }
  });

  mainWindow.on('show', (e) => {
    if (tray && !tray.isDestroyed()) {
      tray.destroy();
    }
  });

  mainWindow.on('hide', (e) => {
    if (!tray || tray.isDestroyed()) {
      tray = new GmailTray(trayMenu);
    }
  });

  // and load the index.html of the app.
  // mainWindow.loadURL(`file://${__dirname}/index.html`);
  mainWindow.loadURL('https://mail.google.com/');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

const secureSession = () => {
  session.defaultSession.webRequest.onHeadersReceived((details, cb) => {
    details.responseHeaders['Content-Security-Policy'] = [`default-src 'self' https://*.google.com https://*.gstatic.com 'unsafe-inline'`];
    // eslint-disable-next-line standard/no-callback-literal
    cb({
      responseHeaders: details.responseHeaders
    });
  });
};

const createAppMenu = () => {
  menubar = new GmailMenu(app, mainWindow);
  menubar.show();
  menubar.autohide();
};

const init = () => {
  secureSession();
  createWindow();
  createAppMenu();
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
