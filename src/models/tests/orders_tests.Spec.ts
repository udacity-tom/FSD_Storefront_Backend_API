import supertest from 'supertest';
import app from '../../server';
import { OrderStore } from '../order';
import { DashboardQueries } from '../../services/dashboard';

const order = new OrderStore();
const service = new DashboardQueries();
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

describe('Tests Orders endpoints ', () => {
  it('checks orders index method, checks SQL lists orders,', () => {
    expect(order.index).toBeDefined();
  });

  it('checks /orders exists', async () => {
    const orderList = [
      {
        id: 1,
        user_id: '1',
        status: 'complete'
      },
      {
        id: 2,
        user_id: '1',
        status: 'complete'
      },
      {
        id: 3,
        user_id: '1',
        status: 'active'
      },
      {
        id: 4,
        user_id: '2',
        status: 'complete'
      },
      {
        id: 5,
        user_id: '2',
        status: 'active'
      },
      {
        id: 6,
        user_id: '5',
        status: 'active'
      },
      {
        id: 7,
        user_id: '5',
        status: 'complete'
      },
      {
        id: 8,
        user_id: '5',
        status: 'active'
      }
    ];
    const result = await request
      .get('/orders')
      .set('Authorization', 'Bearer ' + token);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
    expect(result.body).toEqual(orderList);
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

  it('checks /users/:id/orders/ exists, checks SQL delivers order id=2', async () => {
    const orderTwo = [
      {
        id: 4,
        user_id: '2',
        status: 'complete'
      },
      {
        id: 5,
        user_id: '2',
        status: 'active'
      }
    ];
    const result = await request
      .get('/users/2/orders/')
      .set('Authorization', 'Bearer ' + token);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
    expect(result.body).toEqual(orderTwo);
  });

  it('checks orders showOrder method exists', async () => {
    expect(order.showOrder).toBeDefined();
  });

  it('checks /users/:id/orders/:oid and SQL logic on return', async () => {
    const userTwoOrderFour = [
      {
        id: 2,
        product_id: '6',
        quantity: 2,
        order_id: '4'
      },
      {
        id: 7,
        product_id: '4',
        quantity: 2,
        order_id: '4'
      }
    ];
    const result = await request
      .get('/users/2/orders/4')
      .set('Authorization', 'Bearer ' + token);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
    expect(result.body).toEqual(userTwoOrderFour);
  });

  it('checks orders create method exists', () => {
    expect(order.create).toBeDefined();
  });

  it('checks /orders/create And SQL logic returns new order', async () => {
    const checkNewOrder = {
      id: 9,
      user_id: '2',
      status: 'active'
    };
    const result = await request
      .post('/users/2/orders/create')
      .set('Authorization', 'Bearer ' + token)
      .set('Accept', 'application/json');
    console.log('result.body is ', result.body);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
    expect(result.body).toEqual(checkNewOrder);
  });

  it('checks order addProduct method exists', () => {
    expect(order.addProduct).toBeDefined();
  });

  it('checks /users/:id/orders/:oid/add-product & checks SQL order is added.', async () => {
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

  it('checks users/:id/orders/:oid/delete and confirms SQL has deleted order', async () => {
    const setup = await request
      .get('/orders')
      .set('Authorization', 'Bearer ' + token);

    const result = await request
      .delete(`/users/3/orders/${setup.body.length}`) //setup.body.length == 7
      .set('Authorization', 'Bearer ' + token);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();

    const testDelete = await request
      .get('/orders')
      .set('Authorization', 'Bearer ' + token);
    expect(testDelete.body.length).toEqual(setup.body.length - 1);
  });
});
describe('Tests service endpoints exist and are responsive', () => {
  it('checks service topFiveProducts method exists', () => {
    expect(service.popularProducts).toBeDefined();
  });
  it('checks /products/info/top-5-products exists and SQL returns 5 products', async () => {
    const result = await request.get('/products/info/top-5-products');
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
    expect(result.body.length).toEqual(5);
  });
  it('checks service productsByCategory method exists', async () => {
    expect(service.productsByCategory).toBeDefined();
  });
  it('checks /products/category/:category and SQL returns only staitionary products', async () => {
    const result = await request.get('/products/category/stationary');
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
    expect(result.body[0].category).toEqual('stationary');
    expect(result.body[1].category).toEqual('stationary');
    expect(result.body[2].category).toEqual('stationary');
    expect(result.body[3].category).toEqual('stationary');
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
