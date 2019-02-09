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
        this.app.forceQuit();
      }),
      editEntry(process.platform),
      viewEntry()
    ];
    if (process.platform === 'darwin') {
      this.template.unshift(appEntry());
      this.template.push(windowEntry());
    }
    this.template.push(helpEntry(
      () => shell.openExternal('https://github.com/Lt-Mayonesa/gmail-desktop')
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
