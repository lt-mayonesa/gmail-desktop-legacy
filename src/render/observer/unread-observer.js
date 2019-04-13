/* globals MutationObserver */
import { Channels } from '../../ipc';

export default class UnreadObserver extends MutationObserver {
  constructor (ipc) {
    // noinspection JSCheckFunctionSignatures
    super((mutations) => this.onChanges(mutations));
    this.ipc = ipc;
    this.lastValue = null;
  }

  observe (target) {
    super.observe(target, {
      childList: true,
      subtree: true,
      characterData: true
    });
    this.sendIfNeeded(this.currentValue(target));
  }

  disconnect () {
    super.disconnect();
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

  currentValue (target) {
    if (target.className === '.TK')
      target = target.querySelector('.aim');
    let badge = target.querySelector('.bsU');
    return Number(badge && badge.innerText) || 0;
  }
}
