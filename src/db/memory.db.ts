import { Product } from "../schemas/product.schema.js";

export const products: Product[] = [];

export const localDB = {
  getAll: () => products,

  getOne: (id: string) => products.find((p) => p.id === id),

  create: (data: Omit<Product, "id">) => {
    const newProduct = { id: crypto.randomUUID(), ...data };
    products.push(newProduct);
    return newProduct;
  },

  update: (id: string, data: Partial<Product>) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;

    products[index] = { ...products[index], ...data, id };
    return products[index];
  },

  delete: (id: string) => {
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return false;

    products.splice(index, 1);
    return true;
  },
};
