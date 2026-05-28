# Store Server Node - Project Instructions

## Project Overview
This project is a backend management system for a store, built with **Node.js** and the **Koa2** framework. It provides core functionalities for product management, categories, orders, user authentication, and RBAC-based permission control.

### Key Technologies
- **Framework:** Koa2
- **Database:** MySQL with **Sequelize** ORM
- **Caching & Tasks:** Redis (using `ioredis` and `bull`)
- **Authentication:** JWT (JSON Web Token)
- **Authorization:** **Casbin** for Role-Based Access Control (RBAC)
- **File Storage:** Local storage or Minio
- **Utilities:** `koa-body` (file uploads), `koa-parameter` (validation), `bcrypt` (password hashing)

### Architecture
The project follows a **Controller-Service-Model** architecture:
- **`src/router/`**: Defines API endpoints. Routes are automatically loaded from this directory.
- **`src/controller/`**: Handles incoming HTTP requests, validates parameters, and calls services.
- **`src/service/`**: Contains core business logic and interacts with the database.
- **`src/model/`**: Defines Sequelize data models and associations.
- **`src/middleware/`**: Custom middleware for authentication, permission checks, error handling, etc.
- **`src/app/`**: Application configuration and global error handling.

---

## Building and Running

### Prerequisites
- Node.js (version specified in `package.json` Volta config: 24.16.0)
- MySQL
- Redis

### Setup
1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Environment Variables:**
    Create a `.env` file in the root directory based on the configuration in `src/config/config.default.js` and the examples in `ReadMe.md`.
    Key variables include `APP_PORT`, `MYSQL_*`, `REDIS_*`, `JWT_SECRET`, and `UPLOAD_TYPE`.

### Running the Project
- **Development Mode:**
  ```bash
  npm run dev
  ```
- **Production Mode:**
  ```bash
  npm start
  ```

### Database Initialization
1.  **Sync Models:** Use the utility in `src/model/syncModels.js` if you need to manually drop and recreate tables (be careful as it uses `force: true`).
2.  **Seed Admin:**
    ```bash
    node src/db/initAdmin.js
    ```
3.  **Seed RBAC Entities:**
    ```bash
    node src/db/seedRbacEntity.js
    ```

---

## Development Conventions

### Coding Style
- **CommonJS:** The project uses CommonJS modules (`require`/`module.exports`).
- **Async/Await:** Prefer `async`/`await` for handling asynchronous operations.

### Error Handling
- Use the predefined error types in `src/constant/errType.js`.
- Emit errors using `app.emit('error', errorType, ctx)` to be caught by the global error handler in `src/app/errHandler.js`.

### Response Format
- Use the `sendResponse` utility in `src/utils/response.js` for consistent API responses where applicable.
- The standard response structure is:
  ```json
  {
    "code": "status_code",
    "message": "description",
    "result": { ... }
  }
  ```

### Routing
- Add new route files to `src/router/`. They will be automatically registered by `src/router/index.js`.
- Ensure each route file exports an instance of `koa-router` with `.routes()`.

### Models & Associations
- Define models in `src/model/` (grouped by domain, e.g., `product/`, `user/`).
- Define all associations in `src/model/index.js` to ensure they are loaded correctly.

### Permission Control
- Use `authMiddleware.js` for JWT authentication.
- Use Casbin-based middleware for fine-grained permission checks where required.
