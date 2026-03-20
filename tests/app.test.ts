import { describe, it, before, after } from "node:test";
import assert from "node:assert";
import { FastifyInstance } from "fastify";
import { startWorker } from "../src/cluster/worker.js";

describe("Product API CRUD operations", () => {
  let app: FastifyInstance;
  let createdProductId: string;

  const newProductData = {
    name: "Test Laptop",
    description: "A powerful laptop for testing",
    price: 1500.5,
    category: "electronics",
    inStock: true,
  };

  const updatedProductData = {
    name: "Updated Laptop",
    description: "Updated description",
    price: 1200,
    category: "electronics",
    inStock: false,
  };

  before(async () => {
    process.env.PORT = "0";
    process.env.MULTI_MODE = "false";
    app = await startWorker();
  });

  after(async () => {
    await app.close();
  });

  it("1. GET /api/products - Should return an empty array initially", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/products",
    });

    assert.strictEqual(response.statusCode, 200);
    const payload = JSON.parse(response.payload);
    assert.deepStrictEqual(payload, []);
  });

  it("2. POST /api/products - Should create a new product", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/api/products",
      payload: newProductData,
    });

    assert.strictEqual(response.statusCode, 201);
    const payload = JSON.parse(response.payload);

    assert.ok(payload.id);
    createdProductId = payload.id;

    assert.strictEqual(payload.name, newProductData.name);
    assert.strictEqual(payload.price, newProductData.price);
  });

  it("3. GET /api/products/{productId} - Should get the created record by its id", async () => {
    const response = await app.inject({
      method: "GET",
      url: `/api/products/${createdProductId}`,
    });

    assert.strictEqual(response.statusCode, 200);
    const payload = JSON.parse(response.payload);
    assert.strictEqual(payload.id, createdProductId);
    assert.strictEqual(payload.name, newProductData.name);
  });

  it("4. PUT /api/products/{productId} - Should update the created record", async () => {
    const response = await app.inject({
      method: "PUT",
      url: `/api/products/${createdProductId}`,
      payload: updatedProductData,
    });

    assert.strictEqual(response.statusCode, 200);
    const payload = JSON.parse(response.payload);

    assert.strictEqual(payload.id, createdProductId);
    assert.strictEqual(payload.name, updatedProductData.name);
    assert.strictEqual(payload.price, updatedProductData.price);
  });

  it("5. DELETE /api/products/{productId} - Should delete the created object by id", async () => {
    const response = await app.inject({
      method: "DELETE",
      url: `/api/products/${createdProductId}`,
    });

    assert.strictEqual(response.statusCode, 204);
    assert.strictEqual(response.payload, "");
  });

  it("6. GET /api/products/{productId} - Should return 404 for the deleted object", async () => {
    const response = await app.inject({
      method: "GET",
      url: `/api/products/${createdProductId}`,
    });

    assert.strictEqual(response.statusCode, 404);
  });
});
