import { Product } from "../schemas/product.schema.js";
import { sendToPrimary } from "../utils/ipc.js";
import { localDB } from "../db/memory.db.js";

const isCluster = !!process.send;

export const productService = {
  getAll: async () => {
    if (isCluster) return sendToPrimary<Product[]>({ type: "GET_ALL" });
    return localDB.getAll();
  },

  getOne: async (id: string) => {
    if (isCluster) return sendToPrimary<Product | null>({ type: "GET_ONE", payload: id });
    return localDB.getOne(id);
  },

  create: async (data: Omit<Product, "id">) => {
    if (isCluster) return sendToPrimary<Product>({ type: "CREATE", payload: data });
    return localDB.create(data);
  },

  update: async (id: string, data: Partial<Product>) => {
    if (isCluster)
      return sendToPrimary<Product | null>({
        type: "UPDATE",
        payload: { id, data },
      });

    return localDB.update(id, data);
  },

  delete: async (id: string) => {
    if (isCluster) return sendToPrimary<boolean>({ type: "DELETE", payload: id });
    return localDB.delete(id);
  },
};
