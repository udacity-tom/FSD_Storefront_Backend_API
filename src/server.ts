import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import userRoutes from './handlers/users';
import orderRoutes from './handlers/orders';
import productRoutes from './handlers/products';
import dashboardRoutes from './handlers/dashboards';

const hostAddress = process.env.SERVER_ADDRESS || '127.0.0.1';
const portAddress = process.env.SERVER_PORT || 3002;

const app: express.Application = express();
const address = `${hostAddress}:${portAddress}`;

app.use(bodyParser.json());
//handler routes
userRoutes(app);
orderRoutes(app);
productRoutes(app);
dashboardRoutes(app);

app.get('/', function(req: Request, res: Response) {
  res.send(
    'Storefront Backend API Welcome!<br>' +
      'GET /users<br> GET /users/:id<br>POST /users/create<br>POST /users/authenticate<br>PUT /users/:id<br>DELETE /users/:id<br>GET /users/:id/orders<br>GET /orders<br>GET /orders/:oid<br>GET /users/:id/orders/:oid<br>POST /users/:id/orders/create<br>POST /users/:id/orders/:oid/add-product<br>DELETE /users/:id/orders/:oid<br>GET /products<br>GET /products/:id<br>POST /products/create<br>PUT /products/:id<br>DELETE /products/:id<br>GET /products/info/top-5-products<br>GET /products/category/:category<br>GET /users/:id/orders/complete/all<br>GET /'
  );
});

app.listen(portAddress, function() {
  console.log(`starting app on: ${address}`);
});

export default app;
