import * as express from 'express';
import * as next from 'next';
import * as http from 'http';
import * as socketIo from 'socket.io';

import { ChatManager } from './services/chatManager';
import { DynamoClient } from './services/dynamoClient';

const TABLE_NAME = 'personal-site';

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

const setApis = (server: express.Express): void => {
  // init dynamo  client
  const dynamo = new DynamoClient(TABLE_NAME);
  server.get('/api/id/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const resp = await dynamo.getItem(id);
      res.json(resp);
    } catch (err) {
      res.status(500).json({ message: 'error' });
    }
  });
};

const setUpPages = (server: express.Express): void => {
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
    new ChatManager(io, expressServer);
    setApis(expressServer);
    setUpPages(expressServer);

    httpServer.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  })
  .catch((ex: Error) => {
    console.error(ex.stack);
    process.exit(1);
  });