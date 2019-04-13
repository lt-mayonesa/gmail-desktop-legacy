import { BrowserWindow, shell } from 'electron';
import path from 'path';

export class GmailWindow extends BrowserWindow {
  constructor () {
    super({
      width: 1024,
      height: 600,
      icon: path.join(__dirname, '..', '..', 'static', 'icon_gmail_512.png'),
      webPreferences: {
        nodeIntegration: process.env.NODE_ENV === 'test',
        preload: path.join(__dirname, '..', '..', 'render', 'preload-launcher.js')
      }
    });
    this.init();
  }

  init () {
    this.initWebContents();
  }

  initWebContents () {
    this.webContents.on('did-finish-load', () => this.executeJsOverrides());
    this.webContents.on('new-window', (e, u) => this.overrideNewWindowBehaviour(e, u));
  }

  executeJsOverrides () {
    this.overrideAlertBehaviour();
  }

  overrideAlertBehaviour () {
    this.webContents.executeJavaScript(
      `window.alert = (message) => console.log('Alert interrupted by design', message);`)
      .then(() => {
        console.debug('Executed js to override window.alert');
      });
  }

  overrideNewWindowBehaviour (event, url) {
    if (/^(https:\/\/(mail|accounts)\.google\.com).*/.test(url)) {
      event.preventDefault();
      if (!this.isVisible()) {
        if (this.isMinimized()) {
          this.restore();
        }
        this.show();
      }
      // shell.openExternal(url);
    } else {
      event.preventDefault();
      shell.openExternal(url);
    }
  }

  sendMessage (channel, data) {
    if (!this.isDestroyed()) {
      this.webContents.send(channel, data);
    }
  }

  ensureShow () {
    if (this.isMinimized()) this.restore();
    this.show();
  }
}
