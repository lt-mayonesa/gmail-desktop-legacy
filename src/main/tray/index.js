import path from 'path';
import { ipcMain, Menu, Tray } from 'electron';
import { ComposeWindow } from '../window';
import { ComposeMenu } from '../menu';
import { Channels, Events } from '../../ipc';

export default class GmailTray extends Tray {
  constructor (app, window) {
    super(path.join(__dirname, '..', '..', 'static', 'icon_gmail_32.png'));
    this.app = app;
    this.window = window;
    this.badgeCountListener = this.onUnreadListener;
    this.init();
  }

  init () {
    this.initMenu();
    this.initContextMenu();
    this.setToolTip('Gmail Desktop');
    this.setTitle('Gmail Desktop');
    if (this.composeWindow && !this.composeWindow.isDestroyed()) {
      this.composeWindow.destroy();
    }
    this.newComposeWindow();

    ipcMain.on(Channels.UNREAD_COUNT, (e, count) => this.badgeCountListener(e, count));
    this.window.webContents.send(Channels.GMAIL_TRAY, Events.GmailTray.CREATED);
  }

  initContextMenu () {
    this.menu = Menu.buildFromTemplate(this.menu);
    this.setContextMenu(this.menu);
  }

  initMenu () {
    this.menu = [
      {
        label: 'Compose New Message',
        click: () => {
          if (this.composeWindow && !this.composeWindow.isDestroyed()) {
            this.composeWindow.updatePosition(false);
            this.composeWindow.show();
            this.composeWindow.setSkipTaskbar(false);
          }
          this.newComposeWindow();
        }
      },
      { type: 'separator' },
      {
        label: 'Show App',
        click: () => {
          this.window.show();
        }
      },
      {
        label: 'Quit',
        click: () => {
          this.app.forceQuit();
        }
      }
    ];
  }

  destroy () {
    this.window.webContents.send(Channels.GMAIL_TRAY, Events.GmailTray.DESTROYED);
    ipcMain.removeListener(Channels.UNREAD_COUNT, this.badgeCountListener);
    if (this.composeWindow) {
      this.composeWindow.destroy();
    }
    super.destroy();
  }

  newComposeWindow () {
    this.composeWindow = new ComposeWindow();
    this.composeWindow.loadURL(`https://mail.google.com/mail/?view=cm&fs=1`);
    let menu = new ComposeMenu(this.app, this.composeWindow);
    this.composeWindow.setMenu(menu.build());
  }

  onUnreadListener (e, count) {
    console.log(count);
    if (count) {
      this.setImage(path.join(__dirname, '..', '..', 'static', 'icon_gmail_badge_32.png'));
    } else {
      this.setImage(path.join(__dirname, '..', '..', 'static', 'icon_gmail_32.png'));
    }
  }
}
