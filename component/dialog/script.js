import {
  KEY_SESSION_CRUD,
  KEY_TYPE_CRUD,
  KEY_DATA_BOOKS,
  KEY_INDEX_BOOKS,
} from './key_storage.js';
import { create, update } from './constants.js';
import { setupItemBook } from '../main/script.js';

class NumberInput {
  #value = '';
  #yearBook = document.querySelector('#info_book > input:last-of-type');
  #currentYears = new Date().getFullYear();

  constructor(element = this.#yearBook) {
    this.element = element;
  }

  #popValue() {
    this.#value = [...this.#value];
    this.#value.pop();
    this.#value = this.#value.join('');
  }

  #cekType(e) {
    if (this.element === this.#yearBook) {
      if (this.#value * 1 > this.#currentYears) {
        this.#popValue();
        e.preventDefault();
      }
    } else return;
  }

  mustBeNumber() {
    this.element.addEventListener('keydown', (e) => {
      if (e.key < '0' || (e.key > '9' && e.key != 'Backspace'))
        e.preventDefault();
      else {
        if (e.key != 'Backspace') {
          this.#value += e.key;
          this.#cekType(e);
        } else {
          this.#popValue();
        }
      }
    });
  }
}

const setCover = `<div id="dialog_set_cover">
<input id="url" type="url" placeholder="paste url cover here" />
<span>||</span>
<span id="local">choose from your local data</span>
<button class="empty">cancel</button>
</div>`,
  alert = {
    failSave: `<div id="alert">
<img src="../../assets/ic_sad_emot.svg" alt="sad" />
<p>Can't Saved<br /><span
    >Total page can't be less than current page</span
  >
</p>
<button>alright</button>
</div>`,
    removeAttention: `<div id="alert">
 <img src="../../assets/ic_tentative.svg" alt="?" />
 <p>Attention!<br /><span>are you sure to remove this book?</span></p>
 <div><button>yes</button> <button>no</button></div>
</div>`,
  },
  crudBook = `<form>
  <div id="cover_book" class="stretch" style="background-image: url('../../assets/ic_cover_placeholder.svg')"></div>
  <p id="date_book" class="hide">
  </p>
  <div id="info_book">
    <input
      type="text"
      name="title-book"
      autocomplete="off"
      required
      title="title book"
      placeholder="title book"
    />
    <input
    name="writer-name"
      type="text"
      title="writer name"
      autocomplete="off"
      required
      placeholder="writer name"
    />
    <input
      type="text"
      title="year book"
      name='year-book'
      autocomplete="off"
      required
      placeholder="year book"
    />
  </div>
  <div id="status_book">
    <span>Status</span>
    <label for="current_page">current page :</label>
    <input
    name="current-page"
      type="text"
      autocomplete="off"
      required
      placeholder="0"
      id="current_page"
    />
    <label for="total_page">total page :</label>
    <input
      type="text"
      name="total-page"
      autocomplete="off"
      required
      placeholder="0"
      id="total_page"
    />
    <div
      id="progress"
      class="hide"
      title="reading progress"
    >
      <span></span>
    </div>
  </div>
  <input
    id="hashtag"
    name="hashtag-book"
    type="text"
    placeholder="#hashtag1 #hashtag2 #hashtag3"
    autocomplete="off"
    title="separate with spacing without (#)"
  />
  <div id="action_book">
    <button type="submit">
      <img src="../../assets/ic_save.svg" alt="save" />
      <span>save book</span>
    </button>
    <button type="button">
      <img src="../../assets/ic_cancel.svg" alt="cancel" />
      <span>cancel</span>
    </button>
  </div>
</form>`,
  containerDialogHTML = `<div>${crudBook}</div>`,
  body = document.querySelector('body');

