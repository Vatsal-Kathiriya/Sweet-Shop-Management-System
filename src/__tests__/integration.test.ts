import { SweetShopApp } from '../index';
import { Sweet } from '../models/Sweet';

describe('SweetShopApp Integration Tests', () => {
  let app: SweetShopApp;

  beforeEach(() => {
    app = new SweetShopApp();
  });

  describe('Application Initialization', () => {
    it('should initialize with sample data', () => {
      // Act
      const sweetShop = app.getSweetShop();
      const allSweets = sweetShop.getAllSweets();

      // Assert
      expect(allSweets.length).toBeGreaterThan(0);
      expect(allSweets.some(sweet => sweet.name === 'Kaju Katli')).toBe(true);
      expect(allSweets.some(sweet => sweet.name === 'Gajar Halwa')).toBe(true);
      expect(allSweets.some(sweet => sweet.name === 'Gulab Jamun')).toBe(true);
    });

    it('should have different categories of sweets', () => {
      // Act
      const sweetShop = app.getSweetShop();
      const allSweets = sweetShop.getAllSweets();
      const categories = [...new Set(allSweets.map(sweet => sweet.category))];

      // Assert
      expect(categories).toContain('Nut-Based');
      expect(categories).toContain('Milk-Based');
      expect(categories).toContain('Vegetable-Based');
    });
  });

  describe('Complete Workflow Integration', () => {
    it('should handle complete buy-sell-restock workflow', () => {
      // Arrange
      const sweetShop = app.getSweetShop();
      const kajuKatli = sweetShop.findSweetById(1001);
      const initialQuantity = kajuKatli?.quantity || 0;

      // Act & Assert - Purchase
      expect(() => {
        sweetShop.purchaseSweet(1001, 5);
      }).not.toThrow();

      const afterPurchase = sweetShop.findSweetById(1001);
      expect(afterPurchase?.quantity).toBe(initialQuantity - 5);

      // Act & Assert - Restock
      expect(() => {
        sweetShop.restockSweet(1001, 10);
      }).not.toThrow();

      const afterRestock = sweetShop.findSweetById(1001);
      expect(afterRestock?.quantity).toBe(initialQuantity - 5 + 10);
    });

    it('should handle search operations across all criteria', () => {
      // Arrange
      const sweetShop = app.getSweetShop();

      // Act & Assert - Search by name
      const nameResults = sweetShop.searchSweetsByName('Gulab');
      expect(nameResults.length).toBeGreaterThan(0);
      expect(nameResults.every(sweet => sweet.name.includes('Gulab'))).toBe(true);

      // Act & Assert - Search by category
      const categoryResults = sweetShop.searchSweetsByCategory('Milk-Based');
      expect(categoryResults.length).toBeGreaterThan(0);
      expect(categoryResults.every(sweet => sweet.category === 'Milk-Based')).toBe(true);

      // Act & Assert - Search by price range
      const priceResults = sweetShop.searchSweetsByPriceRange(10, 50);
      expect(priceResults.length).toBeGreaterThan(0);
      expect(priceResults.every(sweet => sweet.price >= 10 && sweet.price <= 50)).toBe(true);
    });

    it('should handle inventory management operations', () => {
      // Arrange
      const sweetShop = app.getSweetShop();

      // Act & Assert - Total inventory
      const totalCount = sweetShop.getTotalInventoryCount();
      expect(totalCount).toBeGreaterThan(0);

      // Act & Assert - Inventory value
      const totalValue = sweetShop.getInventoryValue();
      expect(totalValue).toBeGreaterThan(0);

      // Act & Assert - Stock management
      const outOfStockBefore = sweetShop.getOutOfStockSweets();
      const lowStockBefore = sweetShop.getLowStockSweets(5);

      // Purchase all of one sweet to test out of stock
      const sweet = sweetShop.findSweetById(1002);
      if (sweet) {
        sweetShop.purchaseSweet(1002, sweet.quantity);
        const outOfStockAfter = sweetShop.getOutOfStockSweets();
        expect(outOfStockAfter.length).toBe(outOfStockBefore.length + 1);
        
        // Test low stock functionality
        const lowStockAfter = sweetShop.getLowStockSweets(5);
        expect(lowStockAfter.length).toBeGreaterThanOrEqual(lowStockBefore.length);
      }
    });

    it('should handle error scenarios gracefully', () => {
      // Arrange
      const sweetShop = app.getSweetShop();

      // Act & Assert - Purchase non-existent sweet
      expect(() => {
        sweetShop.purchaseSweet(9999, 1);
      }).toThrow('Sweet with ID 9999 not found');

      // Act & Assert - Purchase more than available
      expect(() => {
        sweetShop.purchaseSweet(1001, 1000);
      }).toThrow('Insufficient stock');

      // Act & Assert - Restock non-existent sweet
      expect(() => {
        sweetShop.restockSweet(9999, 10);
      }).toThrow('Sweet with ID 9999 not found');

      // Act & Assert - Add duplicate sweet
      const duplicateSweet = new Sweet(1001, 'Duplicate', 'Test', 10, 5);
      expect(() => {
        sweetShop.addSweet(duplicateSweet);
      }).toThrow('Sweet with ID 1001 already exists');
    });
  });

  describe('Sorting and Advanced Operations', () => {
    it('should sort sweets by different criteria', () => {
      // Arrange
      const sweetShop = app.getSweetShop();

      // Act & Assert - Sort by name
      const sortedByName = sweetShop.getSortedSweets('name', true);
      expect(sortedByName.length).toBeGreaterThan(1);
      
      for (let i = 1; i < sortedByName.length; i++) {
        expect(sortedByName[i].name.localeCompare(sortedByName[i-1].name)).toBeGreaterThanOrEqual(0);
      }

      // Act & Assert - Sort by price (descending)
      const sortedByPrice = sweetShop.getSortedSweets('price', false);
      expect(sortedByPrice.length).toBeGreaterThan(1);
      
      for (let i = 1; i < sortedByPrice.length; i++) {
        expect(sortedByPrice[i].price).toBeLessThanOrEqual(sortedByPrice[i-1].price);
      }
    });

    it('should handle edge cases in inventory management', () => {
      // Arrange
      const sweetShop = app.getSweetShop();

      // Act & Assert - Empty search results
      const emptyResults = sweetShop.searchSweetsByName('NonExistentSweet');
      expect(emptyResults).toHaveLength(0);

      // Act & Assert - Invalid price range
      const invalidPriceResults = sweetShop.searchSweetsByPriceRange(1000, 2000);
      expect(invalidPriceResults).toHaveLength(0);

      // Act & Assert - Clear all sweets
      sweetShop.clearAllSweets();
      expect(sweetShop.getAllSweets()).toHaveLength(0);
      expect(sweetShop.getTotalInventoryCount()).toBe(0);
      expect(sweetShop.getInventoryValue()).toBe(0);
    });
  });
});
