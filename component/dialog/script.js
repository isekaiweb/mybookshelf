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

  getValue() {
    return this.#value;
  }

  setValue(newValue) {
    this.#value = newValue;
    this.value = this.#value;
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
      data-progress=""
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
</form>`;

export { NumberInput, setCover, alert, crudBook };
