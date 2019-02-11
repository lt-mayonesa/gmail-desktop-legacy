import GmailTray from './tray';
import { GmailMenu } from './menu';
import { GmailWindow } from './window';

export default class GmailApp {
  constructor (app, session) {
    this.app = app;
    this.session = session;
    this.mainWindow = null;
    this.tray = null;
    this.menubar = null;
  }

  init () {
    this.secureSession();
    this.configureWindow();
    this.createAppMenu();
    this.load();
  }

  /**
   * Method to load gmail once window is configured
   */
  load () {
    this.mainWindow.loadURL('https://mail.google.com/');
  }

  secureSession () {
    this.session.defaultSession.webRequest.onHeadersReceived((details, cb) => {
      // eslint-disable-next-line standard/no-callback-literal
      cb({
        responseHeaders: Object.assign(details.responseHeaders, {
          'Content-Security-Policy': [`default-src 'self' https://*.google.com https://*.gstatic.com https://*.ggpht.com 'unsafe-inline'`]
        })
      });
    });
  }

  configureWindow () {
    this.mainWindow = new GmailWindow();

    this.mainWindow.on('closed', () => {
      if (this.tray && !this.tray.isDestroyed()) {
        this.tray.destroy();
      }
    });

    this.mainWindow.on('close', (e) => {
      if (!this.app.isQuitting) {
        e.preventDefault();
        this.mainWindow.hide();
      } else {
        return false;
      }
    });

    this.mainWindow.on('show', () => {
      if (this.tray && !this.tray.isDestroyed()) {
        // this.tray.destroy();
      }
    });

    this.mainWindow.on('hide', () => {
      if (!this.tray || this.tray.isDestroyed()) {
        // this.tray = new GmailTray(this.app, this.mainWindow);
      }
    });
    // Open the DevTools.
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        this.tray = new GmailTray(this.app, this.mainWindow);
      }, 3000);
      this.mainWindow.webContents.openDevTools();
    }
  }

  recreateWindow () {
    this.configureWindow();
    this.load();
  }

  createAppMenu () {
    this.menubar = new GmailMenu(this.app, this.mainWindow);
    this.menubar.show();
    this.menubar.autohide();
  }
}
