// case.0
const clickEvent$ = fromEvent(document, 'click'); // this observable is hot

// case.1
const clickEvent$ = new Subject<Event>(); // normal Subject
document.addEventListener('click', (event) => {
  console.log('clicked');
  clickEvent$.next(event);
});

// case.2
const clickEvent$ = new ReplaySubject<Event>(1); // bufferSize is 1
document.addEventListener('click', (event) => {
  console.log('clicked');
  clickEvent$.next(event);
});

// case.3
const clickEvent$ = new RehaviorSubject<Event>(null); // initial value is null
document.addEventListener('click', (event) => {
  console.log('clicked');
  clickEvent$.next(event);
});

// clickEvent$.subscribe(console.log);

// log to see if this operator has been called
const isTrusted$ = clickEvent$.pipe(
  map((event) => {
    console.log('isTrusted', event.isTrusted);
    return event.isTrusted;
  })
);

// delay 5s then subscribe
setTimeout(() => {
  console.log('start');
  isTrusted$.subscribe(console.log);
}, 5000);

// 测试目标：
// - 在开始订阅前发出事件（ 点击至少一次页面并看到控制台打印的 clicked ）
// - 订阅后数据流是否有反应（ 是否有 Operator 和 Subsription 中的打印结果、值是什么 ）

// case.0 & 1: 订阅后无反应。说明订阅前发出事件，在订阅后无法接到数据，且因为没有事件触发时没有订阅者所以不会触发中间的过程
// case.2 & 3: 订阅后自动打印 isTrusted 及结果，且结果为最后一次点击产生的数据。说明这两种 Subject 都能至少保留一次最近数据，在被订阅时拿到最新事件激活整个流

// 若在测试前不模拟事件发生（ 不做任何点击 ），等待订阅后观察控制台的打印结果
// case.2: 订阅后无反应。说明 ReplaySubject 至少需要一次事件，否则无数据
// case.3: 订阅后自动打印 isTrusted 及结果，且结果为 undefined。说明 BehaviorSubject 有初始化默认值的作用

// 结论：
// - Observable 和 Subject 会在订阅前丢失流中的数据，只有订阅之后再收到新事件才会进行计算
// - ReplaySubject 和 RehaviorSubject 都会缓存最新一次的数据，即使在事件发生之后再订阅，仍然可以且会自动根据最新的数据进行计算
// - 若没有事件发生，RehaviorSubject 会根据初始化的默认值进行计算，其余三者则不会有响应
