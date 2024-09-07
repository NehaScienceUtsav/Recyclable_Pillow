document.addEventListener('DOMContentLoaded', () => {
    const cartPopup = document.getElementById('cart-popup');
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalAmountElement = document.getElementById('total-amount');
    const payButton = document.getElementById('pay-button');
    const qrCodeContainer = document.getElementById('qr-code-container');
    const closeCartButton = document.getElementById('close-cart');

    let cart = [];
    let totalAmount = 0;
    let rewardCoins = 100; // Example of initial reward coins

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });

    document.querySelectorAll('.increment').forEach(button => {
        button.addEventListener('click', incrementQuantity);
    });

    document.querySelectorAll('.decrement').forEach(button => {
        button.addEventListener('click', decrementQuantity);
    });

    function addToCart(event) {
        const productCard = event.target.closest('.product-card');
        const productName = productCard.querySelector('h3').innerText;
        const productPrice = parseFloat(productCard.querySelector('p').innerText.replace('Price: $', ''));
        const productQuantity = parseInt(productCard.querySelector('.quantity').value);

        const cartItem = cart.find(item => item.name === productName);
        if (cartItem) {
            cartItem.quantity += productQuantity;
        } else {
            cart.push({ name: productName, price: productPrice, quantity: productQuantity });
        }

        updateCart();
    }

    function incrementQuantity(event) {
        const quantityInput = event.target.closest('.quantity-controls').querySelector('.quantity');
        quantityInput.value = parseInt(quantityInput.value) + 1;
    }

    function decrementQuantity(event) {
        const quantityInput = event.target.closest('.quantity-controls').querySelector('.quantity');
        if (quantityInput.value > 1) {
            quantityInput.value = parseInt(quantityInput.value) - 1;
        }
    }

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        totalAmount = 0;
        cart.forEach(item => {
            const cartItemElement = document.createElement('div');
            cartItemElement.innerText = `${item.name} - $${item.price} x ${item.quantity}`;
            cartItemsContainer.appendChild(cartItemElement);
            totalAmount += item.price * item.quantity;
        });
        totalAmountElement.innerText = totalAmount.toFixed(2);
        cartPopup.style.display = 'block';
    }

    payButton.addEventListener('click', () => {
        if (totalAmount <= rewardCoins) {
            alert(`You can use your reward coins! Total Amount: $${totalAmount} - Reward Coins: ${rewardCoins}`);
            rewardCoins -= totalAmount;
            alert('Payment successful using reward coins!');
        } else {
            alert('Insufficient reward coins. Please pay the remaining amount.');
            qrCodeContainer.style.display = 'block';
        }
    });

    closeCartButton.addEventListener('click', () => {
        cartPopup.style.display = 'none';
        qrCodeContainer.style.display = 'none';
    });
});