const clearSessionStorage = () => {
    sessionStorage.removeItem(KEY_INDEX_BOOKS);
    sessionStorage.removeItem(KEY_TYPE_CRUD);
    sessionStorage.removeItem(KEY_SESSION_CRUD);
  },
  setObjectCoverBook = (
    object,
    coverBook,
    img = coverBook.style.backgroundImage
  ) => {
    object['cover-book'] = img;
    sessionStorage.setItem(KEY_SESSION_CRUD, JSON.stringify(object));
  },
  createAlert = (containerDialogElement, typeAlert) => {
    containerDialogElement.innerHTML = typeAlert;

    document
      .querySelector('#alert button')
      .addEventListener('click', function () {
        const text = this.textContent.toLocaleLowerCase();
        this.parentElement.parentElement.remove();

        if (text === 'alright' || text === 'no') {
          setupDialog();
        } else {
          const dataBooks = JSON.parse(localStorage.getItem(KEY_DATA_BOOKS));
          dataBooks.splice(sessionStorage.getItem(KEY_INDEX_BOOKS), 1);
        }
      });
  },
  handleFormSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target),
      coverBook = document.querySelector('form > #cover_book'),
      dataBooks = JSON.parse(localStorage.getItem(KEY_DATA_BOOKS)) || [],
      currentForm = Object.fromEntries(data.entries()),
      //this button for edit/update/save books depends on the situation
      btnPrimaryForm = document.querySelector(
        '#action_book > button:first-of-type'
      ),
      containerDialogElement =
        btnPrimaryForm.parentElement.parentElement.parentElement;

    setObjectCoverBook(currentForm, coverBook);

    if (currentForm['total-page'] * 1 < currentForm['current-page'] * 1) {
      createAlert(containerDialogElement, alert.failSave);
    } else {
      const date = new Date(),
        currentTime = `${date.toDateString()}, ${date.toLocaleTimeString()}`,
        currentIndex = sessionStorage.getItem(KEY_INDEX_BOOKS),
        startIndexChange = currentIndex || dataBooks.length,
        countChange = currentIndex != undefined ? 1 : 0,
        progress = parseFloat(
          ((currentForm['current-page'] / currentForm['total-page']) * 100)
            .toFixed(2)
            .replace('.00', '')
        );
      currentForm['status'] =
        currentForm['current-page'] * 1 === currentForm['total-page'] * 1
          ? 'Completed'
          : 'Ongoing';

      currentForm['read-progress'] =
        progress > 100 ? '100%' : progress < 0.01 ? '0.01%' : progress + '%';
      currentForm['updated'] = `Updated on ${currentTime}`;

      if (sessionStorage.getItem(KEY_TYPE_CRUD) === create) {
        currentForm['id'] = date.getTime();
        currentForm['created'] = `Created on ${currentTime}`;
      }

      body.removeAttribute('style');
      containerDialogElement.remove();

      dataBooks.splice(startIndexChange, countChange, currentForm);
      localStorage.setItem(KEY_DATA_BOOKS, JSON.stringify(dataBooks));

      setupItemBook();
      clearSessionStorage();
    }
  },
  setupCoverBook = (inputs, coverBook) => {
    const containerDialogElement = coverBook.parentElement.parentElement,
      dataTemporary = {};

    coverBook.addEventListener('click', function () {
      inputs.forEach((input) => {
        dataTemporary[`${input.name}`] = input.value;
      });
      setObjectCoverBook(dataTemporary, coverBook);

      containerDialogElement.innerHTML = setCover;
      const urlField = document.querySelector('#dialog_set_cover > #url'),
        localField = document.querySelector('#dialog_set_cover > #local'),
        btnSetCover = document.querySelector('#dialog_set_cover > button'),
        localFieldText = localField.textContent;

      let imgAddress,
        localNewText = localFieldText;

      const cekUrlValue = () => {
        setTimeout(() => {
          if (urlField.value.length > 0) {
            btnSetCover.style.backgroundColor = 'var(--fill)';
            localField.textContent = localFieldText;
            btnSetCover.textContent = 'set';

            imgAddress = urlField.value;
          } else {
            if (localNewText === localFieldText) {
              btnSetCover.removeAttribute('style');
              btnSetCover.textContent = 'cancel';
            } else {
              imgAddress = localField.dataset.localImg;
              localField.textContent = localNewText;
            }
          }
        }, 100);
      };

      urlField.addEventListener('keydown', cekUrlValue);
      urlField.addEventListener('paste', cekUrlValue);

      localField.addEventListener('click', function () {
        const inputImage = document.createElement('input');
        inputImage.setAttribute('type', 'file');
        inputImage.setAttribute('accept', 'image/png, image/gif, image/jpeg');

        inputImage.click();
        inputImage.addEventListener('change', (e) => {
          this.textContent = e.target.files[0].name;
          localNewText = this.textContent;
          imgAddress = URL.createObjectURL(e.target.files[0]);
          this.setAttribute('data-local-img', imgAddress);

          btnSetCover.style.backgroundColor = 'var(--fill)';
          btnSetCover.textContent = 'set';
          urlField.value = '';

          inputImage.remove();
        });
      });

      btnSetCover.addEventListener('click', function () {
        const currentDataTemporary = JSON.parse(
          sessionStorage.getItem(KEY_SESSION_CRUD)
        );

        if (this.textContent === 'set') {
          setObjectCoverBook(
            currentDataTemporary,
            coverBook,
            `url(${imgAddress})`
          );
        }
        this.parentElement.parentElement.remove();
        setupDialog();
      });
    });
  };

