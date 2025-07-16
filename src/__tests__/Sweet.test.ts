import { Sweet } from '../models/Sweet';

describe('Sweet Model', () => {
  describe('Sweet Creation', () => {
    it('should create a sweet with all required properties', () => {
      // Arrange
      const sweetData = {
        id: 1001,
        name: 'Kaju Katli',
        category: 'Nut-Based',
        price: 50,
        quantity: 20,
      };

      // Act
      const sweet = new Sweet(
        sweetData.id,
        sweetData.name,
        sweetData.category,
        sweetData.price,
        sweetData.quantity
      );

      // Assert
      expect(sweet.id).toBe(1001);
      expect(sweet.name).toBe('Kaju Katli');
      expect(sweet.category).toBe('Nut-Based');
      expect(sweet.price).toBe(50);
      expect(sweet.quantity).toBe(20);
    });

    it('should throw error when creating sweet with invalid price', () => {
      // Arrange & Act & Assert
      expect(() => {
        new Sweet(1001, 'Kaju Katli', 'Nut-Based', -10, 20);
      }).toThrow('Price must be greater than 0');
    });

    it('should throw error when creating sweet with invalid quantity', () => {
      // Arrange & Act & Assert
      expect(() => {
        new Sweet(1001, 'Kaju Katli', 'Nut-Based', 50, -5);
      }).toThrow('Quantity must be greater than or equal to 0');
    });

    it('should throw error when creating sweet with empty name', () => {
      // Arrange & Act & Assert
      expect(() => {
        new Sweet(1001, '', 'Nut-Based', 50, 20);
      }).toThrow('Name cannot be empty');
    });

    it('should throw error when creating sweet with empty category', () => {
      // Arrange & Act & Assert
      expect(() => {
        new Sweet(1001, 'Kaju Katli', '', 50, 20);
      }).toThrow('Category cannot be empty');
    });
  });

  describe('Sweet Methods', () => {
    let sweet: Sweet;

    beforeEach(() => {
      sweet = new Sweet(1001, 'Kaju Katli', 'Nut-Based', 50, 20);
    });

    it('should update quantity when restocking', () => {
      // Arrange
      const initialQuantity = sweet.quantity;
      const restockAmount = 10;

      // Act
      sweet.restock(restockAmount);

      // Assert
      expect(sweet.quantity).toBe(initialQuantity + restockAmount);
    });

    it('should throw error when restocking with invalid amount', () => {
      // Arrange & Act & Assert
      expect(() => {
        sweet.restock(-5);
      }).toThrow('Restock amount must be greater than 0');
    });

    it('should reduce quantity when purchasing', () => {
      // Arrange
      const initialQuantity = sweet.quantity;
      const purchaseAmount = 5;

      // Act
      sweet.purchase(purchaseAmount);

      // Assert
      expect(sweet.quantity).toBe(initialQuantity - purchaseAmount);
    });

    it('should throw error when purchasing more than available stock', () => {
      // Arrange & Act & Assert
      expect(() => {
        sweet.purchase(25); // More than available quantity (20)
      }).toThrow('Insufficient stock. Available: 20, Requested: 25');
    });

    it('should throw error when purchasing with invalid amount', () => {
      // Arrange & Act & Assert
      expect(() => {
        sweet.purchase(-3);
      }).toThrow('Purchase amount must be greater than 0');
    });

    it('should return true when sweet is in stock', () => {
      // Act & Assert
      expect(sweet.isInStock()).toBe(true);
    });

    it('should return false when sweet is out of stock', () => {
      // Arrange
      sweet.purchase(20); // Purchase all available stock

      // Act & Assert
      expect(sweet.isInStock()).toBe(false);
    });
  });
});
