import BaseWindowEditor from './BaseWindowEditor';
import widgetHTML from './widget.html';

export default class WidgetEditor extends BaseWindowEditor {
  constructor(conteiner) {
    super();
    this.bindToDOM(conteiner);
    this.table = null;

    this.init();
  }

  init() {
    this.container.insertAdjacentHTML('afterbegin', widgetHTML);
    this.table = this.container.querySelector('.widget-table');
  }

  drawMessage({ email, subject, time } = {}) {
    // Отрисовывает новое сообщение
    const options = {
      type: 'tr',
      className: 'message',
      append: false,
    };
    const tr = WidgetEditor.addTagHTML(this.table, options);

    const messageFrom = WidgetEditor.addTagHTML(
      tr, { className: 'message-from', type: 'td' },
    );
    messageFrom.textContent = email;

    const messageSubject = WidgetEditor.addTagHTML(
      tr, { className: 'message-subject', type: 'td' },
    );
    messageSubject.textContent = subject;

    const messageReceived = WidgetEditor.addTagHTML(
      tr, { className: 'message-received', type: 'td' },
    );
    messageReceived.textContent = time;
  }
}
