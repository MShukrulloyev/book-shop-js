export default class BooksRating {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('rate')) || [];
    }

    displayStarRating(items, rate) {
        items.forEach((item, ind) => {
            if (ind < rate) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    saveBookRate(event, bookIndex) {
        this.remove(bookIndex);

        let currentBookRate = event.target.dataset.rate;

        let bookItem = {
            id: bookIndex,
            rate: currentBookRate
        };

        this.items.push(bookItem);
        localStorage.setItem('rate', JSON.stringify(this.items));
    }

    display(bookIndex) {
        const bookElem = document.querySelector(`[data-book-index="${bookIndex}"]`);
        const starsItem = bookElem.querySelectorAll('#stars>*');

        let bookRate = this.getBookRate(bookIndex);

        this.displayStarRating(starsItem, bookRate);
    }

    getBookRate(bookIndex) {
        const filteredItem = this.items.find(item => item.id === bookIndex);

        return filteredItem?.rate || 0;
    }

    remove(bookIndex) {
        this.items = this.items.filter(item => item.id !== bookIndex);
        this.addToLocalStorage();
    }

    addToLocalStorage() {
        localStorage.setItem('rate', JSON.stringify(this.items));
    }
}
