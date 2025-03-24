// Main JavaScript Functionality

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function () {
    // Update cart count
    updateCartCount();

    // Load books if catalog element exists
    const bookGrid = document.querySelector('.book-grid');
    if (bookGrid) {
        loadBooks();
    }

    // Set up search form
    const searchForm = document.getElementById('search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const searchTerm = this.querySelector('input[name="search"]').value.toLowerCase();
            searchBooks(searchTerm);
        });
    }

    // Set up category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function () {
            loadBooks(this.value);
        });
    }

    // Set up book option selects on book detail pages
    const bookOptions = document.querySelectorAll('.book-option-select');
    bookOptions.forEach(option => {
        option.addEventListener('change', updateBookPrice);
    });

    // Set up add to cart buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart, #add-to-cart-detail');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function () {
            const bookId = this.getAttribute('data-book-id');
            addToCart(bookId);
        });
    });

    // Set up quote calculator form
    const quoteForm = document.getElementById('quote-calculator');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function (e) {
            e.preventDefault();
            calculateQuote();
        });
    }

    // Set up contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // Simulate form submission
            const resultDiv = document.getElementById('contact-result');
            if (resultDiv) {
                resultDiv.innerHTML = '<p>Thank you for your message! We will get back to you soon.</p>';
                resultDiv.style.display = 'block';
                this.reset();
            }
        });
    }

    // Set up tab navigation on book detail pages
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Hide all tab contents
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.style.display = 'none';
            });

            // Show selected tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId + '-tab').style.display = 'block';
        });
    });
});

/**
 * Update cart item count display
 */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('bookstore-cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = cartCount;
    });
}

/**
 * Load books from JSON file
 * @param {string} category - Optional category to filter by
 */
function loadBooks(category) {
    const bookGrid = document.querySelector('.book-grid');
    if (!bookGrid) return;

    bookGrid.innerHTML = '<div class="loading">Loading books...</div>';

    fetch('data/books.json')
        .then(response => response.json())
        .then(books => {
            // Filter by category if provided
            const filteredBooks = category && category !== 'all' ?
                books.filter(book => book.category === category) :
                books;

            // Clear book grid
            bookGrid.innerHTML = '';

            // Display books
            filteredBooks.forEach((book, index) => {
                const bookCard = document.createElement('div');
                bookCard.className = 'book-card';

                bookCard.innerHTML = `
                    <div class="book-image">
                        <img src="images/${book.image}" alt="${book.title}">
                    </div>
                    <div class="book-info">
                        <h3 class="book-title">${book.title}</h3>
                        <div class="book-author">by ${book.author}</div>
                        <div class="book-category">${book.category}</div>
                        <div class="book-price">$${book.price.toFixed(2)}</div>
                        <div class="book-actions">
                            <a href="books/book${index + 1}.html" class="btn">Details</a>
                            <button class="add-to-cart" data-book-id="${index + 1}">Add to Cart</button>
                        </div>
                    </div>
                `;

                bookGrid.appendChild(bookCard);
            });

            // Re-attach event listeners to new buttons
            const addToCartButtons = document.querySelectorAll('.add-to-cart');
            addToCartButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const bookId = this.getAttribute('data-book-id');
                    addToCart(bookId);
                });
            });
        })
        .catch(error => {
            console.error('Error loading books:', error);
            bookGrid.innerHTML = '<p>Error loading books. Please try again later.</p>';
        });
}

/**
 * Search books by title, author, or category
 * @param {string} searchTerm - Term to search for
 */
function searchBooks(searchTerm) {
    fetch('data/books.json')
        .then(response => response.json())
        .then(books => {
            const filteredBooks = books.filter(book =>
                book.title.toLowerCase().includes(searchTerm) ||
                book.author.toLowerCase().includes(searchTerm) ||
                book.category.toLowerCase().includes(searchTerm)
            );

            const bookGrid = document.querySelector('.book-grid');
            if (bookGrid) {
                bookGrid.innerHTML = '';

                if (filteredBooks.length === 0) {
                    bookGrid.innerHTML = '<p>No books found matching your search.</p>';
                    return;
                }

                filteredBooks.forEach((book, index) => {
                    const bookId = books.findIndex(b => b.title === book.title) + 1;
                    const bookCard = document.createElement('div');
                    bookCard.className = 'book-card';

                    bookCard.innerHTML = `
                        <div class="book-image">
                            <img src="images/${book.image}" alt="${book.title}">
                        </div>
                        <div class="book-info">
                            <h3 class="book-title">${book.title}</h3>
                            <div class="book-author">by ${book.author}</div>
                            <div class="book-category">${book.category}</div>
                            <div class="book-price">$${book.price.toFixed(2)}</div>
                            <div class="book-actions">
                                <a href="books/book${bookId}.html" class="btn">Details</a>
                                <button class="add-to-cart" data-book-id="${bookId}">Add to Cart</button>
                            </div>
                        </div>
                    `;

                    bookGrid.appendChild(bookCard);
                });

                // Re-attach event listeners
                const addToCartButtons = document.querySelectorAll('.add-to-cart');
                addToCartButtons.forEach(button => {
                    button.addEventListener('click', function () {
                        const bookId = this.getAttribute('data-book-id');
                        addToCart(bookId);
                    });
                });
            }
        })
        .catch(error => {
            console.error('Error searching books:', error);
        });
}

