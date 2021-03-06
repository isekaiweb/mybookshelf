import { body } from '../../util/constants.js';

/********************************
 * @removeLoading this is a function to remove loading after window loaded
 * @setupLoading this is a function to setup loading
 */

const removeLoading = () => {
  const loadingContainer = body.querySelector('#loading_container');
  body.style.removeProperty('overflow');
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
    <img src="assets/ic_book_white.svg" alt="load-img" />
    <p>MyBookShelf</p>
  </div>`
  );

  setTimeout(removeLoading, 200);
}

export default setupLoading;
