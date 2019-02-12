/* globals MutationObserver */
import { Channels } from '../../ipc';

export default class UnreadObserver extends MutationObserver {
  constructor (ipc) {
    super((mutations) => this.onChanges(mutations));
    this.ipc = ipc;
    this.lastValue = null;
  }

  onChanges (mutations) {
    let inboxListItem = mutations[0].target.querySelector('.aim');
    this.sendIfNeeded(this.currentValue(inboxListItem));
  }

  sendIfNeeded (value) {
    if (value !== this.lastValue) {
      this.ipc.send(Channels.UNREAD_COUNT, value);
      this.lastValue = value;
    }
  }

  currentValue (item) {
    let badge = item.querySelector('.bsU');
    return Number(badge && badge.innerText) || 0;
  }
}
