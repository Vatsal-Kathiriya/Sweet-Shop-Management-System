// Sweet Shop Management System Frontend
class SweetShopFrontend {
    constructor() {
        // In a real application, this would connect to a backend API
        this.sweets = new Map();
        this.currentSweetId = null;
        this.init();
    }

    init() {
        this.initializeWithSampleData();
        this.attachEventListeners();
        this.updateUI();
    }

    // Initialize with sample data (simulating backend data)
    initializeWithSampleData() {
        const sampleSweets = [
            { id: 1001, name: 'Kaju Katli', category: 'Nut-Based', price: 50, quantity: 20 },
            { id: 1002, name: 'Gajar Halwa', category: 'Vegetable-Based', price: 30, quantity: 15 },
            { id: 1003, name: 'Gulab Jamun', category: 'Milk-Based', price: 10, quantity: 50 },
            { id: 1004, name: 'Rasgulla', category: 'Milk-Based', price: 8, quantity: 30 },
            { id: 1005, name: 'Badam Burfi', category: 'Nut-Based', price: 60, quantity: 25 },
            { id: 1006, name: 'Jalebi', category: 'Milk-Based', price: 12, quantity: 40 },
            { id: 1007, name: 'Samosa', category: 'Vegetable-Based', price: 15, quantity: 8 },
        ];

        sampleSweets.forEach(sweet => {
            this.sweets.set(sweet.id, sweet);
        });
    }

    // Attach event listeners
    attachEventListeners() {
        // Modal controls
        document.getElementById('addSweetBtn').addEventListener('click', () => {
            this.openModal('addSweetModal');
        });

        document.getElementById('refreshBtn').addEventListener('click', () => {
            this.updateUI();
            this.showNotification('Inventory refreshed!', 'success');
        });

        // Search functionality
        document.getElementById('searchType').addEventListener('change', (e) => {
            this.toggleSearchInputs(e.target.value);
        });

        document.getElementById('searchBtn').addEventListener('click', () => {
            this.performSearch();
        });

        document.getElementById('clearSearchBtn').addEventListener('click', () => {
            this.clearSearch();
        });

        // Form submissions
        document.getElementById('addSweetForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addSweet();
        });

