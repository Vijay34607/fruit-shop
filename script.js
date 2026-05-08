// Product Data
const products = [
    {
        id: 1,
        name: 'Apples',
        imageUrl: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?auto=format&fit=crop&w=800&q=80',
        price: 250,
        description: 'Fresh, crispy red apples - packed with vitamins'
    },
    {
        id: 2,
        name:  'Bananas',
        imageUrl: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=800&q=80',
        price: 150,
        description: 'Sweet and ripe bananas, perfect for smoothies'
    },
    {
        id: 3,
        name: 'Oranges',
        imageUrl: 'images/mae-mu-U1iYwZ8Dx7k-unsplash.jpg',
        price: 300,
        description: 'Bright oranges full of vitamin C'
    },
    {
        id: 4,
        name: 'Strawberries',
        imageUrl: 'images/allec-gomes-xnRg3xDcNnE-unsplash.jpg',
        price: 350,
        description: 'Delicious red strawberries, farm fresh'
    },
    {
        id: 5,
        name: 'Green Grapes',
        imageUrl: 'images/engin-akyurt-g4LcQ1Ry-HY-unsplash.jpg',
        price: 280,
        description: 'Seedless green grapes, sweet and refreshing'
    },
    {
        id: 6,
        name: 'Pineapples',
        imageUrl: 'images/stephany-williams-yx3-a7ualMM-unsplash.jpg',
        price: 400,
        description: 'Yellow pineapples with sweet tropical flavor'
    },
    {
        id: 7,
        name: 'Watermelon',
        imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
        price: 450,
        description: 'Large, juicy watermelons perfect for summer'
    },
    {
        id: 8,
        name: 'Avocado',
        imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        price: 200,
        description: 'Rich and creamy avocados, ready to eat'
    }
];

// Shopping Cart
let cart = [];
let selectedPayment = '';
let currentOrder = null;
const API_BASE_URL = 'http://localhost:8000/api';

// Initialize the website
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    loadCartFromStorage();
});

function toggleNav() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Render Products
function renderProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.imageUrl}" alt="${product.name}" loading="lazy" onerror="this.onerror=null;this.src='https://via.placeholder.com/800x600?text=Fruit+Image';">
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">₹${product.price}</span>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                </div>
            </div>
        `;
        productCard.style.animation = `none`;
        productsGrid.appendChild(productCard);
    });
}

// Add to Cart Function
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
    saveCartToStorage();
    showNotification(`${product.name} added to cart!`);
}

// Update Cart Display
function updateCart() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const cartFooter = document.getElementById('cartFooter');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartFooter.style.display = 'none';
        cartTotal.textContent = '₹0.00';
        return;
    }

    cartFooter.style.display = 'block';
    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">₹${item.price} x <span id="qty-${item.id}">${item.quantity}</span></div>
                <div class="cart-item-total">Total: ₹${itemTotal}</div>
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="decreaseQuantity(${item.id})">−</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="increaseQuantity(${item.id})">+</button>
                    <button class="cart-item-remove" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = `₹${total.toFixed(2)}`;
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    saveCartToStorage();
    showNotification('Item removed from cart');
}

// Increase Quantity
function increaseQuantity(productId) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += 1;
        updateCart();
        saveCartToStorage();
    }
}

// Decrease Quantity
function decreaseQuantity(productId) {
    const item = cart.find(i => i.id === productId);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        updateCart();
        saveCartToStorage();
    }
}

// Toggle Cart Modal
function toggleCart(event) {
    if (event) {
        event.preventDefault();
    }
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.toggle('active');
}

// Close cart when clicking outside
document.addEventListener('click', (event) => {
    const cartModal = document.getElementById('cartModal');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (!cartModal.contains(event.target) && !cartIcon.contains(event.target)) {
        cartModal.classList.remove('active');
    }
});

// Select Payment Method
function selectPayment(method, event) {
    selectedPayment = method;
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });

    if (event && event.currentTarget) {
        event.currentTarget.classList.add('selected');
    }

    document.getElementById('confirmPaymentBtn').disabled = false;
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('orderDetailsText').textContent = `${cart.length} item(s), total ₹${total.toFixed(2)} — pay with ${method}.`;
}

function getPaymentRedirectUrl(method) {
    const redirects = {
        'Google Pay': 'https://pay.google.com',
        'PhonePe': 'https://www.phonepe.com',
        'Paytm': 'https://paytm.com',
        'UPI': 'https://www.npci.org.in/what-is-upi'
    };
    return redirects[method] || '';
}

async function postOrder(order) {
    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(order)
        });

        if (!response.ok) {
            throw new Error(`Server error ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Order API error:', error);
        return null;
    }
}

