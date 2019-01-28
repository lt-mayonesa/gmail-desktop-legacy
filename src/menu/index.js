import { Menu } from 'electron';

export default class GmailMenu {
  constructor (app) {
    this.app = app;
    this.template = [
      {
        label: 'File',
        submenu: [
          {
            label: 'Quit',
            accelerator: 'Control+Q',
            click: () => {
              this.app.isQuitting = true;
              this.app.quit();
            }
          }
        ]
      },
      {
        label: 'Edit',
        submenu: [
          { role: 'undo' },
          { role: 'redo' },
          { type: 'separator' },
          { role: 'cut' },
          { role: 'copy' },
          { role: 'paste' },
          { role: 'pasteandmatchstyle' },
          { role: 'delete' },
          { role: 'selectall' }
        ]
      },
      {
        label: 'View',
        submenu: [
          { type: 'separator' },
          { role: 'resetzoom' },
          { role: 'zoomin' },
          { role: 'zoomout' },
          { type: 'separator' },
          { role: 'togglefullscreen' }
        ]
      },
      {
        role: 'help',
        submenu: [
          {
            label: 'Learn More',
            click () {
              require('electron')
                .shell
                .openExternal('https://electronjs.org');
            }
          }
        ]
      }
    ];

    if (process.platform === 'darwin') {
      this.template.unshift({
        label: this.app.getName(),
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      });

      // Edit menu
      this.template[1].submenu.push(
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startspeaking' },
            { role: 'stopspeaking' }
          ]
        }
      );

      // Window menu
      this.template[3].submenu = [
        { role: 'close' },
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' }
      ];
    }
  }

  getMenu () {
    return Menu.buildFromTemplate(this.template);
  }
}
