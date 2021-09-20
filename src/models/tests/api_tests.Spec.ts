import supertest from 'supertest';
import app from '../../server';
import { User, UserStore } from '../user';
import { AuthStore } from '../../middleware/auth';
import { response } from 'express';

const store = new UserStore();
const request = supertest(app);
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRhbSIsImZpcnN0bmFtZSI6IlRpbW90aHkiLCJsYXN0bmFtZSI6IiIsInBhc3N3b3JkIjoiIiwiaWF0IjoxNjMyMTM1NDkyLCJleHAiOjE2MzQ3Mjc0OTIsInN1YiI6ImFjY2VzcyJ9.-5jpC3p1EgKFyv-0myrkI5UUOMFbJy7uPGLT0pfOD1g';
const auth = new AuthStore();

describe('Initial function availability tests->testing DB setup, DB, function existance, jasmine ', () => {
  describe('User model/handler tests functions exists', () => {
    it('checks the index() methods exists', async () => {
      //   beforeAll(async () => {
      const response = await request.get('/users');
      //   console.log('response is: ', response);
      expect(response.status).toBe(200);
      //   });
    });
    it('checks method exists', () => {
      expect(store.index).toBeDefined();
    });

    it('index method should return a list of users', async () => {
      const result = await request
        .get('/users')
        .set('Authorization', 'Bearer ' + token);
      //   console.log('result is ', result);
      expect(result.status).toBe(200);
    });
  });
  describe('Auth functions exist', () => {
    it('checks auth.authenticate() function exists ', () => {
      const username = 'Bill';
      const password = 'password';
      expect(auth.authenticate(username, password)).toBeDefined();
    });
  });
});
