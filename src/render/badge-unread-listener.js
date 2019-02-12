import { ipcRenderer } from 'electron';
import { Channels, Events } from '../ipc';
import UnreadObserver from './observer/unread-observer';

const observer = new UnreadObserver(ipcRenderer);

ipcRenderer.on(Channels.GMAIL_TRAY, (e, data) => {
  if (data === Events.GmailTray.CREATED) {
    let list = document.querySelector('.TK');
    let inboxListItem = list.querySelector('.aim');
    observer.observe(list, {
      childList: true,
      subtree: true,
      characterData: true
    });
    observer.sendIfNeeded(observer.currentValue(inboxListItem));
  } else if (data === Events.GmailTray.DESTROYED) {
    observer.disconnect();
  }
});
