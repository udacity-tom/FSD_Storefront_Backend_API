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

  it('checks the output of the SQL logic for /users', async () => {
    const userArray = [
      {
        id: 1,
        username: 'Barney',
        firstname: 'Benny',
        lastname: 'Scholpferb',
        password: '%%$$$$$9adkaj'
      },
      {
        id: 2,
        username: 'Hella',
        firstname: 'Helen',
        lastname: 'Batrib',
        password: '$2b$10$vdxOw56kdXTjuh.v8IvlPOF1fu3yvleynLYYbkJw8qPEBeIVWCuSG'
      },
      {
        id: 3,
        username: 'Jakey',
        firstname: 'Jake',
        lastname: 'Grossenpfiff',
        password: '$2b$10$Nwz5HSm8IGxvPBKrtWFmHOEfMqoIlwI6dBB7DMyFalZISMTSqf.MW'
      },
      {
        id: 4,
        username: 'Will',
        firstname: 'William',
        lastname: 'Burk',
        password: '$2b$10$6Scfn2HTUNtQKStr6G1meeOcWkbCoy2kcQdflcbR9rJ2105GfQogG'
      },
      {
        id: 5,
        username: 'Bill',
        firstname: 'William',
        lastname: 'Burk',
        password: '$2b$10$K/JK3x0..R.PeLZSuZMrHuRzgIP2D8RPxzOXSTMoDqxaigC6XxFum'
      }
    ];
    const result = await request
      .get('/users')
      .set('Authorization', 'Bearer ' + token);
    expect(result.body).toEqual(userArray);
  });

  it('checks users show method exists', async () => {
    expect(user.show).toBeDefined();
  });

  it('checks /users/:id exists and checks SQL returns user id=2', async () => {
    const user2 = {
      id: 2,
      username: 'Hella',
      firstname: 'Helen',
      lastname: 'Batrib',
      password: '$2b$10$vdxOw56kdXTjuh.v8IvlPOF1fu3yvleynLYYbkJw8qPEBeIVWCuSG'
    };
    const result = await request
      .get('/users/2')
      .set('Authorization', 'Bearer ' + token);
    console.log('result.body is ', result.body);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
    expect(result.body.username).toEqual('Hella');
    expect(result.body.firstname).toEqual('Helen');
    expect(result.body.lastname).toEqual('Batrib');
    expect(result.body).toEqual(user2);
  });

  it('checks users create method exists', () => {
    expect(user.create).toBeDefined();
  });
  it('checks /users/create is created correctly and SQL returns new user and JWT', async () => {
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

  it('checks put /users/2 update exists and SQL updates DB', async () => {
    const userUpdate = {
      username: 'Hellana'
    };
    const result = await request
      .put('/users/2')
      .set('Authorization', 'Bearer ' + token)
      .send(userUpdate);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
    expect(result.body.username).toEqual('Hellana');
  });

  it('checks users delete method and SQL has deleted order', () => {
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

    const testDelete = await request
      .get('/users')
      .set('Authorization', 'Bearer ' + token);
    expect(testDelete.body.length).toEqual(setup.body.length - 1);
  });
});
