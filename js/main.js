// Selectors
const searchInput = document.querySelector('#search-input');

const bagElem = document.querySelector('.bag');
const bagTotalPriceElem = bagElem.querySelector('#totalPrice');

const booksWrapper = document.querySelector('#books');
const sliderWrapper = document.querySelector('.bag__books');
const booksWrapperBag = document.querySelector('#bag_books_wrapper');

const bagCloseBtn = bagElem.querySelector('#bag-close');
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

let books = [];
let bagBooks = [];

let offset = 1;
let minOffset = 1;

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
overlay.addEventListener('click', closeOverlay);
bagPrevBtn.addEventListener('click', sliderPrev);
bagNextBtn.addEventListener('click', sliderNext);
bagCloseBtn.addEventListener('click', toggleBag);

// main functions
function createThumbnailPath(imgName = null) {
    if (!imgName) imgName = 'default.jpg';
    return `${thumbnailPath}/${imgName}`;
}

// slider functions
function sliderPrev() {
    if (offset === minOffset) return;

    offset--;
    activateBagButtons();
    sliderTransform();
}

function sliderNext() {
    if (offset === bagBooks.length) return;

    offset++;
    activateBagButtons();
    sliderTransform();
}

function sliderTransform() {
    let bagBooksLength = bagBooks.length;

    if (offset > bagBooksLength) offset = bagBooksLength;

    let translateX = (100 / bagBooksLength) * (offset - 1);
    booksWrapperBag.style.transform = `translateX(-${translateX}%)`;
}

