import { body, headerChildElement } from '../../util/constants.js';
import {
  KEY_FILTER,
  KEY_PAGE_LIST,
  KEY_SEARCH_VALUE,
  KEY_TYPE_SEARCH,
} from '../../util/key_storage.js';
import setupItemBook from '../main/script.js';
import detectMob from '../../util/detectMob.js';

const header = document.querySelector('body > header');

header.insertAdjacentHTML('afterbegin', headerChildElement);

const select = document.querySelector('#select'),
  typeSearch = document.querySelectorAll('#type_search > input[type="radio"]'),
  inputSearch = document.querySelector('#container_input_search > input'),
  btnSearch = document.querySelector('#container_input_search> button'),
  chips = document.querySelectorAll('header > div:last-of-type > span'),
  typeSearchStorage = JSON.parse(sessionStorage.getItem(KEY_TYPE_SEARCH)),
  filterStorage = JSON.parse(sessionStorage.getItem(KEY_FILTER)),
  typeSearchIndex = typeSearchStorage != null ? typeSearchStorage.index : 0,
  filterIndex = filterStorage != null ? filterStorage.index : 0;

/********************************
 * @forEachChips this is a function callback to foreach all chip elements and get the item inside them
 * @toggleClassChips this is a function to differentiate whether is active or not from sessionStorage filterIndex
 * @eventClickChips this is a function to set sessionStorage filterIndex and make chips change the style if active or not when chip clicked
 * @setupTypeSearch this is a function to handle if filter type search changing is
 * @setHeader this is a function to setup event for all element in header and
 * @setOverFlowChip this is a function to make chips can scroll when it overflow and only active if screen < 500px
 */

const forEachChips = (innerFunction, target) => {
    chips.forEach((chip, i) => {
      innerFunction(chip, i, target);
    });
  },
  removeClassDesktopWhenOpenedInMobile = (chip) => {
    if (detectMob()) {
      chip.classList.remove('desktop');
    }
  },
  toggleClassChips = (chip, i) => {
    if (i === filterIndex) chip.classList.add('active');
    else {
      chip.classList.remove('active');
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
      chip.classList.remove('active');
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
  forEachChips(removeClassDesktopWhenOpenedInMobile);

  document.querySelector('header').addEventListener('click', (e) => {
    const target = e.target;

    if (target === chips[0] || target === chips[1] || target === chips[2]) {
      forEachChips(eventClickChips, target);
    }
  });

  body.style.cssText = `grid-template-rows:max-content minmax(calc(${
    window.innerHeight
  }px - (${getComputedStyle(header).height} + ${getComputedStyle(header).marginTop} + 20px + 1vmax + 5em)), max-content) max-content;`;
}

function setOverflowChip() {
  window.addEventListener('resize', () => {
    if (window.innerWidth <= 500) {
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
