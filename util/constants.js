const update = 'UPDATE',
  create = 'CREATE',
  detail = 'DETAIL',
  setCover = `<div id="dialog_set_cover">
  <input id="url" type="url" placeholder="paste url cover here" />
  <span>||</span>
  <span id="local">choose from your local data</span>
  <button class="empty">cancel</button>
  </div>`,
  alert = {
    failSave: `<div id="alert">
  <img src="../../assets/ic_sad_emot.svg" alt="sad" />
  <p>Can't Saved<br /><span
      >Total page can't be less than current page</span
    >
  </p>
  <button>alright</button>
  </div>`,
    removeWarning: `<div id="alert">
   <img src="../../assets/ic_tentative.svg" alt="?" />
   <p>Warning!<br /><span>are you sure to remove this book?</span></p>
   <div><button>yes</button> <button>no</button></div>
  </div>`,
  },
  crudBook = `<form>
    <div id="cover_book" class="stretch" style="background-image: url('assets/ic_cover_placeholder.svg')"></div>
    <p id="date_book" class="hide">
    </p>
    <div id="info_book">
      <input
        type="text"
        name="title"
        autocomplete="off"
        required
        title="title book"
        placeholder="title book"
      />
      <input
      name="author"
        type="text"
        title="author name"
        autocomplete="off"
        required
        placeholder="author name"
      />
      <input
        type="text"
        title="year book"
        name='year'
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
      name="hashtag"
      type="text"
      placeholder="#hashtag1 #hashtag2 #hashtag3"
      autocomplete="off"
      title="separate with spacing without (#)"
    />
    <div id="action_book">
      <button type="submit">
        <img src="assets/ic_save.svg" alt="save" />
        <span>save book</span>
      </button>
      <button type="button">
        <img src="assets/ic_cancel.svg" alt="cancel" />
        <span>cancel</span>
      </button>
    </div>
  </form>`,
  headerChildElement = `<h1>MyBookShelf</h1>
  <div>
    <div id="select">
      <span>title book</span>
      <img src="assets/ic_caret.svg" alt="caret" />
    </div>
    <div id="container_input_search">
    <input type="search" placeholder="enter title book here ..." />
    <button><img src="assets/ic_search.svg" alt="search" /></button>
    </div>
    <div id="type_search">
      <input
        type="radio"
        name="type-search"
        id="0"
        value="title book"
        checked
      />
      <label for="0">title book</label>
      <input type="radio" name="type-search" id="1" value="writer name" />
      <label for="1">writer name</label>
      <input type="radio" name="type-search" id="2" value="hashtag" />
      <label for="2">hashtag</label>
    </div>
  </div>

  <div>
    <span class="active desktop">latest update</span>
    <span class="desktop">Ongoing</span>
    <span class="desktop" >Completed</span>
  </div>`,
  containerDialogHTML = `<div>${crudBook}</div>`,
  body = document.querySelector('body');

export {
  create,
  update,
  detail,
  setCover,
  body,
  containerDialogHTML,
  alert,
  headerChildElement,
};
