import { BrowserWindow, shell } from 'electron';
import path from 'path';

export class GmailWindow extends BrowserWindow {
  constructor () {
    super({
      width: 1024,
      height: 600,
      icon: path.join(__dirname, '..', 'static', 'icon_gmail_512.png'),
      webPreferences: {
        nodeIntegration: false
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
    this.overrideNotificationBehaviour();
  }

  overrideAlertBehaviour () {
    this.webContents.executeJavaScript(
      `window.alert = (message) => console.log('Alert interrupted', message);`)
      .then((result) => {
        console.log('Alert overriden:', result);
      });
  }

  overrideNotificationBehaviour () {
    this.webContents.executeJavaScript(
      `
      let NotOld = Notification;
      Notification = function (title, props) {
        console.log('not', title, props);
        new NotOld(title, props);
      }`
    )
      .then((res) => console.log('Notification overriden:', res));
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
}
