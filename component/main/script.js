import { setupDialog } from '../dialog/script.js';
import {
  KEY_TYPE_CRUD,
  KEY_SESSION_CRUD,
  KEY_INDEX_BOOKS,
  KEY_DATA_BOOKS,
  KEY_PAGE_LIST,
  KEY_FILTER,
  KEY_TYPE_SEARCH,
  KEY_SEARCH_VALUE,
} from '../dialog/key_storage.js';
import { create, detail } from '../dialog/constants.js';

const main = document.querySelector('main');

main.addEventListener('click', (e) => {
  const target = e.target;
  if (target.id === 'add_book') {
    sessionStorage.setItem(KEY_TYPE_CRUD, create);
    setupDialog();
  }
});

function setupItemBook() {
  let itemBook = '';

  const dataBooks = JSON.parse(localStorage.getItem(KEY_DATA_BOOKS)) || [],
    currentPageList = sessionStorage.getItem(KEY_PAGE_LIST) * 1 || 1,
    filterType = JSON.parse(sessionStorage.getItem(KEY_FILTER)) || 0,
    searchType = JSON.parse(sessionStorage.getItem(KEY_TYPE_SEARCH)) || 0,
    searchKeyword =
      sessionStorage.getItem(KEY_SEARCH_VALUE).toLocaleLowerCase() || '',
    itemBookPerPage = 3,
    endItemBookPerPage = currentPageList * itemBookPerPage,
    startItemBookPerPage = endItemBookPerPage - itemBookPerPage;


  /******************************
   * @filterDataBooks this is a function to filter dataBooks from localStorage by filter types (chips element)
   * @SearchDataBooks this is a function to filter data from filterDataBooks by the search type (radio element)
   * @sliceDataBooks this is a function to slice data from searchDataBooks per page base on itemBookPerPage
   */ 

  const filterDataBooks = () => {
      if (filterType === 0 || filterType.index === 0) {
        return [...dataBooks].sort(
          (a, b) => new Date(b.updatedTime) - new Date(a.updatedTime)
        );
      }
      return [...dataBooks].filter(
        (book) => book.isComplete * 1 === filterType.index - 1
      );
    },
    searchDataBooks = () => {
      if (searchType === 0 || searchType.index === 0) {
        return filterDataBooks().filter((book) =>
          book['title'].toLowerCase().includes(searchKeyword)
        );
      } else if (searchType.index === 1) {
        return filterDataBooks().filter((book) =>
          book['author'].toLowerCase().includes(searchKeyword)
        );
      } else {
        return filterDataBooks().filter((book) =>
          book['hashtag'].toLowerCase().includes(searchKeyword)
        );
      }
    };

  const sumOfPage = Math.ceil(searchDataBooks().length / itemBookPerPage),
    cekFirstPage = currentPageList === 1,
    cekLastPage = currentPageList === sumOfPage;

  const SliceDataBooks = (start, end) => searchDataBooks().slice(start, end);

  SliceDataBooks(startItemBookPerPage, endItemBookPerPage).forEach((book) => {
    itemBook += `<section title="see detail book" data-id='${book['id']}'>
     <div id="cover_book" style="background-image:url(${book['cover']
       .match(/\(([^)]+)\)/)[1]
       .replace(/['"]+/g, '')})"></div>
     <div id="info_book">
       <h2>${book['title']}</h2>
       <h3>${book['author']}<span>${book['year']}</span></h3>
       <span>${
         filterType === 0 || filterType.index === 0
           ? book['updated']
           : book['created']
       }</span>
       <span>${book['hashtag']}</span>
     </div>
     <div
       id="progress_book"
       data-progress ="${book['read-progress']}"
     >
       <span style="height:${book['read-progress']}"></span>
     </div>
     </section>`;
  });

  main.innerHTML = `${itemBook}
 ${
   itemBook === ''
     ? ''
     : ` <div>
 <span id="max_prev" ${cekFirstPage ? 'class="disable"' : ''} title="${
         cekFirstPage ? "you're already reach first page" : 'go to first page'
       }">«</span>
 <span id="prev" ${cekFirstPage ? 'class="disable"' : ''}  title="${
         cekFirstPage ? 'already reach first page' : 'previous page'
       }">‹</span>
 <span>${currentPageList}</span>
 <span ${cekLastPage ? 'class="disable"' : ''} id="next" title="${
         cekLastPage ? 'already reach last page' : 'next page'
       }">›</span>
   <span ${cekLastPage ? 'class="disable"' : ''} id="max_next" title="${
         cekLastPage ? "you're already reach last page" : 'go to last page'
       }">»</span>
 </div>`
 }
  <img
  src="../../assets/ic_add.svg"
  alt="add_book"
  title="add new book"
  id="add_book"
/>`;

  const containerPageList = document.querySelector('main > div');
  if (containerPageList != null) {
    const prevMax = containerPageList.firstElementChild,
      prev = containerPageList.children[1],
      next = containerPageList.children[3],
      nextMax = containerPageList.lastElementChild;

    prevMax.addEventListener('click', function () {
      if (!this.classList.contains('disable')) {
        sessionStorage.setItem(KEY_PAGE_LIST, 1);
        setupItemBook();
      }
    });

    prev.addEventListener('click', function () {
      if (!this.classList.contains('disable')) {
        sessionStorage.setItem(KEY_PAGE_LIST, currentPageList - 1);
        setupItemBook();
      }
    });

    next.addEventListener('click', function () {
      if (!this.classList.contains('disable')) {
        sessionStorage.setItem(KEY_PAGE_LIST, currentPageList + 1);
        setupItemBook();
      }
    });

    nextMax.addEventListener('click', function () {
      if (!this.classList.contains('disable')) {
        sessionStorage.setItem(KEY_PAGE_LIST, sumOfPage);
        setupItemBook();
      }
    });
  }

  const itemBookElement = main.querySelectorAll('section');
  if (itemBookElement) {
    itemBookElement.forEach((el) => {
      el.addEventListener('click', function () {
        const indexBook = searchDataBooks().findIndex(
          (book) => book.id == this.dataset.id
        );

        sessionStorage.setItem(KEY_TYPE_CRUD, detail);
        sessionStorage.setItem(
          KEY_INDEX_BOOKS,
          dataBooks.findIndex(
            (book) => book.id == searchDataBooks()[indexBook].id
          )
        );
        sessionStorage.setItem(
          KEY_SESSION_CRUD,
          JSON.stringify(searchDataBooks()[indexBook])
        );
        setupDialog();
      });
    });
  }
}

export { setupItemBook };
