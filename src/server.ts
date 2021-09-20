import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './handlers/users';
import orderRoutes from './handlers/orders';

const hostAddress = process.env.SERVER_ADDRESS || '127.0.0.1';
const portAddress = process.env.SERVER_PORT || 3002;

const app: express.Application = express();
const address = `${hostAddress}:${portAddress}`;

app.use(bodyParser.json());

app.get('/', function(req: Request, res: Response) {
  res.send('Hello World!');
});

//handler routes
userRoutes(app);
orderRoutes(app);

app.listen(portAddress, function() {
  console.log(`starting app on: ${address}`);
});

export default app;
