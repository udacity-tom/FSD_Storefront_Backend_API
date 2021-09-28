import supertest from 'supertest';
import app from '../../server';
import { User, UserStore } from '../user';
import { Order, OrderStore } from '../order';
import { Product, ProductStore } from '../product';
import { AuthStore } from '../../middleware/auth';
import { response } from 'express';

const user = new UserStore();
const order = new OrderStore();
const product = new ProductStore();
const request = supertest(app);
//token for user 2
const token2 =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywidXNlcm5hbWUiOiJoYXlsbGVuIiwiZmlyc3RuYW1lIjoiSGF5aWFuIiwibGFzdG5hbWUiOiIiLCJwYXNzd29yZCI6IiIsImlhdCI6MTYzMjc2MjAwMywiZXhwIjoxNjM1MzU0MDAzLCJzdWIiOiJhY2Nlc3MifQ.qnBycdV1Qnohe136kTfJL-SnjUVERuepSLrKi-0kp4Y';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwidXNlcm5hbWUiOiJCaWxsIiwiZmlyc3RuYW1lIjoiV2lsbGlhbSIsImxhc3RuYW1lIjoiIiwicGFzc3dvcmQiOiIiLCJpYXQiOjE2MzI3NTg3MTQsImV4cCI6MTYzNTM1MDcxNCwic3ViIjoiYWNjZXNzIn0.UubwgMckFLWe_RP8nbre-_zrBCudajuzkQ4RndxHc5I';
const auth = new AuthStore();

