import { BrowserWindow, screen } from 'electron';
import path from 'path';
import { ComposeMenu } from '../menu';

const WIDTH = 600;
const HEIGHT = 500;

export class ComposeWindow extends BrowserWindow {
  constructor () {
    super({
      width: WIDTH,
      height: HEIGHT,
      icon: path.join(__dirname, '..', '..', 'static', 'icon_compose.png'),
      webPreferences: {
        nodeIntegration: process.env.NODE_ENV === 'test'
      },
      show: false,
      skipTaskbar: true,
      autoHideMenuBar: true
    });
    let menu = new ComposeMenu(this);
    this.setMenu(menu.build());
  }

  calculateInitialPosition (point) {
    let display = screen.getDisplayNearestPoint(point);
    let x = point.x - (WIDTH / 2);
    let y = point.y - (HEIGHT / 2);

    this.startPoint = {
      x: point.x <= display.size.width / 2 ? Math.max(x, 100) : Math.min(x, display.size.width - 100),
      // y: point.y <= display.size.height / 2 ? Math.max(y, 60) : Math.min(y, display.size.height - 60)
      y: y
    };
  }

  updatePosition (animate) {
    this.calculateInitialPosition(screen.getCursorScreenPoint());
    this.setPosition(this.startPoint.x, this.startPoint.y, animate);
  }
}
