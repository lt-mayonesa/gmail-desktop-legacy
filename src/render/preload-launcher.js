const { remote } = require('electron');

require('electron-compile/lib/initialize-renderer')
  .initializeRendererProcess(remote.getGlobal('globalCompilerHost').readOnlyMode);

require('./observer/unread-observer');
require('./badge-unread-listener');
