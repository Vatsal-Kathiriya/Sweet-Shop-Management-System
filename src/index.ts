import { SweetShop } from './services/SweetShop';
import { Sweet } from './models/Sweet';

/**
 * Main application entry point for Sweet Shop Management System
 */
export class SweetShopApp {
  private sweetShop: SweetShop;

  constructor() {
    this.sweetShop = new SweetShop();
    this.initializeWithSampleData();
  }

  /**
   * Initializes the shop with sample data
   */
  private initializeWithSampleData(): void {
    const sampleSweets = [
      new Sweet(1001, 'Kaju Katli', 'Nut-Based', 50, 20),
      new Sweet(1002, 'Gajar Halwa', 'Vegetable-Based', 30, 15),
      new Sweet(1003, 'Gulab Jamun', 'Milk-Based', 10, 50),
      new Sweet(1004, 'Rasgulla', 'Milk-Based', 8, 30),
      new Sweet(1005, 'Badam Burfi', 'Nut-Based', 60, 25),
    ];

    sampleSweets.forEach(sweet => {
      try {
        this.sweetShop.addSweet(sweet);
      } catch (error) {
        console.error(`Error adding sweet: ${error}`);
      }
    });
  }

  /**
   * Gets the SweetShop instance
   */
  public getSweetShop(): SweetShop {
    return this.sweetShop;
  }

  /**
   * Displays all sweets in a formatted way
   */
  public displayAllSweets(): void {
    const sweets = this.sweetShop.getAllSweets();
    
    if (sweets.length === 0) {
      console.log('No sweets available in the shop.');
      return;
    }

    console.log('\n=== SWEET SHOP INVENTORY ===');
    console.log('ID\t| Name\t\t| Category\t| Price\t| Quantity');
    console.log('-'.repeat(60));
    
    sweets.forEach(sweet => {
      console.log(
        `${sweet.id}\t| ${sweet.name.padEnd(12)}\t| ${sweet.category.padEnd(10)}\t| ₹${sweet.price}\t| ${sweet.quantity}`
      );
    });
    
    console.log('-'.repeat(60));
    console.log(`Total Sweets: ${sweets.length}`);
    console.log(`Total Inventory: ${this.sweetShop.getTotalInventoryCount()} items`);
    console.log(`Total Value: ₹${this.sweetShop.getInventoryValue()}`);
  }

  /**
   * Displays search results
   */
  public displaySearchResults(sweets: Sweet[], searchType: string, searchTerm: string): void {
    console.log(`\n=== SEARCH RESULTS: ${searchType.toUpperCase()} "${searchTerm}" ===`);
    
    if (sweets.length === 0) {
      console.log('No sweets found matching your search criteria.');
      return;
    }

    console.log('ID\t| Name\t\t| Category\t| Price\t| Quantity');
    console.log('-'.repeat(60));
    
    sweets.forEach(sweet => {
      console.log(
        `${sweet.id}\t| ${sweet.name.padEnd(12)}\t| ${sweet.category.padEnd(10)}\t| ₹${sweet.price}\t| ${sweet.quantity}`
      );
    });
    
    console.log(`\nFound ${sweets.length} sweet(s) matching your search.`);
  }

  /**
   * Displays inventory status
   */
  public displayInventoryStatus(): void {
    console.log('\n=== INVENTORY STATUS ===');
    
    const outOfStock = this.sweetShop.getOutOfStockSweets();
    const lowStock = this.sweetShop.getLowStockSweets(10);
    
    if (outOfStock.length > 0) {
      console.log('\n🚨 OUT OF STOCK:');
      outOfStock.forEach(sweet => {
        console.log(`- ${sweet.name} (ID: ${sweet.id})`);
      });
    }
    
    if (lowStock.length > 0) {
      console.log('\n⚠️  LOW STOCK (≤10 items):');
      lowStock.forEach(sweet => {
        console.log(`- ${sweet.name} (ID: ${sweet.id}) - ${sweet.quantity} remaining`);
      });
    }
    
    if (outOfStock.length === 0 && lowStock.length === 0) {
      console.log('✅ All sweets are adequately stocked!');
    }
  }

  /**
   * Demonstrates the system functionality
   */
  public demonstrateSystem(): void {
    console.log('🍬 Welcome to Sweet Shop Management System! 🍬');
    console.log('='.repeat(50));
    
    // Display initial inventory
    this.displayAllSweets();
    
    // Search demonstrations
    console.log('\n📍 SEARCH DEMONSTRATIONS:');
    
    // Search by name
    const nameResults = this.sweetShop.searchSweetsByName('Kaju');
    this.displaySearchResults(nameResults, 'name', 'Kaju');
    
    // Search by category
    const categoryResults = this.sweetShop.searchSweetsByCategory('Milk-Based');
    this.displaySearchResults(categoryResults, 'category', 'Milk-Based');
    
    // Search by price range
    const priceResults = this.sweetShop.searchSweetsByPriceRange(40, 60);
    this.displaySearchResults(priceResults, 'price range', '₹40-₹60');
    
    // Purchase demonstration
    console.log('\n🛒 PURCHASE DEMONSTRATION:');
    try {
      console.log('Purchasing 5 Kaju Katli...');
      this.sweetShop.purchaseSweet(1001, 5);
      console.log('✅ Purchase successful!');
      
      const sweet = this.sweetShop.findSweetById(1001);
      console.log(`Remaining Kaju Katli: ${sweet?.quantity}`);
    } catch (error) {
      console.error(`❌ Purchase failed: ${error}`);
    }
    
    // Restock demonstration
    console.log('\n📦 RESTOCK DEMONSTRATION:');
    try {
      console.log('Restocking 15 Gulab Jamun...');
      this.sweetShop.restockSweet(1003, 15);
      console.log('✅ Restock successful!');
      
      const sweet = this.sweetShop.findSweetById(1003);
      console.log(`New Gulab Jamun quantity: ${sweet?.quantity}`);
    } catch (error) {
      console.error(`❌ Restock failed: ${error}`);
    }
    
    // Display inventory status
    this.displayInventoryStatus();
    
    // Display updated inventory
    console.log('\n📊 UPDATED INVENTORY:');
    this.displayAllSweets();
  }
}

/**
 * Main function to run the application
 */
function main(): void {
  try {
    const app = new SweetShopApp();
    app.demonstrateSystem();
  } catch (error) {
    console.error('Application error:', error);
    process.exit(1);
  }
}

// Run the application if this file is executed directly
if (require.main === module) {
  main();
}

export default SweetShopApp;
