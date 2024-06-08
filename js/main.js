// Selectors
const searchInput = document.querySelector('#search-input');

const booksWrapper = document.querySelector('#books');
const sliderWrapper = document.querySelector('.bag__books');
const booksWrapperBag = document.querySelector('#bag_books_wrapper');

const bagCloseBtn = sliderWrapper.querySelector('#bag-close');
const bagPrevBtn = sliderWrapper.querySelector('#bag-prev');
const bagNextBtn = sliderWrapper.querySelector('#bag-next');
const bagToggler = document.querySelector('#bag-toggler');

const bookCountToggler = bagToggler.querySelector('#bag-book-count');

const modal = document.querySelector('#modal');
const modalCloseBtn = modal.querySelector('#modal-close');
const modalTitle = modal.querySelector('#modal-title');
const modalDescription = modal.querySelector('#modal-description');

const bookTemplate = document.querySelector('#book-template').content;
const bagBookTemplate = document.querySelector('#bag-book-template').content;

const overlay = document.querySelector('#overlay');

let thumbnailPath = '/assets/images/thumbnails';

// Fetch API
async function fetchData() {
    try {
        const response = await fetch('../assets/books.json');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('There was a problem with the fetch operation:', error);
    }
}

// Event Listeners
overlay.addEventListener('click', closeModal);

// Display Books
function displayBooks(books) {
    booksWrapper.innerHTML = '';
    books.forEach((book, bookIndex) => {
        const bookElement = bookTemplate.cloneNode(true);
        const starsParent = bookElement.querySelector('#stars');
        const starItems = bookElement.querySelectorAll('#stars>*');

        starItems.forEach((star, ind, items) => star.addEventListener('mouseover', (event) => displayStarRating(items, ind + 1)));
        starItems.forEach(star => star.addEventListener('click', (event) => saveBookRate(event, bookIndex)));
        starsParent.addEventListener('mouseleave', () => displayBookRate(bookIndex));

        bookElement.querySelector('#book').dataset.bookIndex = bookIndex;
        bookElement.querySelector('.book__img img').src = `${thumbnailPath}/${book.imageLink}`;
        bookElement.querySelector('.book__img img').alt = book.title;
        bookElement.querySelector('#bookTitle').textContent = book.title;
        bookElement.querySelector('#bookAuth').textContent = book.author;
        bookElement.querySelector('#price').textContent = book.price;

        btnAddToBag = bookElement.querySelector('#add-to-bag');
        btnShowMore = bookElement.querySelector('#show-more');

        btnShowMore.addEventListener('click', () => showModal(book))

        booksWrapper.append(bookElement);
        displayBookRate(bookIndex);
    });
}

function displayStarRating(items, rate) {
    items.forEach((item, ind) => {
        if (ind < rate) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    })
}

function saveBookRate(event, bookIndex) {
    removeRatedItem(bookIndex);

    let currentBookRate = event.target.dataset.rate;
    let rateData = JSON.parse(localStorage.getItem('rate')) || [];

    let bookItem = {
        id: bookIndex,
        rate: currentBookRate
    }

    rateData.push(bookItem);
    localStorage.setItem('rate', JSON.stringify(rateData));
}

function displayBookRate(bookIndex) {
    const bookElem = document.querySelector(`[data-book-index="${bookIndex}"]`);
    const starsItem = bookElem.querySelectorAll('#stars>*');

    let bookRate = getBookRate(bookIndex);

    displayStarRating(starsItem, bookRate);
}

function getBookRate(bookIndex) {
    let rateData = JSON.parse(localStorage.getItem('rate')) || [];
    let filteredItems = rateData.find(item => item.id === bookIndex);

    return filteredItems?.rate || 0;
}

function removeRatedItem(bookIndex) {
    let rateData = JSON.parse(localStorage.getItem('rate')) || [];
    let filteredItems = rateData.filter(item => item.id !== bookIndex);

    localStorage.setItem('rate', JSON.stringify(filteredItems));
}

function showModal(book) {
    modal.classList.add('active');
    modalTitle.textContent = book.title;
    modalDescription.textContent = book.description;
}

function closeModal() {
    modal.classList.remove('active');
}

function searchBook(books, title) {
    title = title.trim().toLowerCase();

    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(title));

    displayBooks(filteredBooks);
}

// Initialize the app
async function init() {
    const books = await fetchData();
    if (!books) return;

    displayBooks(books);

    searchInput.addEventListener('input', (event) => searchBook(books, event.target.value))
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);