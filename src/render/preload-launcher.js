const { remote } = require('electron');

require('electron-compile/lib/initialize-renderer')
  .initializeRendererProcess(remote.getGlobal('globalCompilerHost').readOnlyMode);

require('./gmail-tray-listener');
require('./actions-listener');
