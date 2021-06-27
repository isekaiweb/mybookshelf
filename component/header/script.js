const select = document.querySelector('#select'),
  typeSearch = document.querySelectorAll('#type_search > input[type="radio"]'),
  inputSearch = document.querySelector('header > div:first-of-type > input'),
  btnSearch = document.querySelector('header > div:first-of-type > button'),
  chips = document.querySelectorAll('header > div:last-of-type > span');

function setHeader() {
  select.addEventListener('click', () => {
    typeSearch[0].parentElement.classList.toggle('show');
    select.children[1].classList.toggle('set');
  });

  btnSearch.addEventListener('click', () => {});

  btnSearch.addEventListener('mouseup', function () {
    this.removeAttribute('class');
  });

  btnSearch.addEventListener('mousedown', function () {
    this.classList.add('pressed');
  });

  typeSearch.forEach((type) => {
    type.addEventListener('change', function () {
      select.children[0].innerText = this.value;
      inputSearch.placeholder = `enter ${this.value} here ...`;
      typeSearch[0].parentElement.removeAttribute('class');
      select.children[1].removeAttribute('class');

      btnSearch.click();
    });
  });

  document.querySelector('header').addEventListener('click', (e) => {
    const target = e.target;

    if (target === chips[0] || target === chips[1] || target === chips[2]) {
      chips.forEach((chip) => {
        if (target === chip) {
          chip.classList.add('active');
          btnSearch.click();
        } else {
          chip.removeAttribute('class');
        }
      });
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
