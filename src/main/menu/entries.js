export const fileEntry = (onQuit) => {
  return {
    label: 'File',
    submenu: [
      {
        label: 'Quit',
        accelerator: 'Control+Q',
        click: () => onQuit()
      }
    ]
  };
};

export const editEntry = (os) => {
  let entry = {
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
  };

  if (os === 'darwin') {
    entry.submenu.push({ type: 'separator' });
    entry.submenu.push({
      label: 'Speech',
      submenu: [
        { role: 'startspeaking' },
        { role: 'stopspeaking' }
      ]
    });
  }

  return entry;
};

export const viewEntry = () => {
  return {
    label: 'View',
    submenu: [
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  };
};

export const windowEntry = () => {
  return {
    label: 'Window',
    submenu: [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ]
  };
};

export const helpEntry = (onHelp) => {
  return {
    role: 'help',
    submenu: [
      {
        label: 'Learn More',
        click: () => onHelp()
      },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'about' }
    ]
  };
};

export const appEntry = () => {
  return {
    label: 'Gmail Desktop',
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
  };
};
