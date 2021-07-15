class NumberInput {
  #value = '';
  #yearBook = document.querySelector('#info_book > input:last-of-type');
  #currentYears = new Date().getFullYear();

  constructor(element = this.#yearBook) {
    this.element = element;
  }

  mustBeNumber() {
    this.element.addEventListener('input', (e) => {
      if (this.element === this.#yearBook) {
        if (this.element.value * 1 > this.#currentYears) {
          if (e.inputType === 'insertText') {
            this.element.value = this.#value;
          }
        } else {
          this.#value = this.element.value;
        }
      }
      this.element.value = this.element.value.replace(/\D+/g, '');
    });
  }
}

export default NumberInput;
