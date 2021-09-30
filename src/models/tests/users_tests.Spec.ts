import supertest from 'supertest';
import app from '../../server';
import { UserStore } from '../user';
import { AuthStore } from '../../middleware/auth';

const user = new UserStore();
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
  it('checks /users/create is created correctly', async () => {
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

  it('checks /users/2 update exists', async () => {
    const result = await request
      .put('/users/2')
      .set('Authorization', 'Bearer ' + token);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
  });

  it('checks users delete method exists', () => {
    expect(user.delete).toBeDefined();
  });

  it('checks /users/:id exists', async () => {
    const setup = await request
      .get('/users')
      .set('Authorization', 'Bearer ' + token);

    const result = await request
      .delete(`/users/${setup.body.length}`)
      .set('Authorization', 'Bearer ' + token);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
  });
});
