import {
  KEY_FILTER,
  KEY_PAGE_LIST,
  KEY_SEARCH_VALUE,
  KEY_TYPE_SEARCH,
} from '../dialog/key_storage.js';
import { setupItemBook } from '../main/script.js';

const select = document.querySelector('#select'),
  typeSearch = document.querySelectorAll('#type_search > input[type="radio"]'),
  inputSearch = document.querySelector('header > div:first-of-type > input'),
  btnSearch = document.querySelector('header > div:first-of-type > button'),
  chips = document.querySelectorAll('header > div:last-of-type > span'),
  typeSearchStorage = JSON.parse(sessionStorage.getItem(KEY_TYPE_SEARCH)),
  filterStorage = JSON.parse(sessionStorage.getItem(KEY_FILTER)),
  typeSearchIndex = typeSearchStorage != null ? typeSearchStorage.index : 0,
  filterIndex = filterStorage != null ? filterStorage.index : 0;

const forEachChips = (innerFunction, target = null) => {
    chips.forEach((chip, i) => {
      innerFunction(chip, i, target);
    });
  },
  toggleClassChips = (chip, i) => {
    if (i === filterIndex) chip.classList.add('active');
    else {
      chip.removeAttribute('class');
    }
  },
  eventClickChips = (chip, i, target) => {
    if (target === chip) {
      sessionStorage.setItem(
        KEY_FILTER,
        JSON.stringify({ index: i, text: chip.textContent })
      );
      chip.classList.add('active');
      btnSearch.click();
    } else {
      chip.removeAttribute('class');
    }
  },
  setupTypeSearch = (type, i) => {
    sessionStorage.setItem(
      KEY_TYPE_SEARCH,
      JSON.stringify({ index: i, value: type.value })
    );
    type.checked = true;
    select.children[0].innerText = type.value;
    inputSearch.placeholder = `enter ${type.value} here ...`;
    typeSearch[0].parentElement.removeAttribute('class');
    select.children[1].removeAttribute('class');
    btnSearch.click();
  };

function setHeader() {
  select.addEventListener('click', () => {
    typeSearch[0].parentElement.classList.toggle('show');
    select.children[1].classList.toggle('set');
  });

  btnSearch.addEventListener('click', () => {
    sessionStorage.setItem(KEY_SEARCH_VALUE, inputSearch.value);
    sessionStorage.removeItem(KEY_PAGE_LIST);
    setupItemBook();
  });

  btnSearch.addEventListener('mouseup', function () {
    this.removeAttribute('class');
  });

  btnSearch.addEventListener('mousedown', function () {
    this.classList.add('pressed');
  });

  inputSearch.addEventListener('keyup', () => btnSearch.click());
  
  typeSearch.forEach((type, i) => {
    if (typeSearchIndex === i) {
      setupTypeSearch(type, i);
    }

    type.addEventListener('change', () => {
      setupTypeSearch(type, i);
    });
  });

  forEachChips(toggleClassChips);

  document.querySelector('header').addEventListener('click', (e) => {
    const target = e.target;

    if (target === chips[0] || target === chips[1] || target === chips[2]) {
      forEachChips(eventClickChips, target);
    }
  });
}

function setOverflowChip() {
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 360) {
      const containerTypeSearch = chips[0].parentElement,
        releaseGrabbing = () => {
          isDown = false;
          containerTypeSearch.removeAttribute('class');
        };

      let isDown = false,
        startX,
        scrollLeft;

      containerTypeSearch.addEventListener('mousedown', function (e) {
        isDown = true;
        this.classList.add('grab');
        startX = e.pageX - this.offsetLeft;
        scrollLeft = this.scrollLeft;
      });

      containerTypeSearch.addEventListener('mouseleave', releaseGrabbing);
      containerTypeSearch.addEventListener('mouseup', releaseGrabbing);

      containerTypeSearch.addEventListener('mousemove', function (e) {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - this.offsetLeft,
          walk = (x - startX) * 3; //scroll-fast

        this.scrollLeft = scrollLeft - walk;
      });
    }
  });
}

export { setHeader, setOverflowChip };
