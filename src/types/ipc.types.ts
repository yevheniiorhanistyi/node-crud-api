import { Product } from "../schemas/product.schema.js";

export type IpcMessage =
  | { type: "GET_ALL"; payload?: never }
  | { type: "GET_ONE"; payload: string }
  | { type: "CREATE"; payload: Omit<Product, "id"> }
  | { type: "UPDATE"; payload: { id: string; data: Partial<Product> } }
  | { type: "DELETE"; payload: string };

export type IpcResponse<T = unknown> = {
  requestId: string;
  result: T;
};

export type InternalIpcMessage = IpcMessage & { requestId: string };
