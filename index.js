const tipOptions =  document.querySelectorAll('.option');
const customTip = document.querySelector('.custom');

const bill = document.getElementById('bill');
const numPeople = document.getElementById('num-people');

const tipAmountLabel = document.querySelector('.tip-amount .amount');
const totalLabel = document.querySelector('.total .amount');

const resetButton = document.querySelector('button');

const data = {
    bill: 0, tip: 0, numPeople: 0
}

/** 
 * Removes the placeholder "Custom" from the customTip element. 
 */
function onCustomFocus() {
    customTip.classList.add('active');
    if (customTip.innerHTML == 'Custom') {
        customTip.innerHTML = '\u200B';
    }
}

/** 
 * Handles the custom tip input.
 */
function onCustomInput() {
    customTip.classList.remove('error', 'valid');

    const tip = Number(
        customTip.textContent.replace(/\u200B/g, '').trim()
    );

    if (!Number.isNaN(tip) && tip != 0) {
        data.tip = tip;
        customTip.classList.add('valid');

    } else {
        data.tip = 0;
        customTip.classList.add('error');
    }

    calculateAmount();
}

/**
 * Hanldes the Bill and the number of people inputs.
 * @param { InputEvent } event 
 * @param { string } property 
 */
function onInput(event, property) {
    const { target } = event;
    const targetContainer = target.closest('div');

    targetContainer.classList.remove('invalid', 'error');
    target.classList.remove('valid');

    const value = Number(target.value);

    if (Number.isNaN(value)) {
        data[property] = 0;
        targetContainer.classList.add('invalid');

    } else if (value == 0) {
        data[property] = 0;
        targetContainer.classList.add('error');

    } else {
        data[property] = value;
        target.classList.add('valid');
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

    if (target.classList.contains('custom')) {
        return;
    }

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
    customTip.onfocus = onCustomFocus;
    customTip.oninput = onCustomInput;

    bill.addEventListener('input', (event) => {
        onInput(event, 'bill');
    });

    numPeople.addEventListener('input', (event) => {
        onInput(event, 'numPeople');
    });

    tipOptions.forEach(option => {
        option.addEventListener('click', selectTipOption);
    });

    resetButton.addEventListener('click', reset);
}

document.addEventListener('DOMContentLoaded', onMount);