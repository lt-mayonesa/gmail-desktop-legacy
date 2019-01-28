import { BrowserWindow, shell } from 'electron';

export default class GmailWindow extends BrowserWindow {
  constructor (props) {
    super(props);
    this.init();
  }

  init () {
    this.initWebContents();
  }

  initWebContents () {
    this.webContents.on('did-finish-load', () => this.overrideAlertBehaviour());
    this.webContents.on('new-window', (e, u) => this.overrideNewWindowBehaviour(e, u));
  }

  overrideAlertBehaviour () {
    this.webContents.executeJavaScript(
      `window.alert = (message) => console.log('Alert interrupted', message);`)
      .then((result) => {
        console.log(result);
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
}
