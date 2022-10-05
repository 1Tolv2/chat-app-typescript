import { sql, UniqueIntegrityConstraintViolationError } from "slonik";
import { pool } from "../config/env/test";
import { TimeStamps } from "../global/types";
import { createChannel } from "./Channel";

export interface ServerAttributes {
  id?: number;
  name: string;
  description: string;
  channels?: number[]; // channel_ids
  users?: number[]; // user_ids
}

class Server implements ServerAttributes, TimeStamps {
  name: string;
  description: string;
  created_at: Date;
  updated_at: Date | null;

  constructor(_name: string, _description: string) {
    this.name = _name;
    this.description = _description;
    this.created_at = new Date();
    this.updated_at = null;
  }

  static setupTable = async () => {
    await (
      await pool
    ).query(sql`
        CREATE TABLE IF NOT EXISTS servers (
          id SERIAL PRIMARY KEY,
          name VARCHAR(60) NOT NULL UNIQUE,
          description VARCHAR,
          created_at TIMESTAMP DEFAULT current_timestamp,
          updated_at TIMESTAMP
          );
      `);
  };

  static addToDatabase = async ({
    name,
    description,
  }: ServerAttributes): Promise<ServerAttributes> => {
    await this.setupTable();
    try {
      const newServer = (await (
        await pool
      ).one(sql`
          INSERT INTO servers (name, description)
          VALUES (${name}, ${description})
          RETURNING *;
          `)) as unknown as ServerAttributes;

      if (newServer) {
        createChannel({
          name: "general",
          description: "General chat",
          server_id: newServer.id || 1,
        });
      }
    } catch (err) {
      if (err instanceof UniqueIntegrityConstraintViolationError) {
        throw new Error("A server with that name already exists");
      }
    }
    return new Server(name, description);
  };
}

export const createServer = async (
  server: ServerAttributes
): Promise<ServerAttributes | void> => {
  try {
    const newServer = Server.addToDatabase(server);
    return newServer;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
  }
};

export const findAllServers = async (): Promise<ServerAttributes[]> => {
  return (await (
    await pool
  ).any(sql`SELECT * FROM servers;`)) as unknown as ServerAttributes[];
};

export const findServerById = async (id: number): Promise<ServerAttributes> => {
  return (await (
    await pool
  ).any(sql`SELECT * FROM servers
  WEHERE id = ${id};`)) as unknown as ServerAttributes;
};

export const updateServer = async () => {};
export const deleteServer = async () => {};

export default Server;