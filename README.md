# Sweet Shop Management System

A Test-Driven Development (TDD) implementation of a sweet shop management system using TypeScript.

## Features

- Add new sweets to the shop inventory
- Delete sweets from the shop
- View all available sweets
- Search sweets by name, category, or price range
- Purchase sweets (decreases stock quantity)
- Restock sweets (increases stock quantity)
- Inventory management with stock validation

## Sweet Properties

Each sweet has the following properties:
- **ID**: Unique identifier
- **Name**: Sweet name
- **Category**: Type of sweet (e.g., Nut-Based, Milk-Based, Vegetable-Based)
- **Price**: Price per unit
- **Quantity**: Available stock quantity

## Setup and Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Run tests: `npm test`
4. Build the project: `npm run build`
5. Start the application: `npm start`

## Development

This project follows Test-Driven Development (TDD) principles:
1. Write failing tests first
2. Write minimal code to make tests pass
3. Refactor while keeping tests green

## Sample Data

| ID   | Name        | Category        | Price | Quantity |
|------|-------------|-----------------|-------|----------|
| 1001 | Kaju Katli  | Nut-Based       | 50    | 20       |
| 1002 | Gajar Halwa | Vegetable-Based | 30    | 15       |
| 1003 | Gulab Jamun | Milk-Based      | 10    | 50       |

## Git Commit Convention

- feat: New feature implementation
- test: Adding or modifying tests
- refactor: Code refactoring
- docs: Documentation updates
- fix: Bug fixes
- AI: AI-assisted commits
