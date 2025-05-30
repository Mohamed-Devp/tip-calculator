const tipOptions =  document.querySelectorAll('.option');
const customOption = document.querySelector('.custom input');

const bill = document.getElementById('bill');
const numPeople = document.getElementById('num-people');

const tipAmountLabel = document.querySelector('.tip-amount .amount');
const totalLabel = document.querySelector('.total .amount');

const resetButton = document.querySelector('button');

const data = {
    bill: 0, tip: 0, numPeople: 0
}

/** 
 * Handles the custom tip input.
 */
function onCustomInput() {
    const customOptionContainer = customOption.parentElement;

    customOptionContainer.classList.remove('valid', 'invalid');

    const tipPerc = Number(customOption.value);

    if (Number.isNaN(tipPerc) || tipPerc == 0) {
        data.tip = 0;
        customOptionContainer.classList.add('invalid');

    } else {
        data.tip = tipPerc;
        customOptionContainer.classList.add('valid');
    }

    // Unselect previously selected tip option
    tipOptions.forEach(option => {
        option.classList.remove('selected');
    });

    calculateAmount();
}

/**
 * Hanldes the Bill and the number of people inputs.
 * @param { InputEvent } event 
 * @param { string } property 
 */
function onInput(event, property) {
    const { target } = event;
    const targetContainer = target.parentElement;

    targetContainer.classList.remove('valid', 'invalid', 'error');

    const value = Number(target.value);

    if (Number.isNaN(value)) {
        data[property] = 0;
        targetContainer.classList.add('invalid');

    } else if (value == 0) {
        data[property] = 0;
        targetContainer.classList.add('error');

    } else {
        data[property] = value;
        targetContainer.classList.add('valid');
    }

    calculateAmount();
}

/**
 * Handles selecting tip options from the tip selector.
 * @param { MouseEvent } event 
 */
function selectTipOption(event) {
    const { target } = event;

    // Unselect previously selected option
    tipOptions.forEach(option => {
        option.classList.remove('selected');
    });

    target.classList.add('selected');
    
    const { value } = target.dataset;
    data['tip'] = Number(value);

    calculateAmount();
}

/**
 * Calculates & Display the tip amount per person 
 * and the total per person.
 */
function calculateAmount() {
    const { bill, tip, numPeople } = data;

    if (bill == 0 || tip == 0 || numPeople == 0) {
        return;
    }

    const tipAmount = bill * tip / 100;
    const tipPerPerson = tipAmount / numPeople;

    const total = bill + tipAmount;
    const totalPerPerson = total / numPeople;

    tipAmountLabel.innerHTML = `$${tipPerPerson.toFixed(2)}`;
    totalLabel.innerHTML = `$${totalPerPerson.toFixed(2)}`;

    resetButton.className = 'complete';
}

/**
 * Clears the input fields, data and the display.
 */
function reset() {
    // Reset the bill and number of people inputs
    bill.value = '';
    numPeople.value = '';

    // Reset the cutom tip input
    customOption.value = '';

    // Reset the tip selector
    tipOptions.forEach(option => {
        if (option.classList.contains('custom')) {
            option.innerHTML = 'Custom';
        } else {
            option.classList.remove('selected');
        }
    });

    // Clear the display
    tipAmountLabel.innerHTML = totalLabel.innerHTML = '$0.00';

    resetButton.className = 'empty';
    data.bill = data.tip = data.numPeople = 0;
}

/**
 * Runs once the page is rendered. 
 */
function onMount() {
    bill.addEventListener('input', (event) => {
        onInput(event, 'bill');
    });

    numPeople.addEventListener('input', (event) => {
        onInput(event, 'numPeople');
    });

    customOption.addEventListener('input', onCustomInput);

    tipOptions.forEach(option => {
        option.addEventListener('click', selectTipOption);
    });

    resetButton.addEventListener('click', reset);
}

document.addEventListener('DOMContentLoaded', onMount);