        document.getElementById('purchaseForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.purchaseSweet();
        });

        document.getElementById('restockForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.restockSweet();
        });

        // Modal close handlers
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal').id);
            });
        });

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });

        // Cancel buttons
        document.getElementById('cancelAddBtn').addEventListener('click', () => {
            this.closeModal('addSweetModal');
        });

        document.getElementById('cancelPurchaseBtn').addEventListener('click', () => {
            this.closeModal('purchaseModal');
        });

        document.getElementById('cancelRestockBtn').addEventListener('click', () => {
            this.closeModal('restockModal');
        });
    }

    // Toggle search inputs based on search type
    toggleSearchInputs(searchType) {
        const searchInput = document.getElementById('searchInput');
        const minPrice = document.getElementById('minPrice');
        const maxPrice = document.getElementById('maxPrice');

        if (searchType === 'price') {
            searchInput.classList.add('hidden');
            minPrice.classList.remove('hidden');
            maxPrice.classList.remove('hidden');
        } else {
            searchInput.classList.remove('hidden');
            minPrice.classList.add('hidden');
            maxPrice.classList.add('hidden');
        }
    }

    // Perform search based on selected criteria
    performSearch() {
        const searchType = document.getElementById('searchType').value;
        let results = [];

        if (searchType === 'name') {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            results = Array.from(this.sweets.values()).filter(sweet => 
                sweet.name.toLowerCase().includes(searchTerm)
            );
        } else if (searchType === 'category') {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            results = Array.from(this.sweets.values()).filter(sweet => 
                sweet.category.toLowerCase().includes(searchTerm)
            );
        } else if (searchType === 'price') {
            const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
            const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;
            results = Array.from(this.sweets.values()).filter(sweet => 
                sweet.price >= minPrice && sweet.price <= maxPrice
            );
        }

        this.renderSweetsTable(results);
        this.showNotification(`Found ${results.length} sweet(s) matching your search`, 'success');
    }

    // Clear search and show all sweets
    clearSearch() {
        document.getElementById('searchInput').value = '';
        document.getElementById('minPrice').value = '';
        document.getElementById('maxPrice').value = '';
        this.renderSweetsTable(Array.from(this.sweets.values()));
        this.showNotification('Search cleared', 'success');
    }

    // Add new sweet
    addSweet() {
        const id = parseInt(document.getElementById('sweetId').value);
        const name = document.getElementById('sweetName').value;
        const category = document.getElementById('sweetCategory').value;
        const price = parseFloat(document.getElementById('sweetPrice').value);
        const quantity = parseInt(document.getElementById('sweetQuantity').value);

        // Validation
        if (this.sweets.has(id)) {
            this.showNotification(`Sweet with ID ${id} already exists!`, 'error');
            return;
        }

        if (price <= 0) {
            this.showNotification('Price must be greater than 0!', 'error');
            return;
        }

        if (quantity < 0) {
            this.showNotification('Quantity must be greater than or equal to 0!', 'error');
            return;
        }

        // Add sweet
        this.sweets.set(id, { id, name, category, price, quantity });
        this.closeModal('addSweetModal');
        this.updateUI();
        this.showNotification(`${name} added successfully!`, 'success');
        
        // Reset form
        document.getElementById('addSweetForm').reset();
    }

    // Purchase sweet
    purchaseSweet() {
        const purchaseQuantity = parseInt(document.getElementById('purchaseQuantity').value);
        const sweet = this.sweets.get(this.currentSweetId);

        if (purchaseQuantity > sweet.quantity) {
            this.showNotification(`Insufficient stock! Available: ${sweet.quantity}`, 'error');
            return;
        }

        if (purchaseQuantity <= 0) {
            this.showNotification('Purchase quantity must be greater than 0!', 'error');
            return;
        }

        // Update quantity
        sweet.quantity -= purchaseQuantity;
        this.sweets.set(this.currentSweetId, sweet);

        this.closeModal('purchaseModal');
        this.updateUI();
        this.showNotification(`Successfully purchased ${purchaseQuantity} ${sweet.name}!`, 'success');
    }

    // Restock sweet
    restockSweet() {
        const restockQuantity = parseInt(document.getElementById('restockQuantity').value);
        const sweet = this.sweets.get(this.currentSweetId);

        if (restockQuantity <= 0) {
            this.showNotification('Restock quantity must be greater than 0!', 'error');
            return;
        }

        // Update quantity
        sweet.quantity += restockQuantity;
        this.sweets.set(this.currentSweetId, sweet);

        this.closeModal('restockModal');
        this.updateUI();
        this.showNotification(`Successfully restocked ${restockQuantity} ${sweet.name}!`, 'success');
    }

    // Delete sweet
    deleteSweet(id) {
        if (confirm('Are you sure you want to delete this sweet?')) {
            const sweet = this.sweets.get(id);
            this.sweets.delete(id);
            this.updateUI();
            this.showNotification(`${sweet.name} deleted successfully!`, 'success');
        }
    }

    // Open purchase modal
    openPurchaseModal(id) {
        const sweet = this.sweets.get(id);
        this.currentSweetId = id;
        
        document.getElementById('availableStock').textContent = `Available: ${sweet.quantity}`;
        document.getElementById('purchaseQuantity').max = sweet.quantity;
        
        this.openModal('purchaseModal');
    }

    // Open restock modal
    openRestockModal(id) {
        this.currentSweetId = id;
        this.openModal('restockModal');
    }

    // Generic modal open/close functions
    openModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Update the entire UI
    updateUI() {
        this.updateStats();
        this.renderSweetsTable(Array.from(this.sweets.values()));
    }

    // Update statistics
    updateStats() {
        const sweets = Array.from(this.sweets.values());
        const totalSweets = sweets.length;
        const totalInventory = sweets.reduce((sum, sweet) => sum + sweet.quantity, 0);
        const totalValue = sweets.reduce((sum, sweet) => sum + (sweet.price * sweet.quantity), 0);
        const lowStockCount = sweets.filter(sweet => sweet.quantity > 0 && sweet.quantity <= 10).length;

        document.getElementById('totalSweets').textContent = totalSweets;
        document.getElementById('totalInventory').textContent = totalInventory;
        document.getElementById('totalValue').textContent = `₹${totalValue.toLocaleString()}`;
        document.getElementById('lowStock').textContent = lowStockCount;
    }

    // Render sweets table
    renderSweetsTable(sweets) {
        const tbody = document.getElementById('sweetTableBody');
        tbody.innerHTML = '';

        sweets.forEach(sweet => {
            const row = this.createSweetRow(sweet);
            tbody.appendChild(row);
        });
    }

    // Create a sweet row
    createSweetRow(sweet) {
        const row = document.createElement('tr');
        row.className = 'fade-in';

        const statusClass = this.getStatusClass(sweet.quantity);
        const statusText = this.getStatusText(sweet.quantity);

        row.innerHTML = `
            <td>${sweet.id}</td>
            <td>${sweet.name}</td>
            <td>${sweet.category}</td>
            <td>₹${sweet.price}</td>
            <td>${sweet.quantity}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td class="actions-cell">
                <button class="btn btn-success" onclick="app.openPurchaseModal(${sweet.id})" ${sweet.quantity === 0 ? 'disabled' : ''}>
                    <i class="fas fa-shopping-cart"></i> Buy
                </button>
                <button class="btn btn-warning" onclick="app.openRestockModal(${sweet.id})">
                    <i class="fas fa-plus"></i> Restock
                </button>
                <button class="btn btn-danger" onclick="app.deleteSweet(${sweet.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;

        return row;
    }

    // Get status class based on quantity
    getStatusClass(quantity) {
        if (quantity === 0) return 'status-out-of-stock';
        if (quantity <= 10) return 'status-low-stock';
        return 'status-in-stock';
    }

    // Get status text based on quantity
    getStatusText(quantity) {
        if (quantity === 0) return 'Out of Stock';
        if (quantity <= 10) return 'Low Stock';
        return 'In Stock';
    }

    // Show notification
    showNotification(message, type = 'success') {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SweetShopFrontend();
});

// Add some utility functions for better UX
document.addEventListener('keydown', (e) => {
    // Close modal on Escape key
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            if (modal.style.display === 'block') {
                app.closeModal(modal.id);
            }
        });
    }
});

// Add loading states for better UX
function showLoading(element) {
    element.classList.add('loading');
}

function hideLoading(element) {
    element.classList.remove('loading');
}

// Export for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SweetShopFrontend;
}
