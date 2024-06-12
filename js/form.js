// DOM Selectors
const form = document.querySelector('form');
const firstNameInput = form.querySelector('#firstName');
const lastNameInput = form.querySelector('#lastName');
const deliveryDateInput = form.querySelector('#delivery-date');
const streetInput = form.querySelector('#street');
const houseNumberInput = form.querySelector('#house-number');
const flatInput = form.querySelector('#flat');
const paymentTypeInput = form.querySelector('input[name=payment-type]:checked');
const gift1Select = form.querySelector('#gift-1');
const gift2Select = form.querySelector('#gift-2');
const submitBtn = form.querySelector('#submit-btn');

const deliveryInputs = form.querySelectorAll('.delivery-input');

const confirmSection = document.querySelector('#confirm-section');
const completeSection = document.querySelector('#complete-section');

// check if has submitted
const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
if (params.toString()) {
    location = 'index.html';
}

// validate inputs
deliveryInputs.forEach(input => {
    const rule = getRule(input.id);

    input.addEventListener('blur', () => {
        let isValid = isValidInput(input, rule);

        toggleSubmitBtn();

        input.classList.toggle('valid', isValid);
        input.classList.toggle('invalid', !isValid);
    });
});

// Event listeners
form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!isFormValid()) return;

    localStorage.setItem('bag', '');

    confirmSection.classList.add('d-none');
    completeSection.classList.remove('d-none');

    displayFormData();
});

gift1Select.addEventListener('input', () => {
    updateOptions(gift1Select, gift2Select);
});

gift2Select.addEventListener('input', () => {
    updateOptions(gift2Select, gift1Select);
});

// functions
function updateOptions(input, otherInput) {
    const selectedValue = input.value;

    otherInput.querySelectorAll('option').forEach(option => {
        if (option.value === selectedValue) {
            option.disabled = true;
        } else {
            option.disabled = false;
        }
    });

    if (otherInput.value === selectedValue) {
        otherInput.value = '';
    }
}

function displayFormData() {
    const gift1Title = gift1Select.options[gift1Select.selectedIndex].textContent;
    const gift2Title = gift2Select.options[gift2Select.selectedIndex].textContent;

    const customerName = `${firstNameInput.value} ${lastNameInput.value}`;
    const deliveryAddress = `${streetInput.value}, house ${houseNumberInput.value}, flat ${flatInput.value}`;
    const deliveryDate = deliveryDateInput.value;
    const paymentType = paymentTypeInput.value;

    let gifts = gift1Title;
    if (gift2Title) gifts += `, ${gift2Title}`;

    completeSection.querySelector('#customer').textContent = customerName;
    completeSection.querySelector('#delivery-address').textContent = deliveryAddress;
    completeSection.querySelector('#delivery-date').textContent = deliveryDate;
    completeSection.querySelector('#payment').textContent = paymentType;
    completeSection.querySelector('#gifts').textContent = gifts;
}

function isValidInput(input, rule = []) {
    const validatorObj = new InputValidator(input.value);

    let isValid = validatorObj.isValid(rule);

    return isValid;
}

function isFormValid() {
    let isValid = true;
    deliveryInputs.forEach(input => {
        if (!isValid) return false;

        const rule = getRule(input.id);
        isValid = isValidInput(input, rule);
    });
    return isValid;
}

function getRule(inputId) {
    let rule = {};

    if (inputId === 'firstName') rule = { minLength: 4, type: 'alphaOnly', noSpace: true, };
    if (inputId === 'lastName') rule = { minLength: 5, type: 'alphaOnly', noSpace: true, };
    if (inputId === 'delivery-date') rule = { minDate: new Date() };
    if (inputId === 'street') rule = { minLength: 5, type: 'alphaNumericOnly', };
    if (inputId === 'house-number') rule = { min: 0, };
    if (inputId === 'flat') rule = { type: 'NumericSingleDashMiddle', };

    return rule;
}

function toggleSubmitBtn() {
    submitBtn.classList.toggle('disabled', !isFormValid());
    submitBtn.classList.toggle('btn-warning', isFormValid());
}

// validator class
class InputValidator {
    constructor(value) {
        this.value = value;
    }

    isValid(rule) {
        if (rule.min !== undefined && !this.isMore(rule.min)) return false;
        if (rule.minLength && !this.isEnoughtChar(rule.minLength)) return false;
        if (rule.type && !this[rule.type]()) return false;
        if (rule.minDate && !this.checkDate(rule.minDate)) return false;
        if (rule.noSpace && !this.noSpace()) return false;
        return true;
    }

    NumericSingleDashMiddle() {
        let letters = /^(?!-)[0-9]+(-[0-9]+)?(?!-)$/;
        let isNumericDash = !!this.value.match(letters);

        return isNumericDash;
    }

    noSpace() {
        return !this.value.includes(' ');
    }

    checkDate(min) {
        const minDate = new Date(min);
        const inputDate = new Date(this.value);

        inputDate.setHours(0, 0, 0, 0);
        minDate.setHours(0, 0, 0, 0);

        return minDate.getTime() < inputDate.getTime();
    }

    alphaOnly() {
        let letters = /^[A-Za-z]+$/;
        let isString = !!this.value.match(letters);

        return isString;
    }

    alphaNumericOnly() {
        let letters = /^[A-Za-z0-9]*$/;
        let isString = !!this.value.match(letters);

        return isString;
    }

    isEmpty() {
        return this.value.length === 0;
    }

    isEnoughtChar(minLength) {
        return this.value.length >= minLength;
    }

    isMore(min) {
        return parseInt(this.value) >= parseInt(min);
    }
}