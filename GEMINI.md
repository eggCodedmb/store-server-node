# Store Server Node - Project Instructions

## Project Overview
This project is a backend management system for a mall/store, built with **Node.js** and the **Koa2** framework. It provides core functionalities for product management, categories, orders, user authentication, and RBAC-based permission control.

### Key Technologies
- **Framework:** Koa2
- **Database:** MySQL with **Sequelize** ORM
- **Caching & Tasks:** Redis (using `ioredis` and `bull`)
- **Authentication:** JWT (JSON Web Token)
- **Authorization:** **Casbin** for Role-Based Access Control (RBAC)
- **File Storage:** Configurable via `UPLOAD_TYPE` (Local storage or Minio)
- **Utilities:** `koa-body` (file uploads), `koa-parameter` (validation), `bcrypt` (password hashing)

### Architecture
The project follows a **Controller-Service-Model** architecture:
- **`src/main.js`**: Application entry point. Initializes Redis subscribers and starts the server.
- **`src/app/index.js`**: Application configuration, middleware setup (CORS, static files, body parsing, validation), and global error handling.
- **`src/router/`**: Defines API endpoints. Routes are automatically loaded and registered by `src/router/index.js`.
- **`src/controller/`**: Handles incoming HTTP requests, validates parameters, and orchestrates services.
- **`src/service/`**: Contains core business logic and interacts with the database via Sequelize models.
- **`src/model/`**: Defines Sequelize data models.
- **`src/model/index.js`**: Centralized location for defining all model associations (Relationships).
- **`src/middleware/`**: Custom middleware for authentication (`auth`), Casbin permission checks (`authorize`), error handling, etc.
- **`src/utils/`**: Shared utilities for Redis, Casbin, Captcha, Password hashing, and Socket.io.

---

## Building and Running

### Prerequisites
- Node.js (Volta pinned: 24.16.0)
- MySQL
- Redis

### Setup
1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Environment Variables:**
    Create a `.env` file (for development) or `.env.production` (for production) in the root directory.
    Key variables include `APP_PORT`, `MYSQL_*`, `REDIS_*`, `JWT_SECRET`, and `UPLOAD_TYPE`.

### Running the Project
- **Development Mode:**
  ```bash
  npm run dev
  ```
- **Production Mode:**
  ```bash
  npm start
  # OR
  npm run prod
  ```

### Database Initialization
1.  **Sync Models:** Models are typically synced automatically, but can be managed via `src/model/syncModels.js`.
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
- **Async/Await:** Prefer `async`/`await` for all asynchronous operations.

### Error Handling
- Use the predefined error types in `src/constant/errType.js`.
- Emit errors using `ctx.app.emit('error', errorType, ctx)` to be caught by the global error handler in `src/app/errHandler.js`.

### Response Format
- Use the `sendResponse` utility in `src/utils/response.js` for consistent API responses.
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
- Ensure each route file exports an instance of `koa-router`.

### Models & Associations
- Define models in `src/model/` (grouped by domain, e.g., `product/`, `user/`).
- **Crucial:** Always define new associations in `src/model/index.js` to ensure they are available throughout the app.

### Permission Control
- Use `auth` middleware for JWT authentication.
- Use `authorize(resource, action)` middleware for Casbin-based permission checks on specific routes.

### Redis Subscriber
- The application uses a Redis key-space notification subscriber (`src/service/redisSubscriber.js`) to handle time-sensitive business logic like order timeouts. Ensure Redis `notify-keyspace-events` is enabled if using this feature.
