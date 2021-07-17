import { footerHTML } from '../../util/constants.js';
import createLink from '../../util/linkCreate.js';

const footer = document.querySelector('body > footer');

function setupFooter() {
  footer.innerHTML = footerHTML;
  const container = footer.querySelector('p'),
    span = footer.querySelector('p > span'),
    img = footer.querySelector('p > img');

  container.addEventListener('mouseover', function () {
    span.classList.add('hover');
    img.src = `assets/ic_github_hover.svg`;
  });

  container.addEventListener('mouseleave', function () {
    span.removeAttribute('class');
    img.src = `assets/ic_github.svg`;
  });

  container.addEventListener('click', () =>
    createLink('https://github.com/isekaiweb', '_blank')
  );
}

export default setupFooter;