describe('Testing Storefront Backend API', () => {
  describe('Tests API endpoints', () => {
    describe('Tests User endpoints exist and are responsive', () => {
      it('checks users index method exists', () => {
        expect(user.index).toBeDefined();
      });
      it('checks /users exists', async () => {
        const result = await request
          .get('/users')
          .set('Authorization', 'Bearer ' + token);
        //   console.log('result is ', result);
        expect(result.status).toBe(200);
        expect(result).toBeDefined();
      });
      it('checks users show method exists', async () => {
        expect(user.show).toBeDefined();
      });
      it('checks /users/:id exists', async () => {
        const result = await request
          .get('/users/2')
          .set('Authorization', 'Bearer ' + token);
        //   console.log('result is ', result);
        expect(result.status).toBe(200);
        expect(result).toBeDefined();
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
        // console.log('result is ', result);
        expect(result.status).toBe(200);
        expect(result).toBeDefined();
      });
      it('checks users update method exists', () => {
        expect(user.update).toBeDefined();
      });
      it('checks /users/2/update exists', async () => {
        const result = await request
          .post('/users/2/update')
          .set('Authorization', 'Bearer ' + token);
        //   console.log('result is ', result);
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
        //   console.log('result is ', result);

        const result = await request
          .delete(`/users/${setup.body.length}/delete`)
          .set('Authorization', 'Bearer ' + token);
        //   console.log('result is ', result);
        expect(result.status).toBe(200);
        expect(result).toBeDefined();
      });
    });
    describe('Tests Product endpoints exist and are responsive', () => {
      it('checks products index method exists', () => {
        expect(product.index).toBeDefined();
      });
      it('checks /products exists', async () => {
        const result = await request.get('/products');
        //   console.log('result is ', result);
        expect(result.status).toBe(200);
        expect(result).toBeDefined();
      });
      it('checks products show method exists', async () => {
        expect(product.show).toBeDefined();
      });
      it('checks /products/:id exists', async () => {
        const result = await request.get('/products/2');
        //   console.log('result is ', result);
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
      });
      it('checks products delete method exists', () => {
        expect(product.delete).toBeDefined();
      });

      it('checks /products/:id/delete exists', async () => {
        const setup = await request
          .get('/products')
          .set('Authorization', 'Bearer ' + token);
        //   console.log('result is ', result);
        // console.log('setup value is ', setup.body.length);
        const result = await request
          .delete(`/products/${setup.body.length}/delete`) //setup.body.length == 7
          .set('Authorization', 'Bearer ' + token);
        //   console.log('result is ', result);
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
        //   console.log('result is ', result);
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
        //   console.log('result is ', result);
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
        //   console.log('result is ', result);
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
        //   console.log('result is ', result);
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
      });
      it('checks orders delete method exists', () => {
        expect(order.delete).toBeDefined();
      });

      it('checks /orders/:id/delete exists', async () => {
        const setup = await request
          .get('/orders')
          .set('Authorization', 'Bearer ' + token);
        //   console.log('result is ', result);
        console.log('setup value is ', setup.body.length);
        const result = await request
          .delete(`/users/3/orders/${setup.body.length}`) //setup.body.length == 7
          .set('Authorization', 'Bearer ' + token);
        //   console.log('result is ', result);
        expect(result.status).toBe(200);
        expect(result).toBeDefined();
      });
    });
    describe('Tests User database exist and are responsive', () => {
      it('checks the users.index() method but returns 401, JWT not attached', async () => {
        const response = await request.get('/users');
        expect(response.status).toBe(401);
      });

      it('get /users should return a list of 5 users with JWT', async () => {
        const result = await request
          .get('/users')
          .set('Authorization', 'Bearer ' + token);
        //   console.log('result is ', result);
        expect(result.status).toBe(200);
        expect(result.body.length).toBe(5);
        //   expect(result).toBe
      });
      it('get /users/2 should return only user with id=2 with JWT', async () => {
        const result = await request
          .get('/users/2')
          .set('Authorization', 'Bearer ' + token);
        //   console.log('result is ', result);
        expect(result.status).toBe(200);
        expect(result.body.id).toBe(2);
        expect(result.body.username).toBe('Hella');
        expect(result.body.firstname).toBe('Helen');
        expect(result.body.lastname).toBe('Batrib');
        //   expect(result).toBe
      });
      it('post /users/create should create new user with JWT', async () => {
        const result = await request
          .get('/users/2')
          .set('Authorization', 'Bearer ' + token);
        //   console.log('result is ', result);
        expect(result.status).toBe(200);
        expect(result.body.id).toBe(2);
        expect(result.body.username).toBe('Hella');
        expect(result.body.firstname).toBe('Helen');
        expect(result.body.lastname).toBe('Batrib');
        //   expect(result).toBe
      });
    });

    describe('User model/handler tests functions exists', () => {
      it('checks the users.index() method but needs JWT-missing so 401 returned', async () => {
        //   beforeAll(async () => {
        const response = await request.get('/users');
        //   console.log('response is: ', response);
        console.log('No JWT!-> access failure 401');
        expect(response.status).toBe(401);
        //   });
      });
      it('checks users index method exists', () => {
        expect(user.index).toBeDefined();
      });

      it('index method should return a list of users', async () => {
        const result = await request
          .get('/users')
          .set('Authorization', 'Bearer ' + token);
        //   console.log('result is ', result);
        expect(result.status).toBe(200);
        //   expect(result).toBe
      });
    });
  });

  describe('Auth functions exist, checks jwt is decoded', () => {
    it('checks auth.authenticate() function exists ', async () => {
      const username = 'Bill';
      const password = 'password';
      const result = await auth.authenticate(username, password);
      expect(result).toBeDefined();
    });
  });

  describe('Checks order routes ', () => {
    it('checks order.index() exists', async () => {
      const result = await order.index();
      expect(result).toBeDefined();
    });
  });
  describe('Checks products Endpoint, etc are setup', () => {
    describe('Checks product routes ', () => {
      it('checks product.index() exists', async () => {
        const result = await product.index();
        console.log('products returned', result.length);
        expect(result.length).toEqual(6);
      });
    });
    // describe('Lists products in test database', () => {
    //     it('gets all products in test database (==6)', () => {
    //         const result = await product.index();
    //         expect(result).toEqual(6);
    //     })
    // });
  });
});
