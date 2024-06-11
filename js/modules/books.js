import { booksWrapper, bookTemplate } from './domElements.js';
import { createThumbnailPath } from './util.js';
import BooksRating from './bookRating.js';
import { showModal, drag } from './util.js';

export default class Books {
    constructor(items) {
        this.items = items;
        this.rating = new BooksRating();
    }

    setDependencies(data, objectName) {
        this[objectName] = data;
    }

    display(filteredBooks = this.items) {
        booksWrapper.innerHTML = '';

        filteredBooks.forEach((book) => {
            const bookElement = bookTemplate.cloneNode(true);
            const starsParent = bookElement.querySelector('#stars');
            const starItems = bookElement.querySelectorAll('#stars>*');
            const addToBagBtn = bookElement.querySelector('#add-to-bag');
            const bookImage = bookElement.querySelector('.book__img img');
            const btnShowMore = bookElement.querySelector('#show-more');

            const bookIndex = book.id;

            starItems.forEach((star, ind, items) => star.addEventListener('mouseover', () => this.rating.displayStarRating(items, ind + 1)));
            starItems.forEach(star => star.addEventListener('click', (event) => this.rating.saveBookRate(event, bookIndex)));

            starsParent.addEventListener('mouseleave', () => this.rating.display(bookIndex));
            addToBagBtn.addEventListener('click', () => {
                this.addToBag(bookIndex);
                this.bagBooksObject.display();
            });

            bookImage.addEventListener('dragstart', (event) => drag(event, bookIndex, bookImage));

            bookElement.querySelector('#book').dataset.bookIndex = bookIndex;
            bookImage.src = createThumbnailPath(book?.imageLink);
            bookImage.alt = book.title;
            bookElement.querySelector('#bookTitle').textContent = book.title;
            bookElement.querySelector('#bookAuth').textContent = book.author;
            bookElement.querySelector('#price').textContent = book.price;

            btnShowMore.addEventListener('click', () => showModal(book));

            booksWrapper.append(bookElement);
            this.rating.display(bookIndex);
        });
    }

    search(title) {
        title = title.trim().toLowerCase();
        const filteredBooks = this.items.filter(book => book.title.toLowerCase().includes(title));
        this.display(filteredBooks);
    }

    addToBag(bookIndex) {
        let hasItem = this.bagBooksObject.items.find(item => parseInt(item.bookIndex) === parseInt(bookIndex));
        if (hasItem) return;

        const bagItem = {
            bookIndex: parseInt(bookIndex),
            count: 1
        };

        this.bagBooksObject.addItem(bagItem);
        this.offset = this.bagBooksObject.items.length;

        this.sliderObject.activateButtons();
        this.sliderObject.sliderTransform();

        this.bagBooksObject.addToLocalStorage();
    }
}
