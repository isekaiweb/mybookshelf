import { setHeader, setOverflowChip } from '../component/header/script.js';

const addBtn = document.querySelector('main > img');

setHeader();
setOverflowChip();

addBtn.addEventListener('click', () => {
  const main = document.querySelector('main');

  main.insertAdjacentHTML('afterend', '<div></div>');
});
