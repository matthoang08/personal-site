import * as express from 'express';
import * as next from 'next';

import { DynamoClient } from './services/dynamoClient';

const TABLE_NAME = 'personal-site';

const dev = process.env.NODE_ENV !== 'production';
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

app
  .prepare()
  .then(() => {
    const server = express();

    setApis(server);

    server.get('/p/:id', (req, res) => {
      const actualPage = '/post';
      const queryParams = { id: req.params.id };
      app.render(req, res, actualPage, queryParams);
    });

    server.get('*', (req, res) => {
      return handle(req, res);
    });

    server.listen(3000, (err: Error) => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });
  })
  .catch((ex: Error) => {
    console.error(ex.stack);
    process.exit(1);
  });