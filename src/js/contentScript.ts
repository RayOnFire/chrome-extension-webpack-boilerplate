let bodyElements = document.getElementsByTagName('body');
let rootEl: HTMLBodyElement;

if (bodyElements.length != 1) throw 'No body element';

rootEl = bodyElements[0];

let mainEl = document.createElement('div');

mainEl.style.position = 'fixed';
mainEl.style.left = '0px';
mainEl.style.top = '0px';
mainEl.style.width = '5px';
mainEl.style.height = '5px';
mainEl.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
mainEl.style.zIndex = '999';
mainEl.style.transition = 'all .2s linear';

mainEl.addEventListener('mouseenter', () => {
  mainEl.style.width = '100px';
  mainEl.style.height = '100px';
});

mainEl.addEventListener('mouseleave', () => {
  mainEl.style.width = '5px';
  mainEl.style.height = '5px';
});

rootEl.appendChild(mainEl);