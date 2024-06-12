// DOM Selectors
const form = document.querySelector('form');
const inputs = {
    firstName: form.querySelector('#firstName'),
    lastName: form.querySelector('#lastName'),
    deliveryDate: form.querySelector('#delivery-date'),
    street: form.querySelector('#street'),
    houseNumber: form.querySelector('#house-number'),
    flat: form.querySelector('#flat'),
    paymentType: form.querySelector('input[name=payment-type]:checked'),
    gift1: form.querySelector('#gift-1'),
    gift2: form.querySelector('#gift-2'),
    submitBtn: form.querySelector('#submit-btn'),
};
const deliveryInputs = form.querySelectorAll('.delivery-input');
const confirmSection = document.querySelector('#confirm-section');
const completeSection = document.querySelector('#complete-section');

// Redirect if already submitted
if (new URLSearchParams(window.location.search).toString()) {
    window.location.href = 'index.html';
}

// Event listeners for validation
deliveryInputs.forEach(input => {
    input.addEventListener('blur', () => {
        validateInput(input);
        toggleSubmitBtn();
    });
});

// Form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isFormValid()) return;
    localStorage.removeItem('bag');
    confirmSection.classList.add('d-none');
    completeSection.classList.remove('d-none');
    displayFormData();
});

// Event listeners for gifts
inputs.gift1.addEventListener('input', () => updateOptions(inputs.gift1, inputs.gift2));
inputs.gift2.addEventListener('input', () => updateOptions(inputs.gift2, inputs.gift1));

// Functions
const validateInput = (input) => {
    const rule = getRule(input.id);
    const isValid = new InputValidator(input.value).isValid(rule);
    input.classList.toggle('valid', isValid);
    input.classList.toggle('invalid', !isValid);
};

const toggleSubmitBtn = () => {
    const isValid = isFormValid();
    inputs.submitBtn.classList.toggle('disabled', !isValid);
    inputs.submitBtn.classList.toggle('btn-warning', isValid);
};

const updateOptions = (input, otherInput) => {
    const selectedValue = input.value;
    otherInput.querySelectorAll('option').forEach(option => {
        option.disabled = option.value === selectedValue;
    });
    if (otherInput.value === selectedValue) {
        otherInput.value = '';
    }
};

const displayFormData = () => {
    const customerName = `${inputs.firstName.value} ${inputs.lastName.value}`;
    const deliveryAddress = `${inputs.street.value}, house ${inputs.houseNumber.value}, flat ${inputs.flat.value}`;
    const deliveryDate = inputs.deliveryDate.value;
    const paymentType = inputs.paymentType.value;
    const gift1Title = inputs.gift1.value ? inputs.gift1.options[inputs.gift1.selectedIndex].textContent : '';
    const gift2Title = inputs.gift2.value ? inputs.gift2.options[inputs.gift2.selectedIndex].textContent : '';
    const gifts = [gift1Title, gift2Title].filter(Boolean).join(', ');

    completeSection.querySelector('#customer').textContent = customerName;
    completeSection.querySelector('#delivery-address').textContent = deliveryAddress;
    completeSection.querySelector('#delivery-date').textContent = deliveryDate;
    completeSection.querySelector('#payment').textContent = paymentType;
    completeSection.querySelector('#gifts').textContent = gifts;
};

const isFormValid = () => Array.from(deliveryInputs).every(input => {
    const rule = getRule(input.id);
    return new InputValidator(input.value).isValid(rule);
});

const getRule = (inputId) => {
    const rules = {
        firstName: { minLength: 4, type: 'alphaOnly', noSpace: true },
        lastName: { minLength: 5, type: 'alphaOnly', noSpace: true },
        deliveryDate: { minDate: new Date() },
        street: { minLength: 5, type: 'alphaNumericOnly' },
        houseNumber: { min: 0 },
        flat: { type: 'NumericSingleDashMiddle' },
    };
    return rules[inputId] || {};
};

// validator class
class InputValidator {
    constructor(value) {
        this.value = value;
    }

    isValid(rule) {
        return [
            rule.min !== undefined ? this.isMore(rule.min) : true,
            rule.minLength ? this.isEnoughChar(rule.minLength) : true,
            rule.type ? this[rule.type]() : true,
            rule.minDate ? this.checkDate(rule.minDate) : true,
            rule.noSpace ? this.noSpace() : true,
        ].every(Boolean);
    }

    NumericSingleDashMiddle() {
        return /^(?!-)[0-9]+(-[0-9]+)?(?!-)$/.test(this.value);
    }

    noSpace() {
        return !this.value.includes(' ');
    }

    checkDate(minDate) {
        const inputDate = new Date(this.value);
        return inputDate.setHours(0, 0, 0, 0) > new Date(minDate).setHours(0, 0, 0, 0);
    }

    alphaOnly() {
        return /^[A-Za-z]+$/.test(this.value);
    }

    alphaNumericOnly() {
        return /^[A-Za-z0-9]*$/.test(this.value);
    }

    isEnoughChar(minLength) {
        return this.value.length >= minLength;
    }

    isMore(min) {
        return parseInt(this.value, 10) >= min;
    }
}