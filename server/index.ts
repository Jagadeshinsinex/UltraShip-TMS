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
import path from 'path';
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
            origin: true, // Allow all origins for simplicity in demo
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
                return { user: { role: 'Guest' } };
            },
        }),
    );

    // Serve static files from the React app
    app.use(express.static(path.join(process.cwd(), 'dist')));

    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get('*', (req, res) => {
        res.sendFile(path.join(process.cwd(), 'dist/index.html'));
    });

    const PORT = process.env.PORT || 4001;
    await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 UltraShip Backend ready on port ${PORT}`);
}

startServer();
