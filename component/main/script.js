import { NumberInput, setCover, alert, crudBook } from '../dialog/script.js';

const addBookBtn = document.getElementById('add_book'),
  itemBook = `<section title="see detail book">
<div id="cover_book"></div>
<div id="info_book">
  <h2></h2>
  <h3><span></span></h3>
  <span></span>
  <span></span>
</div>
<div
  id="progress_book"
  data-progress=""
>
  <span></span>
</div>
</section>`,
  KEY_SESSION_CRUD = 'crud';

function setupDialog() {
  const containerDialogHTML = `<div>${crudBook}</div>`;

  const setObjectCoverBook = (object, coverBook) => {
      object['cover-book'] = coverBook.style.backgroundImage;
    },
    handleFormSubmit = (e) => {
      e.preventDefault();
      const data = new FormData(e.target),
        coverBook = document.querySelector('form > #cover_book'),
        currentForm = Object.fromEntries(data.entries());

      setObjectCoverBook(currentForm, coverBook);
    },
    setupCoverBook = (inputs, coverBook) => {
      const containerDialogElement = coverBook.parentElement.parentElement,
        dataTemporary = {};

      coverBook.addEventListener('click', function () {
        inputs.forEach((input) => {
          dataTemporary[`${input.name}`] = input.value;
        });
        setObjectCoverBook(dataTemporary, coverBook);

        sessionStorage.setItem(KEY_SESSION_CRUD, JSON.stringify(dataTemporary));

        containerDialogElement.innerHTML = setCover;

        document
          .querySelector('#dialog_set_cover > button')
          .addEventListener('click', function () {
            this.parentElement.parentElement.remove();
            addBookBtn.click();
          });
      });
    };


  addBookBtn.addEventListener('click', function () {
    this.parentElement.insertAdjacentHTML('afterend', containerDialogHTML);
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

      coverBook.style.backgroundImage = dataTemporary['cover-book'];
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
  });
}

export { setupDialog };
