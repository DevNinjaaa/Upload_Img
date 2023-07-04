import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs/promises";
import EventEmitter from "events";
import { buildSchema } from "graphql";
import resolvers from "./graphql/resolver.js";
import pkg from "body-parser";
const { json } = pkg;

// import the Schema.grqphql ==> typedefs
const schema = await fs.readFile("graphql/schema.graphql", "utf8");
const typeDefs = buildSchema(schema);

const app = express();

// Set the Size of the query
const emitter = new EventEmitter();
emitter.setMaxListeners(50);
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));

app.use(cors());

// npm install @apollo/server express graphql cors body-parser

const httpServer = http.createServer(app);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use(
  "/graphql",
  cors(),
  json(),
  expressMiddleware(server, {
    context: async ({ req }) => ({ token: req.headers.token }),
  })
);

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
console.log(`🚀 Server ready at http://localhost:4000/graphql`);
