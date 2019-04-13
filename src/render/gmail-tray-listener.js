import { ipcRenderer } from 'electron';
import { Channels, Events } from '../ipc';
import UnreadObserver from './observer/unread-observer';

const unreadObserver = new UnreadObserver(ipcRenderer);

ipcRenderer.on(Channels.GMAIL_TRAY, (e, data) => {
  if (data === Events.GmailTray.CREATED) {
    let list = document.querySelector('.TK');
    unreadObserver.observe(list);
  } else if (data === Events.GmailTray.DESTROYED) {
    unreadObserver.disconnect();
  }
});
