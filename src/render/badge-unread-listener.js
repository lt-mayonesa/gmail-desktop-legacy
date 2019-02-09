import { ipcRenderer } from 'electron';
import { Channels, Events } from '../ipc';

let lastVal = null;
let interval = null;

ipcRenderer.on(Channels.GMAIL_TRAY, (e, data) => {
  if (data === Events.GmailTray.CREATED) {
    interval = setInterval(() => {
      const inboxListItem = document.querySelector('.TK .aim');
      const badge = inboxListItem.querySelector('.bsU');
      let unreadCount = Number(badge && badge.innerText) || 0;
      if (unreadCount !== lastVal) {
        ipcRenderer.send(Channels.UNREAD_COUNT, unreadCount);
        lastVal = unreadCount;
      }
    }, 1000);
  } else if (data === Events.GmailTray.DESTROYED) {
    clearInterval(interval);
  }
});