// Display Books
function displayBooks(books) {
    booksWrapper.innerHTML = '';

    books.forEach((book) => {
        const bookElement = bookTemplate.cloneNode(true);
        const starsParent = bookElement.querySelector('#stars');
        const starItems = bookElement.querySelectorAll('#stars>*');
        const addToBagBtn = bookElement.querySelector('#add-to-bag');
        const bookImage = bookElement.querySelector('.book__img img');

        const bookIndex = book.id;

        starItems.forEach((star, ind, items) => star.addEventListener('mouseover', (event) => displayStarRating(items, ind + 1)));
        starItems.forEach(star => star.addEventListener('click', (event) => saveBookRate(event, bookIndex)));

        starsParent.addEventListener('mouseleave', () => displayBookRate(bookIndex));
        addToBagBtn.addEventListener('click', () => {
            addToBag(bookIndex);
            displayBagBooks();
        });

        bookImage.addEventListener('dragstart', (event) => drag(event, bookIndex, bookImage));

        bookElement.querySelector('#book').dataset.bookIndex = bookIndex;
        bookImage.src = createThumbnailPath(book?.imageLink);
        bookImage.alt = book.title;
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

// display bag books
function displayBagBooks(bagBooks = null) {
    if (bagBooks === null) {
        bagBooks = JSON.parse(localStorage.getItem('bag')) || [];
    }
    booksWrapperBag.innerHTML = '';

    // calculate slider's wrapper width
    bagElem.classList.toggle('empty', bagBooks.length === 0);
    booksWrapperBag.style.width = bagBooks.length * 100 + '%';

    // display count of book for bag toggler button
    bookCountToggler.textContent = bagBooks.length;
    bookCountToggler.classList.toggle('d-none', bagBooks.length === 0);

    // display total price
    displayTotalPrice();

    bagBooks.forEach((bagBook, itemIndex) => {
        const bagBookElement = bagBookTemplate.cloneNode(true);
        const bagBookIndex = bagBook.bookIndex;
        const bookData = books.filter(book => parseInt(book.id) === parseInt(bagBookIndex))[0];

        bagBookElement.querySelector('#bag-book-Thumbnail').src = createThumbnailPath(bookData?.imageLink);
        bagBookElement.querySelector('#bag-book-title').textContent = bookData.title;
        bagBookElement.querySelector('#bag-book-auth').textContent = bookData.author;
        bagBookElement.querySelector('#bag-book-price').textContent = bookData.price;
        bagBookElement.querySelector('.bag-book-count').textContent = bagBook.count;

        bagBookElement.querySelector('#inc').addEventListener('click', () => {
            incBookCount(bagBookIndex);
            displayBookCount(itemIndex);
            activateCountButtons(itemIndex);
            displayTotalPrice();
        });
        bagBookElement.querySelector('#dec').addEventListener('click', () => {
            decBookCount(bagBookIndex);
            displayBookCount(itemIndex);
            activateCountButtons(itemIndex);
            displayTotalPrice();
        });

        bagBookElement.querySelector('#bag-book-close').addEventListener('click', () => {
            removeBagItem(bagBookIndex);
            displayBagBooks();
        });

        activateBagButtons();

        booksWrapperBag.append(bagBookElement);
        activateCountButtons(itemIndex);
    })
}

function displayTotalPrice() {
    const totalPrice = bagBooks.reduce(
        (total, currentItem) => {
            let bookPrice = books.filter(item => item.id === currentItem.bookIndex) || 0;
            let bookCount = currentItem.count;
            if (bookPrice) bookPrice = bookPrice[0].price;

            return total + bookCount * bookPrice;
        },
        0,
    );
    bagTotalPriceElem.textContent = totalPrice;
}

function incBookCount(bookIndex) {
    bagBooks.map(bagBook => bagBook.bookIndex === bookIndex ? bagBook.count++ : bagBook.count);

    localStorage.setItem('bag', JSON.stringify(bagBooks));
}

function decBookCount(bookIndex) {
    bagBooks.map(bagBook => bagBook.bookIndex === bookIndex && bagBook.count > 1 ? bagBook.count-- : bagBook.count);

    localStorage.setItem('bag', JSON.stringify(bagBooks));
}

function displayBookCount(itemIndex) {
    const bagBookCountElem = booksWrapperBag.querySelector(`#bag-book:nth-child(${itemIndex + 1}) .bag-book-count`);

    bagBookCountElem.textContent = bagBooks[itemIndex].count;
}

function activateCountButtons(itemIndex) {
    const bagBookElem = booksWrapperBag.querySelector(`#bag-book:nth-child(${itemIndex + 1})`);
    const bagBookCount = bagBooks[itemIndex].count;

    bagBookElem.querySelector('#dec').classList.toggle('disabled', bagBookCount === 1);
}

function activateBagButtons() {
    const bagLength = bagBooks.length;

    bagPrevBtn.classList.toggle('disabled', offset === minOffset);
    bagNextBtn.classList.toggle('disabled', offset === bagLength);
}

function toggleBag() {
    bagElem.classList.toggle("active");
}

// rating functions
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

// modal functions
function showModal(book) {
    modal.classList.add('active');
    modalTitle.textContent = book.title;
    modalDescription.textContent = book.description;
}

function closeOverlay() {
    if (modal.classList.contains('active')) {
        modal.classList.remove('active');
    } else if (bagElem.classList.contains('active')) {
        bagElem.classList.remove('active');
    }
}

// book functions
function searchBook(books, title) {
    title = title.trim().toLowerCase();

    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(title));

    displayBooks(filteredBooks);
}

function addToBag(bookIndex) {
    let hasItem = bagBooks.find(item => item.bookIndex === bookIndex);
    if (hasItem) return;

    const bagItem = {
        bookIndex: bookIndex,
        count: 1
    }

    bagBooks.push(bagItem);
    offset = bagBooks.length;

    activateBagButtons();
    sliderTransform();

    localStorage.setItem('bag', JSON.stringify(bagBooks));
}

function removeBagItem(bookIndex) {
    bagBooks = bagBooks.filter(item => item.bookIndex !== bookIndex);

    booksWrapperBag.style.width = bagBooks.length * 100 + '%';
    sliderTransform();

    localStorage.setItem('bag', JSON.stringify(bagBooks));
}

// drag and drop functions
function drag(event, bookIndex, elem) {
    event.dataTransfer.setData('text/plain', bookIndex);
}

function drop(event, elem) {
    event.preventDefault();
    elem.classList.remove('hovered');
    const data = event.dataTransfer.getData("text/plain");

    if (parseInt(data)) {
        addToBag(data);
        displayBagBooks();
    }
}

function allowDrop(event, elem) {
    event.preventDefault();

    elem.classList.add('hovered');
}

function dragLeave(elem) {
    elem.classList.remove('hovered');
}

// Initialize the app
async function init() {
    books = await fetchData();
    bagBooks = JSON.parse(localStorage.getItem('bag')) || [];
    if (!books) return;

    displayBooks(books);
    displayBagBooks(bagBooks);

    bagElem.addEventListener('drop', (event) => drop(event, bagElem));
    bagElem.addEventListener('dragover', (event) => allowDrop(event, bagElem));
    bagElem.addEventListener('dragleave', () => dragLeave(bagElem));

    bagToggler.addEventListener('click', toggleBag);

    searchInput.addEventListener('input', (event) => searchBook(books, event.target.value))
}

// Initialize when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);