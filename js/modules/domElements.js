// Selectors
export const searchInput = document.querySelector('#search-input');

export const bagElem = document.querySelector('.bag');
export const bagTotalPriceElem = bagElem.querySelector('#totalPrice');

export const booksWrapper = document.querySelector('#books');
export const sliderWrapper = document.querySelector('.bag__books');
export const booksWrapperBag = document.querySelector('#bag_books_wrapper');

export const bagCloseBtn = bagElem.querySelector('#bag-close');
export const bagPrevBtn = sliderWrapper.querySelector('#bag-prev');
export const bagNextBtn = sliderWrapper.querySelector('#bag-next');
export const bagToggler = document.querySelector('#bag-toggler');

export const bookCountToggler = bagToggler.querySelector('#bag-book-count');

export const modal = document.querySelector('#modal');
export const modalCloseBtn = modal.querySelector('#modal-close');
export const modalTitle = modal.querySelector('#modal-title');
export const modalDescription = modal.querySelector('#modal-description');

export const bookTemplate = document.querySelector('#book-template').content;
export const bagBookTemplate = document.querySelector('#bag-book-template').content;

export const overlay = document.querySelector('#overlay');