/**
 * Add a book to the cart
 * @param {string} bookId - ID of the book to add
 */
function addToCart(bookId) {
    // Get current cart or initialize empty array
    let cart = JSON.parse(localStorage.getItem('bookstore-cart')) || [];

    // Check if book is already in cart
    const existingItem = cart.find(item => item.id === bookId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // If book detail page, get options
        let options = {};

        const coverTypeSelect = document.getElementById('cover-type');
        const editionSelect = document.getElementById('edition');
        const quantityInput = document.getElementById('quantity');

        if (coverTypeSelect && editionSelect) {
            options.coverType = coverTypeSelect.value;
            options.edition = editionSelect.value;
        }

        // Add new item to cart
        cart.push({
            id: bookId,
            quantity: quantityInput ? parseInt(quantityInput.value) : 1,
            options: options
        });
    }

    // Save cart to localStorage
    localStorage.setItem('bookstore-cart', JSON.stringify(cart));

    // Update cart count
    updateCartCount();

    // Show confirmation
    alert('Book added to cart!');
}

/**
 * Update book price based on selected options
 */
function updateBookPrice() {
    const basePriceElement = document.getElementById('base-price');
    if (!basePriceElement) return;

    const basePrice = parseFloat(basePriceElement.getAttribute('data-price'));
    let totalPrice = basePrice;

    // Get price adjustments for cover type
    const coverTypeSelect = document.getElementById('cover-type');
    if (coverTypeSelect) {
        const option = coverTypeSelect.options[coverTypeSelect.selectedIndex];
        const priceAdjustment = parseFloat(option.getAttribute('data-price') || 0);
        totalPrice += priceAdjustment;
    }

    // Get price adjustments for edition
    const editionSelect = document.getElementById('edition');
    if (editionSelect) {
        const option = editionSelect.options[editionSelect.selectedIndex];
        const priceAdjustment = parseFloat(option.getAttribute('data-price') || 0);
        totalPrice += priceAdjustment;
    }

    // Update displayed price
    const priceDisplay = document.getElementById('book-price');
    if (priceDisplay) {
        priceDisplay.innerHTML = `<span>Price:</span> ${totalPrice.toFixed(2)}`;
    }
}

/**
 * Calculate book quote based on form inputs
 */
function calculateQuote() {
    const quoteForm = document.getElementById('quote-calculator');
    const resultContainer = document.getElementById('quote-result');
    if (!quoteForm || !resultContainer) return;

    // Get form values
    const bookType = quoteForm.querySelector('#book-type').value;
    const coverType = quoteForm.querySelector('#cover-type').value;
    const quantity = parseInt(quoteForm.querySelector('#quantity').value);

    // Base prices by book type
    const prices = {
        'fiction': 12.99,
        'non-fiction': 15.99,
        'textbook': 49.99,
        'children': 9.99
    };

    // Cover type multipliers
    const multipliers = {
        'paperback': 1,
        'hardcover': 1.5,
        'leather': 2,
        'digital': 0.7
    };

    // Calculate price
    let basePrice = prices[bookType] * multipliers[coverType];
    let subtotal = basePrice * quantity;

    // Apply bulk discount
    let discount = 0;
    if (quantity >= 10) {
        discount = 0.1; // 10% discount
    } else if (quantity >= 5) {
        discount = 0.05; // 5% discount
    }

    let discountAmount = subtotal * discount;
    let total = subtotal - discountAmount;

    // Display result
    resultContainer.innerHTML = `
        <h3>Quote Summary</h3>
        <p><strong>Book Type:</strong> ${bookType}</p>
        <p><strong>Cover Type:</strong> ${coverType}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Price Per Book:</strong> ${basePrice.toFixed(2)}</p>
        <p><strong>Subtotal:</strong> ${subtotal.toFixed(2)}</p>
        <p><strong>Discount (${(discount * 100)}%):</strong> ${discountAmount.toFixed(2)}</p>
        <p><strong>Total:</strong> ${total.toFixed(2)}</p>
    `;

    resultContainer.style.display = 'block';
}