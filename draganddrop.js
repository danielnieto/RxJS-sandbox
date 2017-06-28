const draggable = document.querySelector("#draggable");

const mousedown$ = Rx.Observable.fromEvent(draggable, "mousedown");
const mouseup$ = Rx.Observable.fromEvent(draggable, "mouseup");
const mousemove$ = Rx.Observable.fromEvent(document, "mousemove");

const mousedrag$ = mousedown$.flatMap(mdEvent => {
    const startX = mdEvent.offsetX;
    const startY = mdEvent.offsetY;

    return mousemove$.map(mmEvent => {
        return {
            left: mmEvent.clientX - startX,
            top: mmEvent.clientY - startY
        }
    }).takeUntil(mouseup$);
})

mousedrag$.subscribe(pos =>{
    draggable.style.top = pos.top + "px";
    draggable.style.left = pos.left + "px";
})