# Node CRUD API

A RESTful CRUD API built with [Fastify](https://fastify.dev/) and TypeScript, using an in-memory database.

## Requirements

- Node.js `>= 24.10.0`

---

## Getting Started

### 1. Clone the repository

```bash
git clone git@github.com:yevheniiorhanistyi/node-crud-api.git
cd node-crud-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

Copy the example env file and adjust if needed:

```bash
cp .env.example .env
```

`.env.example`:

```
PORT=4000
```

## Scripts

| Script                | Description                                                              |
| --------------------- | ------------------------------------------------------------------------ |
| `npm run start:dev`   | Run in **development** mode with hot-reload (`tsx watch`)                |
| `npm run start:prod`  | Build TypeScript and run the **production** bundle                       |
| `npm run start:multi` | Run in **multi-instance** mode (Cluster API + Round-robin load balancer) |
| `npm run build`       | Compile TypeScript to `dist/`                                            |
| `npm test`            | Run all tests                                                            |
| `npm run lint`        | Lint source files                                                        |
| `npm run lint:fix`    | Lint and auto-fix                                                        |
| `npm run format`      | Format source files with Prettier                                        |

## API Reference

Base URL: `http://localhost:{PORT}/api/products`

### Product schema

```ts
{
  id: string; // uuid, generated server-side
  name: string; // required
  description: string; // required
  price: number; // required, must be > 0
  category: string; // required (e.g. "electronics", "books", "clothing")
  inStock: boolean; // required
}
```

### Endpoints

#### `GET /api/products`

Returns all products.

- `200` — array of products

#### `GET /api/products/:productId`

Returns a single product by ID.

- `200` — product object
- `400` — invalid UUID
- `404` — product not found

#### `POST /api/products`

Creates a new product.

Request body (JSON):

```json
{
  "name": "Laptop",
  "description": "A powerful laptop",
  "price": 999.99,
  "category": "electronics",
  "inStock": true
}
```

- `201` — created product
- `400` — missing required fields or invalid `price`

#### `PUT /api/products/:productId`

Updates an existing product.

Request body: same fields as POST (all optional).

- `200` — updated product
- `400` — invalid UUID
- `404` — product not found

#### `DELETE /api/products/:productId`

Deletes a product.

- `204` — deleted successfully
- `400` — invalid UUID
- `404` — product not found

### Error responses

All errors follow this shape:

```json
{
  "message": "Human-readable error description"
}
```

Requests to non-existing routes return `404`.  
Unexpected server errors return `500`.

## Multi-instance mode

`npm run start:multi` starts the app using Node.js **Cluster API** with a **Round-robin load balancer**.

Example with `PORT=4000` and 4 CPU cores:

| Address          | Role          |
| ---------------- | ------------- |
| `localhost:4000` | Load balancer |
| `localhost:4001` | Worker 1      |
| `localhost:4002` | Worker 2      |
| `localhost:4003` | Worker 3      |

The in-memory state is **shared across all workers** — products created on one worker are visible to others.

## Testing

```bash
npm test
```

Tests cover the full CRUD lifecycle:

1. `GET /api/products` — returns empty array initially
2. `POST /api/products` — creates a new product
3. `GET /api/products/:id` — returns the created product
4. `PUT /api/products/:id` — updates the product
5. `DELETE /api/products/:id` — deletes the product
6. `GET /api/products/:id` — returns `404` after deletion

## Tech Stack

- **Runtime**: Node.js 24.x
- **Framework**: Fastify
- **Language**: TypeScript
- **Validation**: Zod
- **Dev tooling**: ESLint, Prettier
