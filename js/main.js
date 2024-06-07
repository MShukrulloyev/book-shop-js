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

// Display Books
function displayBooks(books) {
    booksWrapper.innerHTML = '';
    books.forEach((book, i) => {
        const bookElement = bookTemplate.cloneNode(true);
        bookElement.querySelector('#book').dataset.bookIndex = i;
        bookElement.querySelector('.book__img img').src = `${thumbnailPath}/${book.imageLink}`;
        bookElement.querySelector('.book__img img').alt = book.title;
        bookElement.querySelector('#bookTitle').textContent = book.title;
        bookElement.querySelector('#bookAuth').textContent = book.author;
        bookElement.querySelector('#price').textContent = book.price;

        btnAddToBag = bookElement.querySelector('#add-to-bag');
        btnShowMore = bookElement.querySelector('#show-more');

        btnShowMore.addEventListener('click', () => showModal(book))
        // todo: display stars

        booksWrapper.append(bookElement);
    });
}

// Initialize the app
async function init() {
    const data = await fetchData();
    if (data) {
        displayBooks(data);
    }
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);