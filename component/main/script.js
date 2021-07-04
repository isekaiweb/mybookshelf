import { dataBooks } from '../dialog/script.js';
import { setupDialog } from '../dialog/script.js';
import { KEY_TYPE_CRUD } from '../dialog/key_storage.js';
import { create } from '../dialog/constants.js';

let itemBook = '';
const btnAddNewBook = document.getElementById('add_book');
dataBooks.forEach((book) => {
  const progress = book['total-page'] / book['current-page'],
    total = progress < 0.01 ? 0.01 : progress + '%';
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

btnAddNewBook.addEventListener('click', () => {
  sessionStorage.setItem(KEY_TYPE_CRUD, create);
  setupDialog();
});

function setupItemBook() {
  btnAddNewBook.insertAdjacentHTML('beforebegin', itemBook);
}

export { setupItemBook };
