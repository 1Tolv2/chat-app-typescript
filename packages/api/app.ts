import express, { Express, json } from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import routes from "./routes/index";
import { runSocketServer, SocketServer } from "./controllers/socket";
import { CORS_ORIGINS } from "./config/config";
import dotenv from "dotenv";
import { createPool } from "slonik";
dotenv.config();

const app: Express = express();
const server = http.createServer(app);
const io = new Server<SocketServer>(server, {
  cors: { origin: CORS_ORIGINS, credentials: true },
});

const DATABASE_URL =
  process.env.NODE_ENV === "development"
    ? process.env.POSTGRES_DEV_URL
    : process.env.NODE_ENV === "test"
    ? process.env.POSTGRES_TEST_URL
    : process.env.POSTGRES_DEV_URL;
export const pool = createPool(DATABASE_URL || "");

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = "development";
}

app.use(cors({ origin: CORS_ORIGINS, credentials: true }));
app.use(json());

io.use(runSocketServer);
app.use("/", routes);

export { server, app, io };
