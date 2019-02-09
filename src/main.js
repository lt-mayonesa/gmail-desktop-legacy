import { app, session } from 'electron';
import GmailApp from './main/index';

app.forceQuit = function () {
  this.isQuitting = true;
  this.quit();
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
const gmailApp = new GmailApp(app, session);
app.on('ready', () => gmailApp.init());

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (gmailApp.mainWindow === null) {
    gmailApp.recreateWindow();
  }
});
