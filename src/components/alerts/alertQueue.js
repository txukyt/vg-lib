// src/components/alertQueue.js
import { Alert } from '@/components/alerts/Alert';

export class AlertQueue {
  constructor() {
    this.node = null;
    this.stack = [];
  }

  initContainer() {
    if (!this.node) {
      const ul = document.createElement('ul');
      ul.classList.add('alert-stack', 'alert-stack--top');
      this.node = document.body.appendChild(ul);
    }
  }

  indexOf(alert, { searchText = false } = {}) {
    const compare = searchText ? alert.equals.bind(alert) : alert.same.bind(alert);
    return this.stack.findIndex(compare);
  }

  push(alert) {
    const sameTextIndex = this.indexOf(alert, { searchText: true });

    if (sameTextIndex === -1) {
      alert.open({
        parent: this.node,
        prepend: true,
        onclose: () => this.remove(alert),
      });
      this.stack.push(alert);
    } else {
      const previousAlert =
        sameTextIndex > 0 ? this.stack[sameTextIndex - 1].node : undefined;
      this.stack[sameTextIndex].highlight({ previousSibling: previousAlert });
    }

    return this;
  }

  remove(alert) {
    const index = this.indexOf(alert);
    if (index > -1) {
      this.stack.splice(index, 1);
    }
    if (this.stack.length === 0 && this.node) {
      this.node.remove();
      this.node = null;
    }
    return this;
  }

  createAlertFunction(type) {
    return (text, options) => {
      if (!this.node) {
        this.initContainer();
      }
      const alert = new Alert(text, { ...options, parent: this.node, prepend: true, type });
      this.push(alert);
    };
  }
}
