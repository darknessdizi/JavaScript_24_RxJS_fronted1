// import { Subject, catchError, of } from 'rxjs';
import { Observable, Subject, map, catchError, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import Widget from './Widget';

const parent = document.querySelectorAll('._container');

const widgetFirst = new Widget(parent[0]);
const widgetSecond = new Widget(parent[1]);
const widgetThird = new Widget(parent[2]);

// ---------- Первый вариант ( через ajax.getJSON(url) )  горячие (hot) Observable ----------

/*
  Горячие Observable существуют независимо от подписчиков
  и генерируют данные независимо от них
*/
// Subject - создаем горячий (hot) Observable
const hotObservable$ = new Subject(); // один независимый поток

setInterval(() => {
  // ajax.getJSON - поток данных сетевого запроса на заданный URL
  const stream$ = ajax.getJSON('http://localhost:9000/messages/unread')
    .pipe(catchError((error) => of(error)));
    // catchError Ловит ошибку, обрабатывает и возвращает как значение
    // события для next (в callback)
    // return of - возвращает ошибку как value для callback

  // одна подписка - один независимый поток
  // если подписаться дважды, будет отправляться два запроса на сервер
  stream$.subscribe({
    next: (value) => {
      hotObservable$.next(value);
      // при получении значения от ajax.getJSON передаем его в (hot) Observable
    },
  });
}, 5000);

hotObservable$.subscribe({ // подписка на (hot) Observable
  next: (value) => widgetFirst.controller.callback(value),
});

setTimeout(() => {
  hotObservable$.subscribe({ // подписка на (hot) Observable с задержкой
    next: (value) => widgetSecond.controller.callback(value),
    // данные пойдут от текущего момента, предыдущие для нас утеряны
  });
}, 6000);

setTimeout(() => {
  hotObservable$.subscribe({
    next: (value) => widgetThird.controller.callback(value),
  });
}, 11000);

// ---------- Второй вариант ( через ajax.getJSON(url) ) холодные (cold) Observable ----------

/*
  Холодные Observable создают источник данных и начинают генерировать значения
  только в момент подписки на них. Каждый подписчик (subscriber) получает свой
  собственный независимый поток данных
*/

// const id = setInterval(() => {
//   const stream$ = ajax.getJSON('http://localhost:9000/messages/unread') // создали поток по сетевому запросу
//     .pipe( // чтобы вытащить значение из объекта события (что-то типо массива событий)
//       // map((response) => console.log('Ответ сервера: ', response)), // обработка массива потока
//       catchError((error) => {
//         console.log('error: ', error);
//         return of(error); // вернем ошибку как value для callback
//       }),
//       // catchError - Ловит ошибку, обрабатывает и возвращает
//       // как значение события для next (в callback)
//     );

//   // Три подписки будут производить три GET запроса на сервер.
//   // Получать каждый поток будет свои данные
//   // Принимает либо callback, либо три параметра, либо объект с именами трех параметров
//   stream$.subscribe({
//     next: (value) => {
//       widgetFirst.controller.callback(value);
//       // если нужно чтобы все виджеты обрабатывали данные только одного потока
//       // надо вызывать callback в одной подписке
//       // widgetSecond.controller.callback(value);
//       // widgetThird.controller.callback(value);
//     },
//     // если убрать catchError в pipe, то ошибку будем ловить здесь
//     // error: (err) => console.log(err),
//   });

//   stream$.subscribe({ // второй поток (данные будут различаться)
//     next: (value) => widgetSecond.controller.callback(value),
//   });

//   stream$.subscribe({ // третий поток (данные будут различаться)
//     next: (value) => widgetThird.controller.callback(value),
//   });

//   // clearInterval(id);
// }, 5000);

// ---------- Третий вариант ( через XMLHttpRequest ) ----------

// const xhr = new XMLHttpRequest(); // создали сетевой запрос

// const id = setInterval(() => {
//   xhr.open('GET', 'http://localhost:9000/messages/unread');
//   xhr.send(); // отправка сетевого запроса на сервер
//   // clearInterval(id);
// }, 5000);

// const stream$ = new Observable((observer) => {
//   // создали поток и передали в него функцию
//   const handler = (event) => { // event для события load
//     console.log(event.target); // это будет XMLHttpRequest ответ сервера
//     observer.next(event.target); // объявление для обсерверов о получении новых данных
//   };

//   xhr.addEventListener('load', handler); // событие которое необходимо раздать обсерверам

//   return () => {
//     xhr.removeEventListener('load', handler);
//   };
// });

// stream$.subscribe((value) => { // подписываем виджет на поток событий
//   widgetFirst.controller.callback2(value); // при получении данных вызвать callback виджета
// });

// setTimeout(() => {
//   stream$.subscribe((value) => widgetSecond.controller.callback2(value));
// }, 6000);

// setTimeout(() => {
//   stream$.subscribe((value) => widgetThird.controller.callback2(value));
// }, 11000);
