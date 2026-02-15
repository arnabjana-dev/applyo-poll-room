import "dotenv/config";
import http from "http";
import { app } from "./app.js";
import envConfig from "./configs/env.config.js";
import { initSocket } from "./socket/index.js";

const PORT = Number(envConfig.PORT) || 5001;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
