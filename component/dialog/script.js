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

const inputYearBook = new NumberInput(),
  currentPage = new NumberInput(
    document.querySelector('#status_book > input:first-of-type')
  );


export { inputYearBook, currentPage };
