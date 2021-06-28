import { setHeader, setOverflowChip } from '../component/header/script.js';

const addBtn = document.querySelector('main > img'),
  createBook = `<div>
      <div>
        <input type="text" placeholder="Title Book"/>
        <input type="text" placeholder="Writer Name"/>
        <input type="datetime" placeholder="year book" />
        <img src="../assets/ic_book.svg" alt="book"/>
      </div>
   </div>`;

setHeader();
setOverflowChip();

addBtn.addEventListener('click', () => {
  const main = document.querySelector('main');

  main.insertAdjacentHTML('afterend', createBook);
});
