document.addEventListener('DOMContentLoaded', function() {
    const cardNumber = document.getElementById('cardNumber');
    const cardHolder = document.getElementById('cardHolder');
    const expiryDate = document.getElementById('expiryDate');
    const cvv = document.getElementById('cvv');
    const cardNumberDisplay = document.getElementById('cardNumberDisplay');
    const cardHolderDisplay = document.getElementById('cardHolderDisplay');
    const cardExpiryDisplay = document.getElementById('cardExpiryDisplay');
    const form = document.getElementById('paymentForm');

    function formatCardNumber(value) {
        const regex = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/g;
        const onlyNumbers = value.replace(/[^\d]/g, '');

        return onlyNumbers.replace(regex, (regex, $1, $2, $3, $4) =>
            [$1, $2, $3, $4].filter(group => !!group).join(' ')
        );
    }

    function formatExpiryDate(value) {
        const regex = /^(\d{0,2})(\d{0,2})$/g;
        const onlyNumbers = value.replace(/[^\d]/g, '');

        return onlyNumbers.replace(regex, (regex, $1, $2) =>
            [$1, $2].filter(group => !!group).join('/')
        );
    }

    cardNumber.addEventListener('input', function() {
        this.value = formatCardNumber(this.value);
        cardNumberDisplay.textContent = this.value || '•••• •••• •••• ••••';
    });

    cardHolder.addEventListener('input', function() {
        cardHolderDisplay.textContent = this.value || 'FULL NAME';
    });

    expiryDate.addEventListener('input', function() {
        this.value = formatExpiryDate(this.value);
        cardExpiryDisplay.textContent = this.value || 'MM/YY';
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Payment method added successfully!');
    });
});