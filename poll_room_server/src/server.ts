import "dotenv/config";
import http from "http";
import { app } from "./app.js";
import envConfig from "./configs/env.config.js";
import { initSocket } from "./socket/index.js";

const PORT = envConfig.PORT;

const server = http.createServer(app);

initSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
