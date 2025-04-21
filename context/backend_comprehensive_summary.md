# Comprehensive Backend Summary

## Overview
The backend is a .NET Core Web API that provides all business logic, data management, authentication, and integration for the stock portfolio platform. It exposes RESTful endpoints for user, portfolio, stock, and comment management, and integrates with external financial APIs for stock data enrichment.

---

## 1. Architecture & Structure
- **Framework:** ASP.NET Core Web API
- **Main Directories:**
  - `Controllers/`: API endpoint definitions
  - `Models/`: Entity/data models (User, Stock, Portfolio, Comment)
  - `Repository/`: Data access and persistence logic
  - `Service/`: Business services (e.g., external API integration, token generation)
  - `Dtos/`: Data transfer objects for API communication
  - `Helpers/`: Query/filter objects, utilities
  - `Interfaces/`: Abstractions for repositories and services
  - `Migrations/`: Entity Framework migrations for DB schema

---

## 2. Key Business Logic & Workflows

### A. User Management
- **Registration & Login:**
  - Handled by `AccountController` using ASP.NET Identity.
  - On registration, users are created and assigned roles.
  - On login, JWT tokens are generated for authentication.
- **Security:**
  - JWT Bearer authentication is enforced on protected endpoints.
  - User roles and claims are managed.

### B. Portfolio Management
- **Endpoints:** `PortfolioController`
- **Features:**
  - Add stock to user's portfolio: Validates existence, fetches from external API if needed, prevents duplicates.
  - Remove stock from portfolio: Checks ownership and existence.
  - Retrieve user's portfolio: Returns all stocks associated with the user.
- **Persistence:**
  - `PortfolioRepository` handles DB operations, mapping users to stocks.

### C. Stock Management
- **Endpoints:** `StockController`
- **Features:**
  - CRUD operations for stocks.
  - Flexible querying/filtering (by symbol, company name, sort, pagination).
  - Fetches missing stock data from external APIs if not found locally.
- **Persistence:**
  - `StockRepository` manages stock records in the DB.

### D. Comments
- **Endpoints:** `CommentController`
- **Features:**
  - Users can add, delete, and view comments on stocks.
  - Comments are linked to both the stock and the user.
- **Persistence:**
  - `CommentRepository` manages comment records.

### E. External API Integration
- **Service:** `FMPService`
- **Purpose:** Fetches stock data from Financial Modeling Prep (FMP) API when not present in the local database.
- **Usage:** Called during portfolio and stock operations to enrich data.

---

## 3. Data Models
- **AppUser:** Represents users (Identity-based).
- **Stock:** Symbol, company name, price, industry, market cap, etc.
- **Portfolio:** Maps users to stocks (many-to-many).
- **Comment:** User-generated content on stocks.

---

## 4. Security & Configuration
- **Authentication:** JWT Bearer tokens; endpoints protected with `[Authorize]`.
- **Configuration:**
  - `appsettings.json` for DB connection, JWT keys, and external API keys.
  - CORS enabled for frontend integration.
- **Swagger:** Enabled for API documentation/testing in development.

---

## 5. Error Handling & Validation
- **Model validation** on all endpoints.
- **Error responses** for invalid data, unauthorized access, and server errors.
- **Consistent HTTP status codes** for all operations.

---

## 6. Extensibility
- **Repository and service patterns** allow for easy extension and testing.
- **DTOs** decouple API contracts from internal models.
- **Interfaces** ensure swappable implementations.

---

## 7. Summary Table of Main Components

| Component           | Purpose                                              |
|---------------------|------------------------------------------------------|
| AccountController   | User registration, login, token issuance             |
| PortfolioController | Manage user portfolios (add, remove, list)           |
| StockController     | CRUD and query stocks                                |
| CommentController   | Manage comments on stocks                            |
| FMPService          | External stock data integration                      |
| TokenService        | JWT token generation and validation                  |
| AppUser             | User entity (Identity)                               |
| Stock               | Stock entity (symbol, company, price, etc.)          |
| Portfolio           | User-stock relationship                              |
| Comment             | Stock comments by users                              |

---

## 8. Example API Endpoints
- `POST /api/account/register` – Register user
- `POST /api/account/login` – Login user
- `GET /api/portfolio` – Get user's portfolio
- `POST /api/portfolio` – Add stock to portfolio
- `DELETE /api/portfolio/{symbol}` – Remove stock from portfolio
- `GET /api/stock` – List/search stocks
- `POST /api/comment` – Add comment to stock

---

## 9. Notable Business Rules
- Prevent duplicate stocks in a user's portfolio
- Only allow valid stocks (verified via FMP or local DB)
- Comments must be linked to both user and stock
- Only authenticated users can modify portfolios or comment

---

## 10. Integration Points
- **Frontend:** Communicates via RESTful endpoints with JWT authentication
- **External:** Financial Modeling Prep API for stock data enrichment

---

## 11. Development Practices
- **Dependency injection** for services and repositories
- **Entity Framework Core** for ORM and migrations
- **Separation of concerns** via controllers, services, repositories, and DTOs

---

This summary provides a comprehensive overview of the backend's architecture, business logic, and workflows. For further details on specific components or code, refer to the respective files or request a focused breakdown.
