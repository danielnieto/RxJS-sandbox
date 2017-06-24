const startButton = document.querySelector("#start");
const stopButton = document.querySelector("#stop");
const resetButton = document.querySelector("#reset");

const start$ = Rx.Observable.fromEvent(startButton, 'click');
const stop$ = Rx.Observable.fromEvent(stopButton, 'click');
const reset$ = Rx.Observable.fromEvent(resetButton, 'click');

const minutes = document.querySelector("#minutes");
const seconds = document.querySelector("#seconds");
const milliseconds = document.querySelector("#milliseconds");

const render = (time) => {
    minutes.innerHTML = time.minutes;
    seconds.innerHTML = time.seconds;
    milliseconds.innerHTML = time.milliseconds;
}

const toTime = (time) => {
    return {
        milliseconds: Math.floor(time%100),
        seconds: Math.floor((time/100) % 60),
        minutes: Math.floor(time/6000),
    }
};

const interval$ = Rx.Observable.interval(10);

const stopOrReset$ = Rx.Observable.merge(stop$, reset$);

const pausible$ = interval$.takeUntil(stopOrReset$);

const initial = 0;
const inc = acc => acc + 1;
const reset = acc => initial;

const incOrReset$ = Rx.Observable.merge(pausible$.mapTo(inc), reset$.mapTo(reset));

const app$ = start$
                .switchMapTo(incOrReset$)
                .startWith(initial)
                .scan((acc, currFunc) => currFunc(acc))
                .map(toTime)
                .subscribe(val => render(val));