import { Menu, shell } from 'electron';
import { appEntry, editEntry, fileEntry, helpEntry, viewEntry, windowEntry } from './entries';

export class GmailMenu {
  constructor (app, window) {
    this.app = app;
    this.window = window;
    this.template = [];
  }

  build () {
    this.template = [
      fileEntry(() => {
        this.app.isQuitting = true;
        this.app.quit();
      }),
      editEntry(process.platform),
      viewEntry()
    ];
    if (process.platform === 'darwin') {
      this.template.unshift(appEntry());
      this.template.push(windowEntry());
    }
    this.template.push(helpEntry(
      // () => shell.openExternal('https://github.com/Lt-Mayonesa/gmail-desktop')
      () => {
        this.window.webContents.executeJavaScript(`new Notification('test')`).then((res) => console.log('caca', res));
      }
    ));
    return Menu.buildFromTemplate(this.template);
  }

  show () {
    Menu.setApplicationMenu(this.build());
  }

  hide () {
    this.window.setMenu(null);
  }

  autohide () {
    this.window.setAutoHideMenuBar(true);
  }
}