function setupDialog() {
  body.style.overflow = 'hidden';
  document
    .querySelector('body > main')
    .insertAdjacentHTML('afterend', containerDialogHTML);

  const yearBook = new NumberInput(),
    currentPage = new NumberInput(
      document.querySelector('#status_book > input:first-of-type')
    ),
    totalPage = new NumberInput(
      document.querySelector('#status_book > input:last-of-type')
    ),
    form = document.querySelector('body > div > form'),
    inputs = form.querySelectorAll('input'),
    coverBook = document.querySelector('form > #cover_book'),
    statusBook = document.querySelector('form >#status_book > span'),
    dateBook = document.querySelector('form > #date_book'),
    progressBook = document.querySelector('form  > #status_book > #progress'),
    btnPrimaryForm = document.querySelector(
      'form > #action_book > button:first-of-type'
    ),
    btnSecondaryForm = document.querySelector(
      'form > #action_book > button:last-of-type'
    ),
    dataTemporary = JSON.parse(sessionStorage.getItem(KEY_SESSION_CRUD)),
    foreachInputs = (innerFunction, disabled = true) => {
      inputs.forEach((input) => {
        innerFunction(input, disabled);
      });
    },
    fillAllInput = (input) => {
      input.value = dataTemporary[`${input.name}`];
    },
    makeDisableAllInput = (input, boolean) => {
      input.disabled = boolean;
    };

  if (dataTemporary) {
    foreachInputs(fillAllInput);
    if (sessionStorage.getItem(KEY_TYPE_CRUD) === update) {
      foreachInputs(makeDisableAllInput);
      coverBook.removeAttribute('class');

      dateBook.removeAttribute('class');
      dateBook.innerHTML = `${dataTemporary['created']}<br/>${dataTemporary['updated']}`;

      progressBook.removeAttribute('class');
      progressBook.setAttribute(
        'data-progress',
        dataTemporary['read-progress']
      );
      progressBook.firstElementChild.style.height =
        dataTemporary['read-progress'];

      statusBook.textContent = `Status ${dataTemporary['status']}`;

      btnPrimaryForm.lastElementChild.textContent = 'edit';
      btnPrimaryForm.lastElementChild.style.color = 'var(--background-dark)';
      btnPrimaryForm.firstElementChild.src = '../assets/ic_edit.svg';
      btnPrimaryForm.style.backgroundColor = 'var(--active-dark)';
      btnPrimaryForm.type = 'button';

      btnSecondaryForm.lastElementChild.textContent = 'remove';
      btnSecondaryForm.firstElementChild.src = '../assets/ic_trash.svg';
    }

    const imgDummy = document.createElement('img');
    imgDummy.src = dataTemporary['cover-book']
      .match(/\(([^)]+)\)/)[1]
      .replace(/['"]+/g, '');
    imgDummy.onload = () => {
      coverBook.style.backgroundImage = dataTemporary['cover-book'];
    };

    imgDummy.onerror = function () {
      this.remove();
      coverBook.style.backgroundImage =
        "url('../../assets/ic_cover_placeholder.svg')";
    };

    sessionStorage.removeItem(KEY_SESSION_CRUD);
  }

  btnSecondaryForm.addEventListener('click', function () {
    body.removeAttribute('style');
    this.parentElement.parentElement.parentElement.remove();

    clearSessionStorage();
  });

  if (coverBook.classList.contains('stretch')) {
    setupCoverBook(inputs, coverBook);
  }

  form.addEventListener('submit', handleFormSubmit);
  yearBook.mustBeNumber();
  currentPage.mustBeNumber();
  totalPage.mustBeNumber();
}

export { setupDialog };
