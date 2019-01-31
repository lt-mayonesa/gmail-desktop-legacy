import { Menu, shell } from 'electron';
import { appEntry, editEntry, fileEntry, helpEntry, viewEntry } from './entries';

export class ComposeMenu {
  constructor (app, window) {
    this.app = app;
    this.window = window;
    this.template = [];
  }

  build () {
    this.template = [
      fileEntry(() => {
        this.window.close();
      }),
      editEntry(process.platform),
      viewEntry()
    ];
    if (process.platform === 'darwin') {
      this.template.unshift(appEntry());
    }
    this.template.push(helpEntry(
      () => shell.openExternal('https://support.google.com/mail/topic/3395756')
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
