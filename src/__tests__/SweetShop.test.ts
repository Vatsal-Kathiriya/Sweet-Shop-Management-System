import { SweetShop } from '../services/SweetShop';
import { Sweet } from '../models/Sweet';

describe('SweetShop Service', () => {
  let sweetShop: SweetShop;
  let sampleSweets: Sweet[];

  beforeEach(() => {
    sweetShop = new SweetShop();
    sampleSweets = [
      new Sweet(1001, 'Kaju Katli', 'Nut-Based', 50, 20),
      new Sweet(1002, 'Gajar Halwa', 'Vegetable-Based', 30, 15),
      new Sweet(1003, 'Gulab Jamun', 'Milk-Based', 10, 50),
    ];
  });

  describe('Adding Sweets', () => {
    it('should add a new sweet to the shop', () => {
      // Arrange
      const sweet = sampleSweets[0];

      // Act
      sweetShop.addSweet(sweet);

      // Assert
      expect(sweetShop.getAllSweets()).toContain(sweet);
      expect(sweetShop.getAllSweets()).toHaveLength(1);
    });

    it('should throw error when adding sweet with duplicate ID', () => {
      // Arrange
      const sweet1 = sampleSweets[0];
      const sweet2 = new Sweet(1001, 'Duplicate Sweet', 'Nut-Based', 40, 10);
      sweetShop.addSweet(sweet1);

      // Act & Assert
      expect(() => {
        sweetShop.addSweet(sweet2);
      }).toThrow('Sweet with ID 1001 already exists');
    });

    it('should add multiple sweets successfully', () => {
      // Act
      sampleSweets.forEach(sweet => sweetShop.addSweet(sweet));

      // Assert
      expect(sweetShop.getAllSweets()).toHaveLength(3);
    });
  });

  describe('Deleting Sweets', () => {
    beforeEach(() => {
      sampleSweets.forEach(sweet => sweetShop.addSweet(sweet));
    });

    it('should delete a sweet by ID', () => {
      // Arrange
      const initialCount = sweetShop.getAllSweets().length;

      // Act
      const result = sweetShop.deleteSweet(1001);

      // Assert
      expect(result).toBe(true);
      expect(sweetShop.getAllSweets()).toHaveLength(initialCount - 1);
      expect(sweetShop.findSweetById(1001)).toBeUndefined();
    });

    it('should return false when trying to delete non-existent sweet', () => {
      // Act
      const result = sweetShop.deleteSweet(9999);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('Viewing Sweets', () => {
    beforeEach(() => {
      sampleSweets.forEach(sweet => sweetShop.addSweet(sweet));
    });

    it('should return all sweets', () => {
      // Act
      const allSweets = sweetShop.getAllSweets();

      // Assert
      expect(allSweets).toHaveLength(3);
      expect(allSweets).toEqual(expect.arrayContaining(sampleSweets));
    });

    it('should return empty array when no sweets exist', () => {
      // Arrange
      const emptyShop = new SweetShop();

      // Act
      const allSweets = emptyShop.getAllSweets();

      // Assert
      expect(allSweets).toHaveLength(0);
    });

    it('should find sweet by ID', () => {
      // Act
      const foundSweet = sweetShop.findSweetById(1002);

      // Assert
      expect(foundSweet).toBeDefined();
      expect(foundSweet?.name).toBe('Gajar Halwa');
    });

    it('should return undefined when sweet ID not found', () => {
      // Act
      const foundSweet = sweetShop.findSweetById(9999);

      // Assert
      expect(foundSweet).toBeUndefined();
    });
  });

  describe('Searching Sweets', () => {
    beforeEach(() => {
      sampleSweets.forEach(sweet => sweetShop.addSweet(sweet));
    });

    it('should search sweets by name', () => {
      // Act
      const results = sweetShop.searchSweetsByName('Kaju');

      // Assert
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Kaju Katli');
    });

    it('should search sweets by name case-insensitively', () => {
      // Act
      const results = sweetShop.searchSweetsByName('KAJU');

      // Assert
      expect(results).toHaveLength(1);
      expect(results[0].name).toBe('Kaju Katli');
    });

    it('should search sweets by category', () => {
      // Act
      const results = sweetShop.searchSweetsByCategory('Nut-Based');

      // Assert
      expect(results).toHaveLength(1);
      expect(results[0].category).toBe('Nut-Based');
    });

    it('should search sweets by price range', () => {
      // Act
      const results = sweetShop.searchSweetsByPriceRange(25, 55);

      // Assert
      expect(results).toHaveLength(2);
      expect(results.map(s => s.name)).toEqual(
        expect.arrayContaining(['Kaju Katli', 'Gajar Halwa'])
      );
    });

    it('should return empty array when no matches found', () => {
      // Act
      const results = sweetShop.searchSweetsByName('NonExistent');

      // Assert
      expect(results).toHaveLength(0);
    });
  });

  describe('Purchasing Sweets', () => {
    beforeEach(() => {
      sampleSweets.forEach(sweet => sweetShop.addSweet(sweet));
    });

    it('should purchase sweets successfully', () => {
      // Arrange
      const initialQuantity = sweetShop.findSweetById(1001)?.quantity || 0;

      // Act
      const result = sweetShop.purchaseSweet(1001, 5);

      // Assert
      expect(result).toBe(true);
      expect(sweetShop.findSweetById(1001)?.quantity).toBe(initialQuantity - 5);
    });

    it('should throw error when purchasing non-existent sweet', () => {
      // Act & Assert
      expect(() => {
        sweetShop.purchaseSweet(9999, 5);
      }).toThrow('Sweet with ID 9999 not found');
    });

    it('should throw error when purchasing more than available stock', () => {
      // Act & Assert
      expect(() => {
        sweetShop.purchaseSweet(1001, 25); // More than available (20)
      }).toThrow('Insufficient stock. Available: 20, Requested: 25');
    });
  });

  describe('Restocking Sweets', () => {
    beforeEach(() => {
      sampleSweets.forEach(sweet => sweetShop.addSweet(sweet));
    });

    it('should restock sweets successfully', () => {
      // Arrange
      const initialQuantity = sweetShop.findSweetById(1001)?.quantity || 0;

      // Act
      const result = sweetShop.restockSweet(1001, 10);

      // Assert
      expect(result).toBe(true);
      expect(sweetShop.findSweetById(1001)?.quantity).toBe(initialQuantity + 10);
    });

    it('should throw error when restocking non-existent sweet', () => {
      // Act & Assert
      expect(() => {
        sweetShop.restockSweet(9999, 10);
      }).toThrow('Sweet with ID 9999 not found');
    });
  });

  describe('Inventory Management', () => {
    beforeEach(() => {
      sampleSweets.forEach(sweet => sweetShop.addSweet(sweet));
    });

    it('should get total inventory count', () => {
      // Act
      const totalCount = sweetShop.getTotalInventoryCount();

      // Assert
      expect(totalCount).toBe(85); // 20 + 15 + 50
    });

    it('should get inventory value', () => {
      // Act
      const inventoryValue = sweetShop.getInventoryValue();

      // Assert
      expect(inventoryValue).toBe(1950); // (20*50) + (15*30) + (50*10) = 1000 + 450 + 500 = 1950
    });

    it('should get sweets that are out of stock', () => {
      // Arrange
      sweetShop.purchaseSweet(1002, 15); // Make Gajar Halwa out of stock

      // Act
      const outOfStockSweets = sweetShop.getOutOfStockSweets();

      // Assert
      expect(outOfStockSweets).toHaveLength(1);
      expect(outOfStockSweets[0].name).toBe('Gajar Halwa');
    });

    it('should get sweets with low stock', () => {
      // Arrange
      sweetShop.purchaseSweet(1001, 18); // Leave only 2 in stock

      // Act
      const lowStockSweets = sweetShop.getLowStockSweets(5);

      // Assert
      expect(lowStockSweets).toHaveLength(1);
      expect(lowStockSweets[0].name).toBe('Kaju Katli');
    });
  });
});
