class NumberInput {
  #value = '';
  #yearBook = document.querySelector('#info_book > input:last-of-type');
  #currentYears = new Date().getFullYear();

  constructor(element = this.#yearBook) {
    this.element = element;
  }

  #popValue() {
    this.#value = this.element.value;
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
    this.#value = this.element.value;
    this.element.addEventListener('keydown', (e) => {
      if (detectMob()) {
        e.preventDefault();
      } else {
        if (
          (e.key < '0' || e.key > '9') &&
          !['ArrowLeft', 'ArrowRight', 'Delete', 'Backspace'].includes(e.key)
        )
          e.preventDefault();
        else {
          if (
            !['ArrowLeft', 'ArrowRight', 'Delete', 'Backspace'].includes(e.key)
          ) {
            this.#value += e.key;
            this.#cekType(e);
          } else {
            if (['Delete', 'Backspace'].includes(e.key)) {
              setTimeout(() => this.#popValue(), 10);
            }
          }
        }
      }
    });
  }
}

export default NumberInput;
