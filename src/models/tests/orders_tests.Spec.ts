import supertest from 'supertest';
import app from '../../server';
import { OrderStore } from '../order';
import { AuthStore } from '../../middleware/auth';
import { DashboardQueries } from '../../services/dashboard';

const order = new OrderStore();
const service = new DashboardQueries();
const auth = new AuthStore();
const request = supertest(app);

let token: string;

beforeAll(async () => {
  const result = await request
    .post('/users/authenticate')
    .send({
      username: 'Bill',
      password: 'password'
    })
    .set('Accept', 'application/json');
  token = result.text;
});

describe('Tests Orders endpoints exist and are responsive', () => {
  it('checks orders index method exists', () => {
    expect(order.index).toBeDefined();
  });

  it('checks /orders exists', async () => {
    const result = await request
      .get('/orders')
      .set('Authorization', 'Bearer ' + token);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
  });

  it('checks orders show method exists', async () => {
    expect(order.show).toBeDefined();
  });

  it('checks /orders/:oid exists', async () => {
    const result = await request
      .get('/orders/2')
      .set('Authorization', 'Bearer ' + token);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
  });

  it('checks orders showUserOrders method exists', async () => {
    expect(order.showUserOrders).toBeDefined();
  });

  it('checks /users/:id/orders/ exists', async () => {
    const result = await request
      .get('/users/2/orders/')
      .set('Authorization', 'Bearer ' + token);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
  });

  it('checks orders showOrder method exists', async () => {
    expect(order.showOrder).toBeDefined();
  });

  it('checks /users/:id/orders/:oid exists', async () => {
    const result = await request
      .get('/users/2/orders/4')
      .set('Authorization', 'Bearer ' + token);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
  });

  it('checks orders create method exists', () => {
    expect(order.create).toBeDefined();
  });

  it('checks /orders/create exists', async () => {
    const result = await request
      .post('/users/2/orders/create')
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json');
    console.log('result.body is ', result.body);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
  });

  it('checks order addProduct method exists', () => {
    expect(order.addProduct).toBeDefined();
  });

  it('checks /users/:id/orders/:oid/add-product', async () => {
    const result = await request
      .post('/users/2/orders/5/add-product')
      .set('Authorization', 'Bearer ' + token)
      .send({
        id: '2',
        quantity: '50'
      });
    console.log('result.body is ', result.body);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
    expect(result.body.quantity).toEqual(50);
    expect(result.body.product_id).toEqual('2');
  });

  it('checks orders delete method exists', () => {
    expect(order.delete).toBeDefined();
  });

  it('checks users/:id/orders/:oid/delete exists', async () => {
    const setup = await request
      .get('/orders')
      .set('Authorization', 'Bearer ' + token);

    const result = await request
      .delete(`/users/3/orders/${setup.body.length}`) //setup.body.length == 7
      .set('Authorization', 'Bearer ' + token);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
  });
});
describe('Tests service endpoints exist and are responsive', () => {
  it('checks service topFiveProducts method exists', () => {
    expect(service.popularProducts).toBeDefined();
  });
  it('checks /products/info/top-5-products exists', async () => {
    const result = await request.get('/products/info/top-5-products');
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
  });
  it('checks service productsByCategory method exists', async () => {
    expect(service.productsByCategory).toBeDefined();
  });
  it('checks /products/category/:category exists', async () => {
    const result = await request.get('/products/category/stationary');
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
  });
  it('checks service userOrdersCompleted method exists', async () => {
    expect(order.showUserOrders).toBeDefined();
  });
  it('checks /users/:id/orders/complete/all exists', async () => {
    const result = await request
      .get('/users/2/orders/complete/all')
      .set('Authorization', 'Bearer ' + token);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
    expect(result.body[0].status).toEqual('complete');
    expect(result.body[0].id).toEqual(4);
  });
});
describe('Tests User database exist and are responsive', () => {
  it('get /users/2 should return only user with id=2', async () => {
    const result = await request
      .get('/users/2')
      .set('Authorization', 'Bearer ' + token);
    expect(result.status).toBe(200);
    expect(result.body.id).toBe(2);
    expect(result.body.username).toBe('Hella');
    expect(result.body.firstname).toBe('Helen');
    expect(result.body.lastname).toBe('Batrib');
  });
  it('post /users/create should create new user with JWT', async () => {
    const result = await request
      .get('/users/2')
      .set('Authorization', 'Bearer ' + token);
    expect(result.status).toBe(200);
    expect(result.body.id).toBe(2);
    expect(result.body.username).toBe('Hella');
    expect(result.body.firstname).toBe('Helen');
    expect(result.body.lastname).toBe('Batrib');
  });
});

describe('Auth functions exist, checks jwt is decoded', () => {
  it('checks auth.authenticate() function exists ', async () => {
    const username = 'Bill';
    const password = 'password';
    const result = await auth.authenticate(username, password);
    console.log('auth output', result);
    expect(result).toBeDefined();
    expect(result);
  });
});
