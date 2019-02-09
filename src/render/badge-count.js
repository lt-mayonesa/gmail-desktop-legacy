const ipcRenderer = require('electron').ipcRenderer;

setInterval(() => {
  let badge = document.querySelector('div#\\3A c3 .bsU');
  console.debug('tick', badge);
  if (badge) {
    ipcRenderer.send('badge-count', Number(badge.innerText));
  }
}, 1000);
