import { Menu, shell } from 'electron';
import { appEntry, editEntry, fileEntry, helpEntry, viewEntry } from './entries';

export class ComposeMenu {
  constructor (window, options) {
    this.window = window;
    options = options || {};
    this.app = Object.assign(appEntry(), options.app);
    this.edit = Object.assign(editEntry(process.platform), options.edit);
    this.file = Object.assign(fileEntry(() => {
      this.window.close();
    }), options.file);
    this.help = Object.assign(helpEntry(
      () => shell.openExternal('https://support.google.com/mail/topic/3395756')
    ), options.help);
    this.view = Object.assign(viewEntry(), options.view);
  }

  build () {
    let template = [
      this.file,
      this.edit,
      this.view,
      this.help
    ];
    if (process.platform === 'darwin') {
      template.unshift(this.app);
    }
    return Menu.buildFromTemplate(template);
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
