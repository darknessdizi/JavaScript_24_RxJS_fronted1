export default class WidgetController {
  constructor(edit) {
    this.edit = edit;
  }

  // ------- для первого и второго варианта сетевых запросов --------
  callback(obj) {
    // Обработка получения данных от сервера
    if (obj.status === 'ok') {
      const { messages } = obj;
      for (const item of messages) {
        const timeMessage = item.received;
        let subjectText = item.subject;
        if (subjectText.length > 20) {
          subjectText = item.subject.slice(0, 21).trim();
          subjectText = `${subjectText}...`;
        }
        const params = {
          email: item.from,
          subject: subjectText,
          time: WidgetController.getNewFormatDate(timeMessage),
        };
        this.edit.drawMessage(params);
      }
    }
  }

  // ------- для третьего варианта сетевых запросов --------
  callback2(obj) {
    // Обработка получения данных от сервера
    if (obj.status === 200) {
      const { messages } = JSON.parse(obj.response);
      for (const item of messages) {
        const timeMessage = item.received;
        let subjectText = item.subject;
        if (subjectText.length > 20) {
          subjectText = item.subject.slice(0, 21).trim();
          subjectText = `${subjectText}...`;
        }
        const params = {
          email: item.from,
          subject: subjectText,
          time: WidgetController.getNewFormatDate(timeMessage),
        }
        this.edit.drawMessage(params);
      }
    }
  }

  static getNewFormatDate(timestamp) {
    // Возвращает новый формат даты и времени
    const start = new Date(timestamp);
    const year = String(start.getFullYear());
    const month = WidgetController.getStringTime(start.getMonth() + 1);
    const date = WidgetController.getStringTime(start.getDate());
    const hours = WidgetController.getStringTime(start.getHours());
    const minutes = WidgetController.getStringTime(start.getMinutes());
    const time = `${hours}:${minutes} ${date}.${month}.${year}`;
    return time;
  }

  static getStringTime(number) {
    // Делает число двухзначным и преобразует в строку
    let seconds = String(number);
    if (seconds.length < 2) {
      seconds = `0${number}`;
    }
    return seconds;
  }
}
