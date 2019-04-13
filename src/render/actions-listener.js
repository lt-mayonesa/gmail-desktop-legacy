import { ipcRenderer } from 'electron';
import { Channels, Events } from '../ipc';

ipcRenderer.on(Channels.ACTIONS, (e, data) => {
  switch (data) {
    case Events.Actions.SHOW_DRAFTS:
      window.location.href = '#drafts';
      break;
    case Events.Actions.SHOW_INBOX:
      window.location.href = '#inbox';
      break;
  }
});
