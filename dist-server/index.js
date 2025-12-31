"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const schema_1 = require("./schema");
const resolvers_1 = require("./resolvers");
const path_1 = __importDefault(require("path"));
const SECRET_KEY = "ultra-secret-key";
async function startServer() {
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    const server = new server_1.ApolloServer({
        typeDefs: schema_1.typeDefs,
        resolvers: resolvers_1.resolvers,
        plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
    });
    await server.start();
    app.use('/graphql', (0, cors_1.default)({
        origin: true, // Allow all origins for simplicity in demo
        credentials: true
    }), body_parser_1.default.json(), (0, express4_1.expressMiddleware)(server, {
        context: async ({ req }) => {
            const token = req.headers.authorization || '';
            try {
                if (token) {
                    const user = jsonwebtoken_1.default.verify(token.replace('Bearer ', ''), SECRET_KEY);
                    return { user };
                }
            }
            catch (e) {
                // Invalid token
            }
            return { user: { role: 'Guest' } };
        },
    }));
    // Serve static files from the React app
    app.use(express_1.default.static(path_1.default.join(process.cwd(), 'dist')));
    // The "catchall" handler: for any request that doesn't
    // match one above, send back React's index.html file.
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(process.cwd(), 'dist/index.html'));
    });
    const PORT = process.env.PORT || 4001;
    await new Promise((resolve) => httpServer.listen({ port: PORT }, resolve));
    console.log(`🚀 UltraShip Backend ready on port ${PORT}`);
}
startServer();
