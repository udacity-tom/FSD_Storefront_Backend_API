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
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRhbSIsImZpcnN0bmFtZSI6IlRpbW90aHkiLCJsYXN0bmFtZSI6IiIsInBhc3N3b3JkIjoiIiwiaWF0IjoxNjMyMTM1NDkyLCJleHAiOjE2MzQ3Mjc0OTIsInN1YiI6ImFjY2VzcyJ9.-5jpC3p1EgKFyv-0myrkI5UUOMFbJy7uPGLT0pfOD1g';
const auth = new AuthStore();

describe('Initial function availability tests->testing DB setup, DB, function existance, jasmine ', () => {
  describe('User model/handler tests functions exists', () => {
    it('checks the users.index() method but needs JWT-missing so 401 returned', async () => {
      //   beforeAll(async () => {
      const response = await request.get('/users');
      //   console.log('response is: ', response);
      console.log('No JWT!-> access failure');
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
  describe('Checks product routes ', () => {
    it('checks product.index() exists', async () => {
      const result = await product.index();
      expect(result).toBeDefined();
    });
  });
});
