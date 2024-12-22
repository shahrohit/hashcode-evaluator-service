import express from "express";

import { PORT } from "@config/server-config";
import connectQueue from "@config/queue-config";
import checkDockerConnection from "./containers/docker-ping-check";
import checkHealth from "@/controller/health-controller";

const app = express();

app.get("/health", checkHealth);

app.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  await checkDockerConnection();
  await connectQueue();
});
