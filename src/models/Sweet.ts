/**
 * Sweet model representing a sweet item in the shop inventory
 */
export class Sweet {
  private _id: number;
  private _name: string;
  private _category: string;
  private _price: number;
  private _quantity: number;

  constructor(
    id: number,
    name: string,
    category: string,
    price: number,
    quantity: number
  ) {
    this.validateInputs(name, category, price, quantity);
    
    this._id = id;
    this._name = name;
    this._category = category;
    this._price = price;
    this._quantity = quantity;
  }

  /**
   * Validates input parameters for sweet creation
   */
  private validateInputs(
    name: string,
    category: string,
    price: number,
    quantity: number
  ): void {
    if (!name || name.trim() === '') {
      throw new Error('Name cannot be empty');
    }

    if (!category || category.trim() === '') {
      throw new Error('Category cannot be empty');
    }

    if (price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    if (quantity < 0) {
      throw new Error('Quantity must be greater than or equal to 0');
    }
  }

  /**
   * Getter for sweet ID
   */
  get id(): number {
    return this._id;
  }

  /**
   * Getter for sweet name
   */
  get name(): string {
    return this._name;
  }

  /**
   * Getter for sweet category
   */
  get category(): string {
    return this._category;
  }

  /**
   * Getter for sweet price
   */
  get price(): number {
    return this._price;
  }

  /**
   * Getter for sweet quantity
   */
  get quantity(): number {
    return this._quantity;
  }

  /**
   * Restocks the sweet by adding the specified amount to current quantity
   * @param amount - Amount to add to current stock
   */
  public restock(amount: number): void {
    if (amount <= 0) {
      throw new Error('Restock amount must be greater than 0');
    }

    this._quantity += amount;
  }

  /**
   * Purchases the specified amount of sweets, reducing the current quantity
   * @param amount - Amount to purchase
   */
  public purchase(amount: number): void {
    if (amount <= 0) {
      throw new Error('Purchase amount must be greater than 0');
    }

    if (amount > this._quantity) {
      throw new Error(
        `Insufficient stock. Available: ${this._quantity}, Requested: ${amount}`
      );
    }

    this._quantity -= amount;
  }

  /**
   * Checks if the sweet is currently in stock
   * @returns true if quantity > 0, false otherwise
   */
  public isInStock(): boolean {
    return this._quantity > 0;
  }

  /**
   * Returns a string representation of the sweet
   */
  public toString(): string {
    return `Sweet(id=${this._id}, name=${this._name}, category=${this._category}, price=${this._price}, quantity=${this._quantity})`;
  }

  /**
   * Returns a plain object representation of the sweet
   */
  public toJSON(): object {
    return {
      id: this._id,
      name: this._name,
      category: this._category,
      price: this._price,
      quantity: this._quantity,
    };
  }
}
