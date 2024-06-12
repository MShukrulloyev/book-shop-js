import { fetchData } from './fetchData.js';
import {
    overlay, bagPrevBtn, bagNextBtn, bagCloseBtn,
    bagToggler, searchInput, bagElem, modalCloseBtn
} from './modules/domElements.js';
import Books from './modules/books.js';
import BagBooks from './modules/bagBooks.js';
import Slider from './modules/slider.js';
import { allowDrop, closeOverlay, dragLeave, drop } from './modules/util.js';

let booksObject = {};
let bagBooksObject = {};
let sliderObject = {};

async function init() {
    const books = await fetchData();
    const bagBooks = JSON.parse(localStorage.getItem('bag')) || [];

    if (!books) return;

    // Step 1: Create objects without dependencies
    booksObject = new Books(books);
    sliderObject = new Slider();
    bagBooksObject = new BagBooks(bagBooks);

    // Step 2: Set dependencies
    sliderObject.setDependencies(bagBooksObject, 'bagBooksObject');
    bagBooksObject.setDependencies(booksObject, 'booksObject');
    bagBooksObject.setDependencies(sliderObject, 'sliderObject');
    booksObject.setDependencies(bagBooksObject, 'bagBooksObject');
    booksObject.setDependencies(sliderObject, 'sliderObject');

    booksObject.display();
    bagBooksObject.display();

    bagElem.addEventListener('drop', (event) => drop(event, bagElem, booksObject, bagBooksObject));
    bagElem.addEventListener('dragover', (event) => allowDrop(event, bagElem));
    bagElem.addEventListener('dragleave', () => dragLeave(bagElem));

    bagToggler.addEventListener('click', () => bagBooksObject.toggle());

    searchInput.addEventListener('input', (event) => booksObject.search(event.target.value));
}

document.addEventListener('DOMContentLoaded', init);

overlay.addEventListener('click', closeOverlay);
bagPrevBtn.addEventListener('click', () => sliderObject.sliderPrev());
bagNextBtn.addEventListener('click', () => sliderObject.sliderNext());
bagCloseBtn.addEventListener('click', () => bagBooksObject.toggle());
modalCloseBtn.addEventListener('click', closeOverlay)