import { Menu, Tray } from 'electron';
import path from 'path';

export default class GmailTray extends Tray {
  constructor (props) {
    super(path.join(__dirname, '..', 'static', 'icon_gmail_16.png'));
    this.props = props;
    this.init();
  }

  init () {
    this.initContextMenu();
    this.setToolTip('Gmail Desktop');
    this.setTitle('Gmail Desktop');
  }

  initContextMenu () {
    this.menu = Menu.buildFromTemplate(this.props);
    this.setContextMenu(this.menu);
  }
}
