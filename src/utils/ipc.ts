import { randomUUID } from "node:crypto";
import { IpcMessage, IpcResponse } from "../types/ipc.types.js";

export const sendToPrimary = <T>(message: IpcMessage): Promise<T> => {
  return new Promise((resolve) => {
    const requestId = randomUUID();

    process.send?.({ ...message, requestId });

    const handler = (response: IpcResponse<T>): void => {
      if (response.requestId === requestId) {
        process.off("message", handler);
        resolve(response.result);
      }
    };

    process.on("message", handler);
  });
};
