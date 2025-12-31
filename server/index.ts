import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { typeDefs } from './schema';
import { resolvers } from './resolvers';

const SECRET_KEY = "ultra-secret-key";

interface MyContext {
    user?: any;
}

async function startServer() {
    const app = express();
    const httpServer = http.createServer(app);

    const server = new ApolloServer<MyContext>({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    });

    await server.start();

    app.use(
        '/graphql',
        cors<cors.CorsRequest>({
            origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"],
            credentials: true
        }),
        bodyParser.json(),
        expressMiddleware(server, {
            context: async ({ req }) => {
                const token = req.headers.authorization || '';
                try {
                    if (token) {
                        const user = jwt.verify(token.replace('Bearer ', ''), SECRET_KEY);
                        return { user };
                    }
                } catch (e) {
                    // Invalid token
                }
                // Default to guest/employee read-only for now if we want to allow viewing without login, 
                // but requirement asks for RBAC. Let's assume unauthenticated users have no role 
                // or we assign a default 'Viewer' role if they just want to see the page.
                // For this POC, we'll return empty user if not logged in.
                return { user: { role: 'Guest' } };
            },
        }),
    );

    await new Promise<void>((resolve) => httpServer.listen({ port: 4001 }, resolve));
    console.log(`🚀 UltraShip Backend ready at http://localhost:4001/graphql`);
}

startServer();
