import { modal, modalDescription, modalTitle } from "./domElements.js";

export function createThumbnailPath(imgName = null) {
    if (!imgName) imgName = 'default.jpg';

    const thumbnailPath = '/assets/images/thumbnails';
    return `${thumbnailPath}/${imgName}`;
}

export function showModal(book) {
    modal.classList.add('active');
    modalTitle.textContent = book.title;
    modalDescription.textContent = book.description;
}

export function closeOverlay() {
    if (modal.classList.contains('active')) {
        modal.classList.remove('active');
    } else if (bagElem.classList.contains('active')) {
        bagElem.classList.remove('active');
    }
}

export function drag(event, bookIndex, elem) {
    event.dataTransfer.setData('text/plain', bookIndex);
}

export function drop(event, elem, booksObject, bagBooksObject) {
    event.preventDefault();
    elem.classList.remove('hovered');
    const data = event.dataTransfer.getData("text/plain");

    if (parseInt(data)) {
        booksObject.addToBag(data);
        bagBooksObject.display();
    }
}

export function allowDrop(event, elem) {
    event.preventDefault();

    elem.classList.add('hovered');
}

export function dragLeave(elem) {
    elem.classList.remove('hovered');
}
