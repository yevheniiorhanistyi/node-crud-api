import cluster from "node:cluster";
import dotenv from "dotenv";

import { startPrimary } from "./cluster/primary.js";
import { startWorker } from "./cluster/worker.js";

dotenv.config();

const isMultiMode = process.env.MULTI_MODE === "true";

if (isMultiMode && cluster.isPrimary) {
  startPrimary();
} else {
  startWorker();
}
