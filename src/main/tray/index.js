import path from 'path';
import { ipcMain, Tray } from 'electron';
import { ComposeWindow } from '../window';
import { Channels, Events } from '../../ipc';
import { GmailTrayMenu } from './menu';

const ICONS = {
  default: 'icon_gmail_32.png',
  unread_blue: 'icon_gmail_badge_32.png',
  get (name) {
    return path.join(__dirname, '..', '..', 'static', this[name]);
  }
};

export default class GmailTray extends Tray {
  constructor (app, window) {
    super(ICONS.get('default'));
    this.app = app;
    this.window = window;
    this.toolTip = 'Gmail Desktop';
    this.title = 'Gmail Desktop';
    this.image = ICONS.get('default');
    this.menu = new GmailTrayMenu(this);
    this.init();
  }

  init () {
    this.updateContextMenu();
    this.setToolTip(this.toolTip);
    this.setTitle(this.title);
    this.initComposeWindow();
    this.initListeners();
    this.window.sendMessage(Channels.GMAIL_TRAY, Events.GmailTray.CREATED);
  }

  updateContextMenu () {
    this.setContextMenu(this.menu.build());
  }

  refresh () {
    this.updateContextMenu();
    this.setToolTip(this.toolTip);
    this.setTitle(this.title);
    this.setImage(this.image);
  }

  destroy () {
    ipcMain.removeListener(Channels.UNREAD_COUNT, this.onUnreadListener);
    this.window.sendMessage(Channels.GMAIL_TRAY, Events.GmailTray.DESTROYED);
    if (this.composeWindow && !this.composeWindow.isDestroyed()) {
      this.composeWindow.destroy();
    }
    super.destroy();
  }

  newComposeWindow () {
    this.composeWindow = new ComposeWindow();
    this.composeWindow.loadURL(`https://mail.google.com/mail/?view=cm&fs=1`);
  }

  initComposeWindow () {
    if (this.composeWindow && !this.composeWindow.isDestroyed()) {
      this.composeWindow.destroy();
    }
    this.newComposeWindow();
  }

  initListeners () {
    this.onUnreadListener = (e, count) => {
      this.image = ICONS.get(`${count > 0 ? 'unread_blue' : 'default'}`);
      this.menu.overrideShowApp(`Show App${count > 0 ? ` (${count} Unread)` : ''}`);
      this.refresh();
    };
    ipcMain.on(Channels.UNREAD_COUNT, this.onUnreadListener);
  }
}
