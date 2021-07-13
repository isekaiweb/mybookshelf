import { setHeader, setOverflowChip } from '../component/header/script.js';
import setupLoading from '../component/loading/script.js';

alert(`${window.innerWidth}x${window.innerHeight}`);

setupLoading();
setHeader();
setOverflowChip();