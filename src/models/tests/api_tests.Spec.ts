import supertest from 'supertest';
import app from '../../server';
import { UserStore } from '../user';
import { OrderStore } from '../order';
import { ProductStore } from '../product';
import { AuthStore } from '../../middleware/auth';
import { DashboardQueries } from '../../services/dashboard';

const user = new UserStore();
const order = new OrderStore();
const product = new ProductStore();
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

describe('Testing Storefront Backend API', () => {
  describe('Tests API endpoints', () => {
    describe('Tests User endpoints exist and are responsive', () => {
      it('checks users index method exists', () => {
        expect(user.index).toBeDefined();
      });
      it('checks the users.index() method but returns 401, JWT not attached', async () => {
        const response = await request.get('/users');
        expect(response.status).toBe(401);
      });

      it('checks /users exists', async () => {
        const result = await request
          .get('/users')
          .set('Authorization', 'Bearer ' + token);
        expect(result.status).toBe(200);
        expect(result).toBeDefined();
        expect(result.body[0].firstname).toEqual('Benny');
        expect(result.body[3].lastname).toEqual('Burk');
      });

      it('get /users should return a list of 5 users with JWT', async () => {
        const result = await request
          .get('/users')
          .set('Authorization', 'Bearer ' + token);
        expect(result.status).toBe(200);
        expect(result.body.length).toBe(5);
      });

      it('checks users show method exists', async () => {
        expect(user.show).toBeDefined();
      });

      it('checks /users/:id exists', async () => {
        const result = await request
          .get('/users/2')
          .set('Authorization', 'Bearer ' + token);
        console.log('result.body is ', result.body);
        expect(result.status).toBe(200);
        expect(result).toBeDefined();
        expect(result.body.username).toEqual('Hella');
        expect(result.body.firstname).toEqual('Helen');
        expect(result.body.lastname).toEqual('Batrib');
      });

      it('checks users create method exists', () => {
        expect(user.create).toBeDefined();
      });
      it('checks /users/create exists', async () => {
        const result = await request
          .post('/users/create')
          .set('Authorization', 'Bearer ' + token)
          .send({
            username: 'hayllen',
            firstname: 'Hayian',
            lastname: 'Ganger',
            password: 'password'
          })
          .set('Accept', 'application/json');
        expect(result.status).toBe(200);
        expect(result).toBeDefined();
        expect(result.body[0].username).toEqual('hayllen');
        expect(result.body[0].firstname).toEqual('Hayian');
        expect(result.body[0].lastname).toEqual('Ganger');
        expect(result.body[0].password).not.toEqual('password');
        const checkJwt = await auth.authorise(result.body[1]);
        expect(checkJwt).toEqual('valid');
      });

      it('checks users update method exists', () => {
        expect(user.update).toBeDefined();
      });

      it('checks /users/2/update exists', async () => {
        const result = await request
          .post('/users/2/update')
          .set('Authorization', 'Bearer ' + token);
        expect(result.status).toBe(200);
        expect(result).toBeDefined();
      });

      it('checks users delete method exists', () => {
        expect(user.delete).toBeDefined();
      });

      it('checks /users/:id/delete exists', async () => {
        const setup = await request
          .get('/users')
          .set('Authorization', 'Bearer ' + token);

        const result = await request
          .delete(`/users/${setup.body.length}/delete`)
          .set('Authorization', 'Bearer ' + token);
        expect(result.status).toBe(200);
        expect(result).toBeDefined();
      });
    });

    describe('Tests Product endpoints exist and are responsive', () => {
      it('checks products index method exists', () => {
        expect(product.index).toBeDefined();
      });

      it('checks product.index() exists', async () => {
        const result = await product.index();
        expect(result.length).toEqual(6);
      });

      it('checks /products exists', async () => {
        const result = await request.get('/products');
        expect(result.status).toBe(200);
        expect(result).toBeDefined();
        expect(result.body.length).toEqual(6);
      });

      it('checks products show method exists', async () => {
        expect(product.show).toBeDefined();
      });

      it('checks /products/:id exists', async () => {
        const result = await request.get('/products/2');
        expect(result.status).toBe(200);
        expect(result).toBeDefined();
      });

      it('checks products create method exists', () => {
        expect(product.create).toBeDefined();
      });

      it('checks /product/create exists', async () => {
        const result = await request
          .post('/products/create')
          .set('Authorization', 'Bearer ' + token)
          .send({
            name: 'Printer - label',
            price: 350,
            category: 'printer'
          })
          .set('Accept', 'application/json');
        console.log('result.body is ', result.body);
        expect(result.status).toBe(200);
        expect(result).toBeDefined();
        expect(result.body.name).toEqual('Printer - label');
      });

      it('checks product update method exists', () => {
        expect(product.update).toBeDefined();
      });

      it('checks /products/:id/update exists', async () => {
        const result = await request
          .post('/products/4/update')
          .set('Authorization', 'Bearer ' + token)
          .send({
            id: 4,
            name: 'Stapler - for 50 pages',
            price: 5,
            category: 'stationary'
          });
        console.log('result.body is ', result.body);
        expect(result.status).toBe(200);
        expect(result).toBeDefined();
        expect(result.body.name).toEqual('Stapler - for 50 pages');
      });

      it('checks products delete method exists', () => {
        expect(product.delete).toBeDefined();
      });

      it('checks /products/:id/delete exists', async () => {
        const setup = await request
          .get('/products')
          .set('Authorization', 'Bearer ' + token);

        const result = await request
          .delete(`/products/${setup.body.length}/delete`) //setup.body.length == 7
          .set('Authorization', 'Bearer ' + token);
        expect(result.status).toBe(200);
        expect(result).toBeDefined();
      });
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

      it('checks /orders/:id/delete exists', async () => {
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
  });
});
