import { Menu } from 'electron';

export class GmailTrayMenu {
  constructor (tray, options) {
    this.tray = tray;
    options = options || {};
    this.showApp = Object.assign(
      {
        label: 'Show App',
        click: () => {
          this.tray.window.show();
        }
      },
      options.showApp
    );
    this.quit = Object.assign(
      {
        label: 'Quit',
        click: () => {
          this.tray.app.forceQuit();
        }
      },
      options.quit
    );
    this.compose = Object.assign(
      {
        label: 'Compose New Message',
        click: () => {
          if (this.tray.composeWindow && !this.tray.composeWindow.isDestroyed()) {
            this.tray.composeWindow.updatePosition(false);
            this.tray.composeWindow.show();
            this.tray.composeWindow.setSkipTaskbar(false);
          }
          this.tray.newComposeWindow();
        }
      },
      options.compose
    );
  }

  build () {
    return Menu.buildFromTemplate([
      this.compose,
      { type: 'separator' },
      this.showApp,
      this.quit
    ]);
  }

  overrideShowApp (label, callback) {
    this.overrideDefaults('showApp', label, callback);
  }

  overrideQuit (label, callback) {
    this.overrideDefaults('quit', label, callback);
  }

  overrideCompose (label, callback) {
    this.overrideDefaults('compose', label, callback);
  }

  overrideDefaults (item, label, callback) {
    if (typeof label === 'function') {
      callback = label;
      label = null;
    }
    this[item].label = label || this[item].label;
    this[item].click = callback || this[item].click;
  }
}
