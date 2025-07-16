import { Sweet } from '../models/Sweet';

/**
 * SweetShop service for managing sweet inventory and operations
 */
export class SweetShop {
  private sweets: Map<number, Sweet>;

  constructor() {
    this.sweets = new Map<number, Sweet>();
  }

  /**
   * Adds a new sweet to the shop
   * @param sweet - The sweet to add
   * @throws Error if sweet with same ID already exists
   */
  public addSweet(sweet: Sweet): void {
    if (this.sweets.has(sweet.id)) {
      throw new Error(`Sweet with ID ${sweet.id} already exists`);
    }

    this.sweets.set(sweet.id, sweet);
  }

  /**
   * Deletes a sweet from the shop by ID
   * @param id - The ID of the sweet to delete
   * @returns true if sweet was deleted, false if not found
   */
  public deleteSweet(id: number): boolean {
    return this.sweets.delete(id);
  }

  /**
   * Gets all sweets in the shop
   * @returns Array of all sweets
   */
  public getAllSweets(): Sweet[] {
    return Array.from(this.sweets.values());
  }

  /**
   * Finds a sweet by its ID
   * @param id - The ID of the sweet to find
   * @returns The sweet if found, undefined otherwise
   */
  public findSweetById(id: number): Sweet | undefined {
    return this.sweets.get(id);
  }

  /**
   * Searches for sweets by name (case-insensitive)
   * @param name - The name or partial name to search for
   * @returns Array of matching sweets
   */
  public searchSweetsByName(name: string): Sweet[] {
    const searchTerm = name.toLowerCase();
    return this.getAllSweets().filter(sweet =>
      sweet.name.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Searches for sweets by category
   * @param category - The category to search for
   * @returns Array of matching sweets
   */
  public searchSweetsByCategory(category: string): Sweet[] {
    return this.getAllSweets().filter(sweet =>
      sweet.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Searches for sweets within a price range
   * @param minPrice - Minimum price (inclusive)
   * @param maxPrice - Maximum price (inclusive)
   * @returns Array of matching sweets
   */
  public searchSweetsByPriceRange(minPrice: number, maxPrice: number): Sweet[] {
    return this.getAllSweets().filter(sweet =>
      sweet.price >= minPrice && sweet.price <= maxPrice
    );
  }

  /**
   * Purchases a sweet, reducing its quantity
   * @param id - The ID of the sweet to purchase
   * @param quantity - The quantity to purchase
   * @returns true if purchase was successful
   * @throws Error if sweet not found or insufficient stock
   */
  public purchaseSweet(id: number, quantity: number): boolean {
    const sweet = this.findSweetById(id);
    
    if (!sweet) {
      throw new Error(`Sweet with ID ${id} not found`);
    }

    sweet.purchase(quantity);
    return true;
  }

  /**
   * Restocks a sweet, increasing its quantity
   * @param id - The ID of the sweet to restock
   * @param quantity - The quantity to add
   * @returns true if restock was successful
   * @throws Error if sweet not found
   */
  public restockSweet(id: number, quantity: number): boolean {
    const sweet = this.findSweetById(id);
    
    if (!sweet) {
      throw new Error(`Sweet with ID ${id} not found`);
    }

    sweet.restock(quantity);
    return true;
  }

  /**
   * Gets the total count of all sweets in inventory
   * @returns Total quantity of all sweets
   */
  public getTotalInventoryCount(): number {
    return this.getAllSweets().reduce((total, sweet) => total + sweet.quantity, 0);
  }

  /**
   * Gets the total value of all sweets in inventory
   * @returns Total value (price * quantity) of all sweets
   */
  public getInventoryValue(): number {
    return this.getAllSweets().reduce(
      (total, sweet) => total + (sweet.price * sweet.quantity),
      0
    );
  }

  /**
   * Gets all sweets that are out of stock
   * @returns Array of sweets with quantity 0
   */
  public getOutOfStockSweets(): Sweet[] {
    return this.getAllSweets().filter(sweet => !sweet.isInStock());
  }

  /**
   * Gets all sweets with low stock (below threshold)
   * @param threshold - The stock threshold to check against
   * @returns Array of sweets with quantity below threshold
   */
  public getLowStockSweets(threshold: number): Sweet[] {
    return this.getAllSweets().filter(sweet => 
      sweet.quantity > 0 && sweet.quantity <= threshold
    );
  }

  /**
   * Gets sweets sorted by a specific criteria
   * @param criteria - The sorting criteria ('name', 'price', 'quantity', 'category')
   * @param ascending - Sort order (true for ascending, false for descending)
   * @returns Sorted array of sweets
   */
  public getSortedSweets(
    criteria: 'name' | 'price' | 'quantity' | 'category',
    ascending: boolean = true
  ): Sweet[] {
    const sweets = this.getAllSweets();
    
    return sweets.sort((a, b) => {
      let comparison = 0;
      
      switch (criteria) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'quantity':
          comparison = a.quantity - b.quantity;
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        default:
          comparison = 0;
      }
      
      return ascending ? comparison : -comparison;
    });
  }

  /**
   * Gets the count of sweets in the shop
   * @returns Number of different sweet types in the shop
   */
  public getSweetCount(): number {
    return this.sweets.size;
  }

  /**
   * Clears all sweets from the shop
   */
  public clearAllSweets(): void {
    this.sweets.clear();
  }
}
