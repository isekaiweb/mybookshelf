import { setupDialog } from '../dialog/script.js';
import {
  KEY_TYPE_CRUD,
  KEY_SESSION_CRUD,
  KEY_INDEX_BOOKS,
  KEY_DATA_BOOKS,
} from '../dialog/key_storage.js';
import { create, update } from '../dialog/constants.js';

const main = document.querySelector('main');

main.addEventListener('click', (e) => {
  if (e.target.id == 'add_book') {
    sessionStorage.setItem(KEY_TYPE_CRUD, create);
    setupDialog();
  }
});

function setupItemBook() {
  let itemBook = '';
  const dataBooks = JSON.parse(localStorage.getItem(KEY_DATA_BOOKS)) || [];

  dataBooks.forEach((book) => {
    const progress = (book['current-page'] / book['total-page']).toFixed(2),
      total =
        progress > 100 ? '100%' : progress < 0.01 ? '0.01%' : progress + '%';
    itemBook += `<section title="see detail book" data-id='${book['id']}'>
     <div id="cover_book" style="background-image:url(${book['cover-book']
       .match(/\(([^)]+)\)/)[1]
       .replace(/['"]+/g, '')})"></div>
     <div id="info_book">
       <h2>${book['title-book']}</h2>
       <h3>${book['writer-name']}<span>${book['year-book']}</span></h3>
       <span>${book['update']}</span>
       <span>${book['hashtag-book']}</span>
     </div>
     <div
       id="progress_book"
       data-progress ="${total}"
     >
       <span style="height:${total}"></span>
     </div>
     </section>`;
  });

  main.innerHTML = `${itemBook} <img
  src="/assets/ic_add.svg"
  alt="add_book"
  title="add new book"
  id="add_book"
/>`;

  const itemBookElement = main.querySelectorAll('section');
  if (itemBookElement) {
    itemBookElement.forEach((el) => {
      el.addEventListener('click', function () {
        const indexBook = dataBooks.findIndex(
          (book) => book.id == this.dataset.id
        );

        sessionStorage.setItem(KEY_TYPE_CRUD, update);
        sessionStorage.setItem(KEY_INDEX_BOOKS, indexBook);
        sessionStorage.setItem(
          KEY_SESSION_CRUD,
          JSON.stringify(dataBooks[indexBook])
        );
        setupDialog();
      });
    });
  }
}

export { setupItemBook };
