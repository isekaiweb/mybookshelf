import {
  KEY_SESSION_CRUD,
  KEY_TYPE_CRUD,
  KEY_DATA_BOOKS,
} from './key_storage.js';
import { create } from './constants.js';

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
  alert = `<div id="alert">
<img src="../../assets/ic_sad_emot.svg" alt="sad" />
<p>Can't Saved<br /><span
    >Total page can't be less than current page</span
  >
</p>
<button>alright</button>
</div>`,
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
      placeholder="title book"
    />
    <input
    name="writer-name"
      type="text"
      autocomplete="off"
      required
      placeholder="writer name"
    />
    <input
      type="text"
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
  typeCrud = sessionStorage.getItem(KEY_TYPE_CRUD),
  dataBooks = JSON.parse(localStorage.getItem(KEY_DATA_BOOKS)) || [];

const setObjectCoverBook = (
    object,
    coverBook,
    img = coverBook.style.backgroundImage
  ) => {
    object['cover-book'] = img;
    sessionStorage.setItem(KEY_SESSION_CRUD, JSON.stringify(object));
  },
  createAlert = (containerDialogElement) => {
    containerDialogElement.innerHTML = alert;

    document
      .querySelector('#alert > button')
      .addEventListener('click', function () {
        const text = this.textContent.toLocaleLowerCase();
        if (text === 'alright' || text === 'yes') {
          this.parentElement.parentElement.remove();
          setupDialog();
        }
      });
  },
  handleFormSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.target),
      coverBook = document.querySelector('form > #cover_book'),
      currentForm = Object.fromEntries(data.entries()),
      //this button for edit/update/save books depends on the situation
      btnPrimaryForm = document.querySelector(
        '#action_book > button:first-of-type'
      ),
      containerDialogElement =
        btnPrimaryForm.parentElement.parentElement.parentElement;

    setObjectCoverBook(currentForm, coverBook);

    if (currentForm['total-page'] * 1 < currentForm['current-page'] * 1) {
      createAlert(containerDialogElement);
    } else {
      const date = new Date(),
        currentTime = `${date.toDateString()}, ${date.toLocaleTimeString()}`;
      currentForm['status'] =
        currentForm['current-page'] * 1 === currentForm['total-page'] * 1
          ? 'Completed'
          : 'Ongoing';

      if (typeCrud === create) {
        currentForm['id'] = date.getTime();
        currentForm['created'] = currentTime;
        currentForm['update'] = currentTime;
        dataBooks.push(currentForm);
      } else {
        currentForm['update'] = currentTime;
      }

      localStorage.setItem(KEY_DATA_BOOKS, JSON.stringify(dataBooks));
      containerDialogElement.remove();
      sessionStorage.removeItem(KEY_SESSION_CRUD);
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
    dataTemporary = JSON.parse(sessionStorage.getItem(KEY_SESSION_CRUD));

  if (dataTemporary) {
    inputs.forEach((input) => {
      input.value = dataTemporary[`${input.name}`];
    });
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

  document
    .querySelector('#action_book > button:last-of-type')
    .addEventListener('click', function () {
      this.parentElement.parentElement.parentElement.remove();
    });

  setupCoverBook(inputs, coverBook);

  form.addEventListener('submit', handleFormSubmit);
  yearBook.mustBeNumber();
  currentPage.mustBeNumber();
  totalPage.mustBeNumber();
}

export { setupDialog, dataBooks };
