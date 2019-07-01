"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const next = require("next");
const http = require("http");
const socketIo = require("socket.io");
const chatManager_1 = require("./services/chatManager");
const dynamoClient_1 = require("./services/dynamoClient");
const TABLE_NAME = 'personal-site';
const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();
const setApis = (server) => {
    // init dynamo  client
    const dynamo = new dynamoClient_1.DynamoClient(TABLE_NAME);
    server.get('/api/id/:id', async (req, res) => {
        const { id } = req.params;
        try {
            const resp = await dynamo.getItem(id);
            res.json(resp);
        }
        catch (err) {
            res.status(500).json({ message: 'error' });
        }
    });
};
const setUpPages = (server) => {
    server.get('/p/:id', (req, res) => {
        const actualPage = '/post';
        const queryParams = { id: req.params.id };
        app.render(req, res, actualPage, queryParams);
    });
    server.get('*', (req, res) => {
        return handle(req, res);
    });
};
app
    .prepare()
    .then(() => {
    const expressServer = express();
    const httpServer = http.createServer(expressServer);
    const io = socketIo(httpServer);
    new chatManager_1.ChatManager(io, expressServer);
    setApis(expressServer);
    setUpPages(expressServer);
    httpServer.listen(port, () => {
        console.log(`listening on port ${port}`);
    });
})
    .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
});
//# sourceMappingURL=server.js.map