import { body } from '../dialog/constants.js';

const removeLoading = () => {
  const loadingContainer = body.querySelector('#loading_container');
  body.removeAttribute('style');
  loadingContainer.classList.add('hide');

  setTimeout(() => {
    loadingContainer.remove();
  }, 200);
};

function setupLoading() {
  body.style.overflow = 'hidden';
  body.insertAdjacentHTML(
    'beforeend',
    `   <div id="loading_container">
    <img src="/assets/ic_book_white.svg" alt="load-img" />
    <p>MyBookShelf</p>
  </div>`
  );

  setTimeout(removeLoading, 200);
}

export default setupLoading;
