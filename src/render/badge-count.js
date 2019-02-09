const ipcRenderer = require('electron').ipcRenderer;

setInterval(() => {
  console.log('tick');
  let badge = document.getElementsByClassName('bsU')[0];
  if (badge && badge.parentElement.getElementsByTagName('a')[0].innerText === 'Inbox') {
    ipcRenderer.send('badge-count', Number(badge.innerText));
  }
}, 500);
