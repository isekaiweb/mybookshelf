import {
  KEY_SESSION_CRUD,
  KEY_TYPE_CRUD,
  KEY_DATA_BOOKS,
  KEY_INDEX_BOOKS,
} from './key_storage.js';

import {
  create,
  update,
  detail,
  containerDialogHTML,
  setCover,
  alert,
  body,
} from './constants.js';

import { setupItemBook } from '../main/script.js';

import NumberInput from './numberInput.js';

const removeStyleBody = (containerDialogElement) => {
    body.removeAttribute('style');
    containerDialogElement.remove();
  },
  clearSessionStorage = () => {
    sessionStorage.removeItem(KEY_INDEX_BOOKS);
    sessionStorage.removeItem(KEY_TYPE_CRUD);
    sessionStorage.removeItem(KEY_SESSION_CRUD);
  },
  setObjectCoverBook = (
    object,
    coverBook,
    img = coverBook.style.backgroundImage
  ) => {
    object['cover'] = img;
    sessionStorage.setItem(KEY_SESSION_CRUD, JSON.stringify(object));
  },
  createAlert = (containerDialogElement, typeAlert) => {
    containerDialogElement.innerHTML = typeAlert;

    document.querySelectorAll('#alert button').forEach((btn) => {
      btn.addEventListener('click', function () {
        const text = this.textContent.toLocaleLowerCase();

        if (text === 'alright' || text === 'no') {
          setupDialog();
        } else {
          const currentIndex = sessionStorage.getItem(KEY_INDEX_BOOKS),
            newDataBooks = JSON.parse(localStorage.getItem(KEY_DATA_BOOKS));
          newDataBooks.splice(currentIndex, 1);

          localStorage.setItem(KEY_DATA_BOOKS, JSON.stringify(newDataBooks));
          setupItemBook();
          clearSessionStorage();
        }

        removeStyleBody(containerDialogElement);
      });
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
      date = new Date(),
      currentTime = `${date.toDateString()}, ${date.toLocaleTimeString()}`,
      currentIndex = sessionStorage.getItem(KEY_INDEX_BOOKS),
      startIndexChange = currentIndex || dataBooks.length,
      countChange = currentIndex != undefined ? 1 : 0,
      progress = parseFloat(
        ((currentForm['current-page'] / currentForm['total-page']) * 100)
          .toFixed(2)
          .replace('.00', '')
      ),
      hash = currentForm['hashtag'].replaceAll('#', '').trim().split(' '),
      containerDialogElement =
        btnPrimaryForm.parentElement.parentElement.parentElement;

    currentForm['year'] = currentForm['year'] * 1;
    currentForm['updatedTime'] = date;
    currentForm['hashtag'] =
      hash.length > 0 && hash != '' ? hash.map((i) => `#${i}`).join(' ') : '';
    currentForm['isComplete'] =
      currentForm['current-page'] * 1 === currentForm['total-page'] * 1
        ? true
        : false;

    currentForm['read-progress'] =
      progress > 100 ? '100%' : progress < 0.01 ? '0.01%' : progress + '%';
    currentForm['updated'] = `Updated on ${currentTime}`;
    currentForm['id'] =
      currentIndex != undefined ? dataBooks[currentIndex].id : date.getTime();
    currentForm['created'] =
      currentIndex != undefined
        ? dataBooks[currentIndex].created
        : `Created on ${currentTime}`;
    setObjectCoverBook(currentForm, coverBook);

    if (currentForm['total-page'] * 1 < currentForm['current-page'] * 1) {
      createAlert(containerDialogElement, alert.failSave);
    } else {
      dataBooks.splice(startIndexChange, countChange, currentForm);
      localStorage.setItem(KEY_DATA_BOOKS, JSON.stringify(dataBooks));

      setupItemBook();
      clearSessionStorage();
      removeStyleBody(containerDialogElement);
    }
  },
  setupCoverBook = (inputs, coverBook, containerDialogElement) => {
    const dataTemporary = {};

    coverBook.addEventListener('click', function () {
      inputs.forEach((input) => {
        dataTemporary[`${input.name}`] = input.value;
      });
      setObjectCoverBook(
        JSON.parse(sessionStorage.getItem(KEY_SESSION_CRUD)) || dataTemporary,
        coverBook
      );

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
        const inputImage = document.createElement('input'),
          fileReader = new FileReader();
        inputImage.setAttribute('type', 'file');
        inputImage.setAttribute('accept', 'image/png, image/gif, image/jpeg');

        inputImage.click();
        inputImage.addEventListener('change', (e) => {
          this.textContent = e.target.files[0].name;
          localNewText = this.textContent;
          fileReader.readAsDataURL(e.target.files[0]);
          fileReader.addEventListener('load', (e) => {
            imgAddress = e.target.result;
            this.setAttribute('data-local-img', imgAddress);
            console.log(imgAddress);
          });

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
    containerDialogElement = document.querySelector('body > div'),
    progressBook = document.querySelector('form  > #status_book > #progress'),
    btnPrimaryForm = document.querySelector(
      'form > #action_book > button:first-of-type'
    ),
    btnSecondaryForm = document.querySelector(
      'form > #action_book > button:last-of-type'
    ),
    dataTemporary = JSON.parse(sessionStorage.getItem(KEY_SESSION_CRUD)),
    typeCrud = sessionStorage.getItem(KEY_TYPE_CRUD),
    foreachInputs = (innerFunction, disabled = true) => {
      inputs.forEach((input) => {
        innerFunction(input, disabled);
      });
    },
    eventChangeInput = (input) => {
      if (input.id === 'current_page' || input.id === 'total_page') {
        input.addEventListener('keyup', () => {
          const currentPage = document.querySelector(
              'form > #status_book > #current_page'
            ).value,
            totalPage = document.querySelector(
              'form > #status_book > #total_page'
            ).value,
            progress = parseFloat(
              ((currentPage / totalPage) * 100).toFixed(2).replace('.00', '')
            );
          progressBook.dataset.progress =
            progress > 100
              ? '100%'
              : progress < 0.01
              ? '0.01%'
              : progress + '%';
          progressBook.firstElementChild.style.height =
            progressBook.dataset.progress;
        });
      }
    },
    fillAllInput = (input) => {
      input.value = dataTemporary[`${input.name}`];
    },
    makeDisableAllInput = (input, boolean) => {
      input.disabled = boolean;
      if (input.value === '') input.remove();
    },
    removeClassForm = () => {
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

      statusBook.textContent = `Status ${
        dataTemporary['isComplete'] ? 'Complete' : 'Ongoing'
      }`;
    },
    fillImage = () => {
      const imgDummy = document.createElement('img');
      imgDummy.src = dataTemporary['cover']
        .match(/\(([^)]+)\)/)[1]
        .replace(/['"]+/g, '');
      imgDummy.onload = () => {
        coverBook.style.backgroundImage = dataTemporary['cover'];
      };

      imgDummy.onerror = function () {
        this.remove();
        coverBook.style.backgroundImage =
          "url('../../assets/ic_cover_placeholder.svg')";
      };
    };

  if (dataTemporary) {
    foreachInputs(fillAllInput);
    fillImage();
    if (typeCrud === detail) {
      foreachInputs(makeDisableAllInput);
      removeClassForm();

      btnPrimaryForm.lastElementChild.textContent = 'edit';
      btnPrimaryForm.lastElementChild.style.color = 'var(--background-dark)';
      btnPrimaryForm.firstElementChild.src = '/assets/ic_edit.svg';
      btnPrimaryForm.style.backgroundColor = 'var(--passive-dark)';
      btnPrimaryForm.type = 'button';

      btnSecondaryForm.lastElementChild.textContent = 'remove';
      btnSecondaryForm.firstElementChild.src = '/assets/ic_trash.svg';

      btnPrimaryForm.addEventListener('click', function () {
        sessionStorage.setItem(KEY_TYPE_CRUD, update);
        removeStyleBody(containerDialogElement);
        containerDialogElement.remove();
        setupDialog();
      });
    } else if (typeCrud === update) {
      removeClassForm();
      foreachInputs(eventChangeInput);
      coverBook.classList.add('editable');
      btnPrimaryForm.firstElementChild.src = '/assets/ic_update.svg';
      btnPrimaryForm.lastElementChild.textContent = 'update book';
    } else {
      sessionStorage.removeItem(KEY_SESSION_CRUD);
    }
  }

  body.addEventListener('click', (e) => {
    if (e.target === containerDialogElement && typeCrud === detail) {
      removeStyleBody(containerDialogElement);
      clearSessionStorage();
    }
  });

  btnSecondaryForm.addEventListener('click', () => {
    if (typeCrud === detail) {
      createAlert(containerDialogElement, alert.removeWarning);
    } else {
      removeStyleBody(containerDialogElement);
      clearSessionStorage();
    }
  });

  if (
    coverBook.classList.contains('stretch') ||
    coverBook.classList.contains('editable')
  ) {
    setupCoverBook(inputs, coverBook, containerDialogElement);
  }

  form.addEventListener('submit', handleFormSubmit);
  yearBook.mustBeNumber();
  currentPage.mustBeNumber();
  totalPage.mustBeNumber();
}

export { setupDialog };
