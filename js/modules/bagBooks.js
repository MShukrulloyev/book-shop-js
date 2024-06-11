import { booksWrapperBag, bagTotalPriceElem, bookCountToggler, bagElem, bagBookTemplate } from './domElements.js';
import { createThumbnailPath } from './util.js';

export default class BagBooks {
    constructor(items) {
        this.items = items;
        this.booksObject = null;
        this.sliderObject = null;
    }
    
    setDependencies(data, objectName) {
        this[objectName] = data;
    }

    display() {
        const bagBooks = this.items;

        booksWrapperBag.innerHTML = '';

        bagElem.classList.toggle('empty', bagBooks.length === 0);
        booksWrapperBag.style.width = bagBooks.length * 100 + '%';

        bookCountToggler.textContent = bagBooks.length;
        bookCountToggler.classList.toggle('d-none', bagBooks.length === 0);

        this.displayTotalPrice();

        bagBooks.forEach((bagBook, itemIndex) => {
            const bagBookElement = bagBookTemplate.cloneNode(true);
            const bagBookIndex = bagBook.bookIndex;
            const bookData = this.booksObject.items.find(book => parseInt(book.id) === parseInt(bagBookIndex));

            bagBookElement.querySelector('#bag-book-Thumbnail').src = createThumbnailPath(bookData?.imageLink);
            bagBookElement.querySelector('#bag-book-title').textContent = bookData.title;
            bagBookElement.querySelector('#bag-book-auth').textContent = bookData.author;
            bagBookElement.querySelector('#bag-book-price').textContent = bookData.price;
            bagBookElement.querySelector('.bag-book-count').textContent = bagBook.count;

            bagBookElement.querySelector('#inc').addEventListener('click', () => {
                this.incBookCount(bagBookIndex);
                this.displayBookCount(itemIndex);
                this.activateCountButtons(itemIndex);
                this.displayTotalPrice();
            });
            bagBookElement.querySelector('#dec').addEventListener('click', () => {
                this.decBookCount(bagBookIndex);
                this.displayBookCount(itemIndex);
                this.activateCountButtons(itemIndex);
                this.displayTotalPrice();
            });

            bagBookElement.querySelector('#bag-book-close').addEventListener('click', () => {
                this.remove(bagBookIndex);
                this.display();
            });

            this.sliderObject.activateButtons();

            booksWrapperBag.append(bagBookElement);
            this.activateCountButtons(itemIndex);
        });
    }

    addItem(item) {
        this.items.push(item);
    }

    remove(bookIndex) {
        this.items = this.items.filter(item => item.bookIndex !== bookIndex);

        booksWrapperBag.style.width = this.items.length * 100 + '%';
        this.sliderObject.sliderTransform();

        this.addToLocalStorage();
    }

    displayTotalPrice() {
        const totalPrice = this.items.reduce(
            (total, currentItem) => {
                let bookPrice = this.booksObject.items.find(item => item.id === currentItem.bookIndex)?.price || 0;
                let bookCount = currentItem.count;
                return total + bookCount * bookPrice;
            },
            0,
        );
        bagTotalPriceElem.textContent = totalPrice;
    }

    incBookCount(bookIndex) {
        this.items.map(bagBook => bagBook.bookIndex === bookIndex ? bagBook.count++ : bagBook.count);
        this.addToLocalStorage();
    }

    decBookCount(bookIndex) {
        this.items.map(bagBook => bagBook.bookIndex === bookIndex && bagBook.count > 1 ? bagBook.count-- : bagBook.count);
        this.addToLocalStorage();
    }

    displayBookCount(itemIndex) {
        const bagBookCountElem = booksWrapperBag.querySelector(`#bag-book:nth-child(${itemIndex + 1}) .bag-book-count`);

        bagBookCountElem.textContent = this.items[itemIndex].count;
    }

    activateCountButtons(itemIndex) {
        const bagBookElem = booksWrapperBag.querySelector(`#bag-book:nth-child(${itemIndex + 1})`);
        const bagBookCount = this.items[itemIndex].count;

        bagBookElem.querySelector('#dec').classList.toggle('disabled', bagBookCount === 1);
    }

    toggle() {
        bagElem.classList.toggle("active");
    }

    addToLocalStorage() {
        localStorage.setItem('bag', JSON.stringify(this.items));
    }
}
