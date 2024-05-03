import WidgetEditor from './components/editor/WidgetEditor';
import WidgetController from './components/controller/WidgetController';

export default class Widget {
  constructor(conteiner) {
    this.edit = null;
    this.controller = null;

    this.init(conteiner);
  }

  init(conteiner) {
    this.edit = new WidgetEditor(conteiner);
    this.controller = new WidgetController(this.edit);
  }
}
