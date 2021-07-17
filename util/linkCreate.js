const createLink = (src, target) => {
  const a = document.createElement('a');
  a.href = src;
  a.setAttribute('target', target);
  a.click();
  a.remove();
};

export default createLink;
