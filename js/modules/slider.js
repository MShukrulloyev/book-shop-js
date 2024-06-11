import { bagPrevBtn, bagNextBtn, booksWrapperBag } from './domElements.js';

export default class Slider {
    constructor() {
        this.bagBooksObject = null;
        this.offset = 1;
        this.minOffset = 1;
    }

    setDependencies(data, objectName) {
        this[objectName] = data;
    }

    activateButtons() {
        const bagLength = this.bagBooksObject.items.length;
        bagPrevBtn.classList.toggle('disabled', this.offset === this.minOffset);
        bagNextBtn.classList.toggle('disabled', this.offset === bagLength);
    }

    sliderPrev() {
        if (this.offset === this.minOffset) return;

        this.offset--;
        this.activateButtons();
        this.sliderTransform();
    }

    sliderNext() {
        if (this.offset === this.bagBooksObject.items.length) return;

        this.offset++;
        this.activateButtons();
        this.sliderTransform();
    }

    sliderTransform() {
        let bagBooksLength = this.bagBooksObject.items.length;

        if (this.offset > bagBooksLength) this.offset = bagBooksLength;

        let translateX = (100 / bagBooksLength) * (this.offset - 1);
        booksWrapperBag.style.transform = `translateX(-${translateX}%)`;
    }
}
