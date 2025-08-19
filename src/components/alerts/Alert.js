// src/components/alerts/Alert.js
import { hash } from '@/utils/hash';
import { uid } from '@/utils/uid';

export class Alert {
  constructor(text, options = {}) {
    this.text = text;
    this.config = {
      autoClose: false,
      prepend: false,
      type: 'error',
      parent: null,
      ...options,
    };
    this.contentHash = hash(text);
    this.uid = uid();
    this.node = null;
    this.autoCloseInterval = null;
  }

  same(alert) {
    return this.uid === alert.getUid();
  }

  equals(alert) {
    return this.contentHash === alert.getContentHash() &&
           this.config.type === alert.getType();
  }

  getContentHash() {
    return this.contentHash;
  }

  getType() {
    return this.config.type;
  }

  getUid() {
    return this.uid;
  }

  highlight({ previousSibling } = {}) {
    const parent = this.config.parent;
    parent.removeChild(this.node);

    if (this.config.prepend) {
      if (previousSibling) {
        parent.insertBefore(this.node, previousSibling);
      } else {
        parent.appendChild(this.node);
      }
    } else {
      if (previousSibling) {
        parent.insertBefore(this.node, previousSibling.nextSibling);
      } else {
        parent.insertBefore(this.node, parent.firstChild);
      }
    }

    this.node.classList.remove('alert--shake');
    void this.node.offsetWidth; // reflow
    this.node.classList.add('alert--shake');

    return this;
  }

  open(options = {}) {
    Object.assign(this.config, options);

    const node = document.createElement('li');
    node.setAttribute('tabindex', '-1');
    node.setAttribute('role', 'alert');
    node.classList.add('alert', `alert--${this.config.type}`);

    const esInteractivo = /<(a|input|button)/i.test(this.text);
    if (esInteractivo) {
      node.innerText = this.text;
    } else {
      node.innerHTML = this.text;
    }

    if (this.config.prepend) {
      this.config.parent.insertBefore(node, this.config.parent.firstChild);
    } else {
      this.config.parent.appendChild(node);
    }

    node.addEventListener('click', () => this.close());

    this.node = node;

    if (this.config.autoClose) {
      this.autoCloseInterval = setTimeout(() => this.close(), 7000);
    }

    return this;
  }

  close() {
    if (this.node?.parentNode) {
      this.config.parent.removeChild(this.node);
    }
    if (typeof this.config.onclose === 'function') {
      this.config.onclose();
    }
    if (this.autoCloseInterval) {
      clearTimeout(this.autoCloseInterval);
    }
    return this;
  }
}
