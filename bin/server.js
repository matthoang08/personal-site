"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const next = require("next");
const dynamoClient_1 = require("./services/dynamoClient");
const TABLE_NAME = 'personal-site';
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
app
    .prepare()
    .then(() => {
    const server = express();
    // init dynamo  client
    const dynamo = new dynamoClient_1.DynamoClient(TABLE_NAME);
    server.get('/p/:id', (req, res) => {
        const actualPage = '/post';
        const queryParams = { id: req.params.id };
        app.render(req, res, actualPage, queryParams);
    });
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
    server.get('*', (req, res) => {
        return handle(req, res);
    });
    server.listen(3000, (err) => {
        if (err)
            throw err;
        console.log('> Ready on http://localhost:3000');
    });
})
    .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
});
//# sourceMappingURL=server.js.map