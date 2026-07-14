# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Koa2-based e-commerce backend system with multi-store support, RBAC authorization, WeChat mini-program integration, and real-time features. Uses Sequelize ORM with MySQL, Redis for caching/pub-sub, and Casbin for permission enforcement.

## Development Commands

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
# or with explicit NODE_ENV
npm run prod

# Database initialization (run in order)
node src/db/seedRbacEntity.js        # Initialize RBAC roles and permissions
node src/db/seedBusinessData.js      # Seed business data
node src/db/seedSpecs.js             # Seed product specifications
node src/db/seedStaff.js             # Seed staff users

# Database backup
npm run backup                        # One-time backup
npm run backup:watch                  # Scheduled backup with cron

# Model synchronization (destructive - drops and recreates tables)
# Use syncModels.js functions directly in code, not as CLI command
```

**No test framework is configured**: `npm test` exits with an error. There are no test files or runner (jest/vitest/etc.) in the project. The `npm run build` (webpack) script is also non-functional — `webpack` is not installed and there is no webpack config. The app runs directly from source via `node ./src/main.js`.

## Architecture

### Layered Structure

**Controller → Service → Model** pattern with middleware for cross-cutting concerns:

- **Controllers** (`src/controller/`): Handle HTTP requests, validate input, call services
- **Services** (`src/service/`): Business logic, database operations, transaction management
- **Models** (`src/model/`): Sequelize models with associations
- **Middleware** (`src/middleware/`): Auth, validation, rate limiting, file upload
- **Routers** (`src/router/`): Route definitions with middleware chains

**Router auto-loading**: `src/router/index.js` reads every file in `src/router/` (except `index.js`) at startup and mounts whatever each exports via `router.use(r.routes())`. To add a new route group, just drop a file in `src/router/` that exports a koa-router instance — no central registration needed. A file that doesn't export `.routes()` is skipped with a console error.

**Database connection**: A single shared Sequelize instance is created in `src/db/seq.js` and imported everywhere. It auto-authenticates on require. All models and `syncModels.js` use this same instance.

### Key Model Relationships

**Multi-store architecture**: Users can own stores (`User.hasMany(Store)`) and belong to stores as staff (`User.belongsToMany(Store, {through: UserStore, as: 'departments'})`). Goods are scoped to stores.

**RBAC**: Three-way many-to-many: `User ↔ UserRole ↔ Role ↔ RolePermission ↔ Permission`. Permissions have three types:
- Type 1: Menu/page access
- Type 2: Button/action visibility
- Type 3: API endpoint authorization (with path + method)

**Product specifications**: `Goods ↔ ProductSpecRel ↔ SpecGroup → SpecOption`. Spec groups (e.g., "Size") contain options (e.g., "Small", "Medium"). Products can have multiple spec groups.

**Categories**: `Goods ↔ GoodsCategory ↔ Category` (many-to-many). Products can belong to multiple categories.

**Orders**: `Order → OrderItem → Goods`. Orders link to `Address` and `User`. Order items snapshot product details at purchase time.

### Model Sync Order

When syncing models (see `src/model/syncModels.js`), order matters due to foreign key constraints:

1. Base models: User, Store, Goods, Role, Permission, Category, Notice, SpecGroup, Topping
2. Junction tables: UserRole, RolePermission, GoodsCategory, SpecOption, ProductSpecRel, UserStore
3. Business models: Address, Cart, Order, OrderItem

Always disable foreign key checks before dropping: `SET FOREIGN_KEY_CHECKS = 0`.

### Configuration

Environment-based config loading in `src/config/config.default.js`:
- Development: `.env`
- Production: `.env.production` (when `NODE_ENV=production`)

All config values exported from `process.env`. Key settings:
- `UPLOAD_TYPE`: `local` | `minio` | `online` (affects file storage strategy)
- Database: `MYSQL_*` variables
- Redis: `REDIS_*` variables
- JWT: `JWT_SECRET`
- WeChat: `WX_APPID`, `WX_APPSECRET`

### Redis Usage

**Caching**: User sessions, product lists, category trees (see `src/utils/redis.js`)

**Pub/Sub**: Redis keyspace notifications for expired keys. The `redisSubscriber` service (`src/service/redisSubscriber.js`) listens for key expiration events, initialized in `src/main.js` on startup. On init it sets `notify-keyspace-events` to `Ex` and subscribes to `__keyevent@0__:expired`. The concrete use: when an `order_timeout:<orderId>` key expires, the unpaid order (`state === 0`) is auto-canceled by setting `state = 4`. Order states: `0` = unpaid/pending, `4` = canceled.

### RBAC with Casbin

Permission enforcement uses Casbin with Sequelize adapter. The enforcer checks `(userId, path, method)` tuples against policies.

**Permission hierarchy**: Permissions have `parent_id` for tree structure. When seeding RBAC data (`src/db/seedRbacEntity.js`), parent-child relationships are established after creation to handle forward references.

**Syncing**: After modifying roles/permissions in the database, call `RbacService.syncAllToCasbin()` to update Casbin policies.

**Wildcard permission**: The `api:all` permission with `path: "*"` and `method: "*"` grants access to all endpoints (typically for super admin).

### Authentication Flow

1. **WeChat Login**: Client sends `code` → backend calls WeChat `code2Session` → returns `openid` → find or create user → issue JWT
2. **JWT Auth**: Middleware (`authMiddleware.js`) verifies token, attaches `ctx.state.user`
3. **Permission Check**: Middleware uses Casbin enforcer to check if user's roles grant access to the endpoint

### File Upload

Upload middleware (`src/middleware/uploadMiddleware.js`) handles different storage backends based on `UPLOAD_TYPE`:
- `local`: Saves to `src/public/local/`
- `minio`: Uploads to MinIO object storage
- `online`: Saves to `src/public/online/`

Files are processed via `koa-body` with `formidable`. Max file size: 5MB.

### Error Handling

Centralized error handler in `src/app/errHandler.js`. Controllers throw errors with codes defined in `src/constant/errType.js`. The error handler catches them and returns consistent JSON responses.

Validation uses `koa-parameter` for request body/query validation. Validation rules defined in `src/constant/rules.js`.

## Common Patterns

### Adding a New Feature

1. Define model in `src/model/` with associations
2. Add to `src/model/index.js` exports and define relationships
3. Update `src/model/syncModels.js` if adding new tables
4. Create service in `src/service/` for business logic
5. Create controller in `src/controller/` for request handling
6. Add middleware in `src/middleware/` if needed (validation, auth)
7. Define routes in `src/router/` with middleware chain
8. Add error types to `src/constant/errType.js`
9. If adding protected endpoints, seed permissions in `src/db/seedRbacEntity.js`

### Working with Transactions

Services should use Sequelize transactions for multi-step operations:

```javascript
const t = await sequelize.transaction();
try {
  // operations
  await t.commit();
} catch (error) {
  await t.rollback();
  throw error;
}
```

### Store-Scoped Operations

Many operations are scoped to stores. When querying goods, orders, or staff:
- Filter by `store_id` in queries
- Middleware (`storeMiddleware.js`) can enforce store access
- Users can belong to multiple stores via `UserStore` junction table

### Adding RBAC Permissions

1. Add permission to `permsData` array in `src/db/seedRbacEntity.js`
2. Set correct `type`: 1 (menu), 2 (button), 3 (API)
3. For API permissions, include `path` and `method`
4. Add to `relations` array to set `parent_id`
5. Run `node src/db/seedRbacEntity.js` to sync
6. Assign to roles via `role.setPermissions()` or admin UI

## Important Notes

- **Model sync is destructive**: `syncModels()` uses `{force: true}`, which drops and recreates tables. Use only in development or with backups.
- **Redis subscriber**: Must be initialized after app starts listening. See `src/main.js` for the pattern.
- **WeChat credentials**: Required for mini-program login. Set `WX_APPID` and `WX_APPSECRET` in `.env`.
- **Node version**: Project uses Volta to pin Node 24.16.0 and npm 8.19.4 (see `package.json`).
- **Chinese comments**: Codebase uses Chinese for comments and console logs. Maintain this convention when adding code.
- **Casbin enforcer**: Lazily initialized singleton in `src/utils/casbin.js` via `getEnforcer()`. Uses the model config at `src/config/rbac_model.conf` and the Sequelize adapter (stores policies in DB).
- **Socket.io is scaffolded but not wired up**: `src/utils/socket/index.js` defines `initSocket`/`getSocketInstance`, but `initSocket` is never called (the app uses `app.listen`, not a raw http server). Wiring real-time features requires creating an http server from the Koa app and calling `initSocket(server)`. Treat "real-time" as aspirational until then.
