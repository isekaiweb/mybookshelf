import { setHeader, setOverflowChip } from '../component/header/script.js';
import { setupDialog } from '../component/dialog/script.js';
import { KEY_TYPE_CRUD } from '../component/dialog/key_storage.js';
import { create } from '../component/dialog/constants.js';

document.getElementById('add_book').addEventListener('click', () => {
  sessionStorage.setItem(KEY_TYPE_CRUD, create);
  setupDialog();
});

setHeader();
setOverflowChip();
