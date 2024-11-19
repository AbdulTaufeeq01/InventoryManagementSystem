// Remove inventory and users variables
// Remove let loggedInUser, todaysSales, salesDetails

let loggedInUser = null;
let todaysSales = 0;
const salesDetails = [];

// Function to show different sections
function showSection(sectionId) {
  const sections = document.querySelectorAll("main > section");
  sections.forEach((section) => section.classList.add("hidden"));
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    targetSection.classList.remove("hidden");
    if (sectionId === "view-inventory") {
      populateInventory();
    }
  }
}

// Login Functionality
document
  .getElementById("login-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    try {
      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        const data = await response.json();
        loggedInUser = data.user.username;
        showSection("dashboard");
        document.getElementById("todays-sales").textContent =
          todaysSales.toFixed(2);
      } else {
        const errorData = await response.json();
        document.getElementById("login-error").textContent =
          errorData.message || "Invalid username or password.";
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

// Registration Functionality
document
  .getElementById("register-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        alert("Registration successful. Please log in.");
        showSection("login-section");
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

// Populate Inventory
async function populateInventory() {
  try {
    const response = await fetch("http://localhost:5000/api/products");
    if (response.ok) {
      const products = await response.json();
      const tbody = document
        .getElementById("inventory-table")
        .getElementsByTagName("tbody")[0];
      tbody.innerHTML = "";
      products.forEach((product, index) => {
        const row = tbody.insertRow();
        row.insertCell(0).textContent = product.productName;
        row.insertCell(1).textContent = product.sku;
        row.insertCell(2).textContent = product.category;
        row.insertCell(3).textContent = product.purchasePrice.toFixed(2);
        row.insertCell(4).textContent = product.retailPrice.toFixed(2);
        const actionsCell = row.insertCell(5);
        actionsCell.innerHTML = `
          <button onclick="editProduct('${product.sku}')">Edit</button>
          <button onclick="deleteProduct('${product.sku}')">Delete</button>
        `;
      });
    } else {
      console.error("Failed to fetch products.");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Add Product Form
document
  .getElementById("add-product-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();
    const productName = document.getElementById("product-name").value;
    const sku = document.getElementById("sku").value;
    const category = document.getElementById("category").value;
    const purchasePrice = parseFloat(
      document.getElementById("purchase-price").value
    );
    const retailPrice = parseFloat(
      document.getElementById("retail-price").value
    );

    const newProduct = {
      productName,
      sku,
      category,
      purchasePrice,
      retailPrice,
    };

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        alert("Product added successfully.");
        this.reset();
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to add product.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

// Store the original add product form submit handler
const originalAddProductSubmit =
  document.getElementById("add-product-form").onsubmit;

// Edit Product Functionality
function editProduct(sku) {
  // Fetch product details from backend
  fetch(`http://localhost:5000/api/products/${sku}`)
    .then((response) => response.json())
    .then((product) => {
      if (product) {
        showSection("add-product");
        document.getElementById("product-name").value = product.productName;
        document.getElementById("sku").value = product.sku;
        document.getElementById("sku").disabled = true; // prevent editing SKU
        document.getElementById("category").value = product.category;
        document.getElementById("purchase-price").value = product.purchasePrice;
        document.getElementById("retail-price").value = product.retailPrice;

        // Change form submit handler
        const form = document.getElementById("add-product-form");
        form.onsubmit = async function (event) {
          event.preventDefault();
          const updatedProduct = {
            productName: document.getElementById("product-name").value,
            sku: document.getElementById("sku").value,
            category: document.getElementById("category").value,
            purchasePrice: parseFloat(
              document.getElementById("purchase-price").value
            ),
            retailPrice: parseFloat(
              document.getElementById("retail-price").value
            ),
          };

          try {
            const response = await fetch(
              `http://localhost:5000/api/products/${sku}`,
              {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedProduct),
              }
            );
            if (response.ok) {
              alert("Product updated successfully.");
              form.reset();
              document.getElementById("sku").disabled = false;
              form.onsubmit = originalAddProductSubmit;
              showSection("view-inventory");
            } else {
              const errorData = await response.json();
              alert(errorData.message || "Failed to update product.");
            }
          } catch (error) {
            console.error("Error:", error);
          }
        };
      }
    })
    .catch((error) => console.error("Error:", error));
}

// Delete Product Functionality
function deleteProduct(sku) {
  if (confirm("Are you sure you want to delete this product?")) {
    fetch(`http://localhost:5000/api/products/${sku}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        alert(data.message);
        populateInventory();
      })
      .catch((error) => console.error("Error:", error));
  }
}

// Sales Functionality
document
  .getElementById("add-to-bill")
  .addEventListener("click", async function () {
    const salesSku = document.getElementById("sales-sku").value;
    const salesQuantity = parseInt(
      document.getElementById("sales-quantity").value
    );

    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${salesSku}`
      );
      if (response.ok) {
        const product = await response.json();
        if (product) {
          const totalSales = product.retailPrice * salesQuantity;
          todaysSales += totalSales; // Update today's sales
          document.getElementById("todays-sales").textContent =
            todaysSales.toFixed(2); // Update dashboard sales
          // Add to sales details
          salesDetails.push({
            productName: product.productName,
            sku: product.sku,
            quantity: salesQuantity,
            unitPrice: product.retailPrice,
            total: totalSales,
          });
          // Update sales table
          updateSalesTable();
          document.getElementById(
            "sales-result"
          ).textContent = `Added: ${salesQuantity} x ${product.productName} (SKU: ${salesSku}) to bill.`;
          document.getElementById("generate-bill").classList.remove("hidden"); // Show generate bill button
        } else {
          document.getElementById("sales-result").textContent =
            "Product not found.";
        }
      } else {
        console.error("Failed to fetch product.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });

// Update Sales Table
function updateSalesTable() {
  const tbody = document
    .getElementById("sales-table")
    .getElementsByTagName("tbody")[0];
  tbody.innerHTML = "";
  let totalBill = 0;
  salesDetails.forEach((item) => {
    const row = tbody.insertRow();
    row.insertCell(0).textContent = item.productName;
    row.insertCell(1).textContent = item.sku;
    row.insertCell(2).textContent = item.quantity;
    row.insertCell(3).textContent = item.unitPrice.toFixed(2);
    row.insertCell(4).textContent = item.total.toFixed(2);
    totalBill += item.total;
  });
  document.getElementById(
    "total-bill"
  ).textContent = `Total Bill: ₹${totalBill.toFixed(2)}`;
  document.getElementById("sales-table").classList.remove("hidden");
}

// Generate Bill Functionality
document.getElementById("generate-bill").addEventListener("click", function () {
  alert("Bill generated successfully!");
  salesDetails.length = 0; // Clear sales details
  todaysSales = 0; // Reset today's sales
  document.getElementById("todays-sales").textContent = todaysSales.toFixed(2); // Update dashboard
  document.getElementById("sales-table").classList.add("hidden"); // Hide sales table
  document.getElementById("sales-result").textContent = ""; // Clear sales result
  this.classList.add("hidden"); // Hide generate bill button
  document.getElementById("sales-sku").value = ""; // Clear input
  document.getElementById("sales-quantity").value = ""; // Clear input
  document.getElementById("total-bill").textContent = "";
});

// Feedback Submission
document
  .getElementById("feedback-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const feedback = document.getElementById("feedback-input").value;
    document.getElementById("feedback-response").textContent =
      "Feedback submitted successfully! Thank you!";
    this.reset();
  });

// Contact Form Submission
document
  .getElementById("contact-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    alert("Your message has been sent successfully!");
    this.reset();
  });
