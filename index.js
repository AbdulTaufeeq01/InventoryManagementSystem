const inventory = [
    { productName: 'Rice', sku: 'SKU0001', category: 'Grains', purchasePrice: 40, retailPrice: 50 },
    { productName: 'Wheat Flour', sku: 'SKU0002', category: 'Grains', purchasePrice: 35, retailPrice: 45 },
    { productName: 'Sugar', sku: 'SKU0003', category: 'Essentials', purchasePrice: 30, retailPrice: 40 },
    { productName: 'Milk', sku: 'SKU0004', category: 'Dairy', purchasePrice: 20, retailPrice: 30 },
    { productName: 'Eggs', sku: 'SKU0005', category: 'Dairy', purchasePrice: 5, retailPrice: 10 },
    { productName: 'Chicken', sku: 'SKU0006', category: 'Meat', purchasePrice: 150, retailPrice: 200 },
    { productName: 'Tomatoes', sku: 'SKU0007', category: 'Vegetables', purchasePrice: 20, retailPrice: 25 },
    { productName: 'Potatoes', sku: 'SKU0008', category: 'Vegetables', purchasePrice: 15, retailPrice: 20 },
    { productName: 'Onions', sku: 'SKU0009', category: 'Vegetables', purchasePrice: 10, retailPrice: 15 },
    { productName: 'Apples', sku: 'SKU0010', category: 'Fruits', purchasePrice: 80, retailPrice: 100 },
    { productName: 'Bananas', sku: 'SKU0011', category: 'Fruits', purchasePrice: 30, retailPrice: 40 },
    { productName: 'Oranges', sku: 'SKU0012', category: 'Fruits', purchasePrice: 60, retailPrice: 80 },
    { productName: 'Bread', sku: 'SKU0013', category: 'Bakery', purchasePrice: 25, retailPrice: 35 },
    { productName: 'Biscuits', sku: 'SKU0014', category: 'Snacks', purchasePrice: 15, retailPrice: 25 },
    { productName: 'Chips', sku: 'SKU0015', category: 'Snacks', purchasePrice: 10, retailPrice: 15 },
    { productName: 'Soda', sku: 'SKU0016', category: 'Beverages', purchasePrice: 30, retailPrice: 40 },
    { productName: 'Coffee', sku: 'SKU0017', category: 'Beverages', purchasePrice: 200, retailPrice: 250 },
    { productName: 'Tea', sku: 'SKU0018', category: 'Beverages', purchasePrice: 100, retailPrice: 120 },
    { productName: 'Spices', sku: 'SKU0019', category: 'Essentials', purchasePrice: 50, retailPrice: 60 },
    { productName: 'Pasta', sku: 'SKU0020', category: 'Grains', purchasePrice: 40, retailPrice: 50 },
    { productName: 'Canned Beans', sku: 'SKU0021', category: 'Canned Goods', purchasePrice: 20, retailPrice: 30 },
    { productName: 'Frozen Vegetables', sku: 'SKU0022', category: 'Frozen', purchasePrice: 60, retailPrice: 80 },
    { productName: 'Ice Cream', sku: 'SKU0023', category: 'Frozen', purchasePrice: 100, retailPrice: 120 },
    ];
    const users = {};
    let loggedInUser = null;
    let todaysSales = 0;
    const salesDetails = [];
    function showSection(sectionId) {
    const sections = document.querySelectorAll('main > section');
    sections.forEach(section => section.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
    }
    // Login Functionality
    document.getElementById('login-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    if (users[username] && users[username] === password) {
    loggedInUser = username;
    showSection('dashboard');
    document.getElementById('todays-sales').textContent = todaysSales.toFixed(2);
    } else {
    document.getElementById('login-error').textContent = 'Invalid username or password.';
    }
    });
    // Registration Functionality
    document.getElementById('register-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    users[username] = password;
    alert('Registration successful. Please log in.');
    showSection('login-section');
    });
    // Populate Inventory
    function populateInventory() {
    const tbody = document.getElementById('inventory-table').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    inventory.forEach((product, index) => {
    const row = tbody.insertRow();
    row.insertCell(0).textContent = product.productName;
    row.insertCell(1).textContent = product.sku;
    row.insertCell(2).textContent = product.category;
    row.insertCell(3).textContent = product.purchasePrice.toFixed(2);
    row.insertCell(4).textContent = product.retailPrice.toFixed(2);
    const actionsCell = row.insertCell(5);
    actionsCell.innerHTML = `
    <button onclick="editProduct(${index})">Edit</button>
    <button onclick="deleteProduct(${index})">Delete</button>
    `;
    });
    }
    populateInventory();
    // Add Product Form
    document.getElementById('add-product-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const productName = document.getElementById('product-name').value;
    const sku = document.getElementById('sku').value;
    const category = document.getElementById('category').value;
    const purchasePrice = parseFloat(document.getElementById('purchase-price').value);
    const retailPrice = parseFloat(document.getElementById('retail-price').value);
    const newProduct = { productName, sku, category, purchasePrice, retailPrice };
    inventory.push(newProduct);
    populateInventory();
    this.reset();
    });
    // Edit Product Functionality
    function editProduct(index) {
    const product = inventory[index];
    document.getElementById('product-name').value = product.productName;
    document.getElementById('sku').value = product.sku;
    document.getElementById('category').value = product.category;
    document.getElementById('purchase-price').value = product.purchasePrice;
    document.getElementById('retail-price').value = product.retailPrice;
    document.getElementById('add-product-form').onsubmit = function (event) {
    event.preventDefault();
    inventory[index] = {
    productName: document.getElementById('product-name').value,
    sku: document.getElementById('sku').value,
    category: document.getElementById('category').value,
    purchasePrice: parseFloat(document.getElementById('purchase-price').value),
    retailPrice: parseFloat(document.getElementById('retail-price').value)
    };
    populateInventory();
    this.reset();
    this.onsubmit = originalAddProductSubmit; // Restore original submit function
    };
    }
    // Delete Product Functionality
    function deleteProduct(index) {
    inventory.splice(index, 1);
    populateInventory();
    }
    // Add to Bill Functionality
    document.getElementById('add-to-bill').addEventListener('click', function () {
    const salesSku = document.getElementById('sales-sku').value;
    const salesQuantity = parseInt(document.getElementById('sales-quantity').value);
    const product = inventory.find(item => item.sku === salesSku);
    if (product) {
    const totalSales = product.retailPrice * salesQuantity;
    todaysSales += totalSales; // Update today's sales
    document.getElementById('todays-sales').textContent = todaysSales.toFixed(2); // Update dashboard sales
    // Add to sales details
    salesDetails.push({ productName: product.productName, sku: product.sku, quantity: salesQuantity, unitPrice: product.retailPrice, total: totalSales });
    // Update sales table
    updateSalesTable();
    document.getElementById('sales-result').textContent = `Added: ${salesQuantity} x ${product.productName} (SKU: ${salesSku}) to bill.`;
    document.getElementById('generate-bill').classList.remove('hidden'); // Show generate bill button
    } else {
    document.getElementById('sales-result').textContent = 'Product not found.';
    }
    this.reset();
    });
    // Update Sales Table
    function updateSalesTable() {
    const tbody = document.getElementById('sales-table').getElementsByTagName('tbody')[0];
    tbody.innerHTML = '';
    let totalBill = 0;
    salesDetails.forEach(item => {
    const row = tbody.insertRow();
    row.insertCell(0).textContent = item.productName;
    row.insertCell(1).textContent = item.sku;
    row.insertCell(2).textContent = item.quantity;
    row.insertCell(3).textContent = item.unitPrice.toFixed(2);
    row.insertCell(4).textContent = item.total.toFixed(2);
    totalBill += item.total;
    });
    document.getElementById('total-bill').textContent = `Total Bill: ₹${totalBill.toFixed(2)}`;
    document.getElementById('sales-table').classList.remove('hidden');
    }
    function calculateProfitLoss() {
    const profitLossAmount = currentMonthSales - previousMonthSales;
    const profitLossPercentage = (profitLossAmount / previousMonthSales * 100).toFixed(2);
    document.getElementById('profit-loss-amount').textContent = profitLossAmount.toFixed(2);
    document.getElementById('profit-loss-percentage').textContent = `${profitLossPercentage}%`;
    }
    let previousMonthSales = 0; // Assume you get this data from the database
    let currentMonthSales = 0;
    function updateFinancials(billTotal) {
    const previousMonthSales = 0; // Assume you get this data from the database
    const currentMonthSales = todaysSales + billTotal;
    const profitLoss = currentMonthSales - previousMonthSales;
    const profitLossPercent = (profitLoss / (previousMonthSales || 1)) * 100;
    document.getElementById('profit-loss-result').innerHTML =
    `Profit/Loss: ₹${profitLoss.toFixed(2)} (${profitLossPercent.toFixed(2)}%)`;
    }
    // Generate Bill Functionality
    document.getElementById('generate-bill').addEventListener('click', function () {
    alert('Bill generated successfully!');
    salesDetails.length = 0; // Clear sales details
    todaysSales = 0; // Reset today's sales
    document.getElementById('todays-sales').textContent = todaysSales.toFixed(2); // Update dashboard
    document.getElementById('sales-table').classList.add('hidden'); // Hide sales table
    document.getElementById('sales-result').textContent = ''; // Clear sales result
    this.classList.add('hidden'); // Hide generate bill button
    document.getElementById('sales-sku').value = ''; // Clear input
    document.getElementById('sales-quantity').value = ''; // Clear input
    });
    // Feedback Submission
    document.getElementById('feedback-form').addEventListener('submit', function (event) {
    event.preventDefault();
    const feedback = document.getElementById('feedback-input').value;
    document.getElementById('feedback-response').textContent = 'Feedback submitted successfully! Thank you!';
    this.reset();
    });
    // Contact Form Submission
    document.getElementById('contact-form').addEventListener('submit', function (event) {
    event.preventDefault();
    alert('Your message has been sent successfully!');
    this.reset();
    });
    function showSection(sectionId) {
        // Hide all sections
        const sections = document.querySelectorAll('section');
        sections.forEach(section => section.classList.add('hidden'));
    
        // Show the specified section
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
    }
    