async function postContactMessage(message) {
    try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });

        if (!response.ok) {
            throw new Error(`Server error ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Contact API error:', error);
        return null;
    }
}

function saveOrder(order) {
    const orders = JSON.parse(localStorage.getItem('nilaFruitOrders') || '[]');
    orders.push(order);
    localStorage.setItem('nilaFruitOrders', JSON.stringify(orders));
}

// Confirm Payment
async function confirmPayment() {
    if (!selectedPayment) {
        showNotification('Please select a payment method!');
        return;
    }

    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const isCod = selectedPayment === 'Cash on Delivery';
    currentOrder = {
        id: Date.now(),
        items: [...cart],
        total: total,
        date: new Date().toISOString(),
        status: isCod ? 'confirmed' : 'pending',
        paymentMethod: selectedPayment
    };

    saveOrder(currentOrder);

    const customerName = document.getElementById('checkoutName')?.value.trim();
    const customerPhone = document.getElementById('checkoutPhone')?.value.trim();
    const customerEmail = document.getElementById('checkoutEmail')?.value.trim();

    if (!customerName || !customerPhone || !customerEmail) {
        showNotification('Please enter your name, phone, and email before placing the order.');
        return;
    }

    currentOrder = {
        id: Date.now(),
        customer: {
            name: customerName,
            phone: customerPhone,
            email: customerEmail
        },
        items: [...cart],
        total: total,
        date: new Date().toISOString(),
        status: isCod ? 'confirmed' : 'pending',
        paymentMethod: selectedPayment
    };

    const serverResult = await postOrder(currentOrder);
    if (serverResult && serverResult.success) {
        showNotification('Order saved to server successfully.');
    } else {
        saveOrder(currentOrder);
        showNotification('Server unavailable. Order saved locally as backup.');
    }

    if (isCod) {
        showOrderAnimation('Order placed successfully!', 'Your cash on delivery order has been confirmed. Our delivery team will contact you shortly.');
        showNotification(`Order placed! Total: ₹${total}. Payment by Cash on Delivery.`);
        generateInvoice(currentOrder);
    } else {
        const redirectUrl = getPaymentRedirectUrl(selectedPayment);
        showOrderAnimation(`Redirecting to ${selectedPayment}`, `A secure payment window will open. Complete the transaction on the official ${selectedPayment} website.`);
        showNotification(`Redirecting to ${selectedPayment}. Your order is saved as pending.`);
        if (redirectUrl) {
            window.open(redirectUrl, '_blank');
        }
        generateInvoice(currentOrder);
    }

    cart = [];
    updateCart();
    saveCartToStorage();

    document.getElementById('cartModal').classList.remove('active');
    selectedPayment = '';
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.getElementById('confirmPaymentBtn').disabled = true;
    document.getElementById('orderDetailsText').textContent = 'Select a payment method to continue.';
}

// Close Payment Modal (keep for compatibility)
function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
    selectedPayment = '';
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    document.getElementById('confirmPaymentBtn').disabled = true;
}

function showOrderAnimation(title, subtitle) {
    const overlay = document.getElementById('orderAnimationOverlay');
    document.getElementById('orderAnimationTitle').textContent = title;
    document.getElementById('orderAnimationSubtitle').textContent = subtitle;
    overlay.classList.add('active');

    setTimeout(() => {
        overlay.classList.remove('active');
    }, 4200);
}

function saveContactMessage(message) {
    const messages = JSON.parse(localStorage.getItem('nilaContactMessages') || '[]');
    messages.push(message);
    localStorage.setItem('nilaContactMessages', JSON.stringify(messages));
}

// Form Submission
async function handleSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('contactName')?.value.trim();
    const phone = document.getElementById('contactPhone')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const message = document.getElementById('contactMessage')?.value.trim();

    if (!name || !phone || !email || !message) {
        showNotification('Please fill in all contact fields before sending.');
        return;
    }

    const contactMessage = {
        id: Date.now(),
        name,
        phone,
        email,
        message,
        date: new Date().toISOString()
    };

    const serverResult = await postContactMessage(contactMessage);
    if (serverResult && serverResult.success) {
        showNotification('Message sent to server successfully.');
    } else {
        saveContactMessage(contactMessage);
        showNotification('Server unavailable. Message saved locally as backup.');
    }

    event.target.reset();
}

// Notification System
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.3s ease;
        z-index: 2000;
        max-width: 300px;
    `;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Generate Invoice
function generateInvoice(order) {
    const customerDetails = order.customer ? `Customer: ${order.customer.name}\nPhone: ${order.customer.phone}\nEmail: ${order.customer.email}\n\n` : '';
    const invoiceContent = `
Fruit Shop - INVOICE
====================

Order ID: ${order.id}
Date: ${new Date(order.date).toLocaleString()}
${customerDetails}Payment Method: ${order.paymentMethod}
Status: ${order.status}

Items:
${order.items.map(item => `${item.name} (x${item.quantity}) - ₹${(item.price * item.quantity)}`).join('\n')}

Total: ₹${order.total}

Thank you for shopping with Fruit Shop!
    `;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NilaFruit_Order_${order.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Add smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (event) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            event.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }

        const navLinks = document.querySelector('.nav-links');
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
        }
    });
});

// Add animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe product cards
setTimeout(() => {
    document.querySelectorAll('.product-card').forEach(card => {
        observer.observe(card);
    });
}, 100);

// Local Storage Functions
function saveCartToStorage() {
    localStorage.setItem('nilaFruitCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('nilaFruitCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}
