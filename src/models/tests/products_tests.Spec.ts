import supertest from 'supertest';
import app from '../../server';
import { ProductStore } from '../product';

const product = new ProductStore();
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

  it('checks /products/:id exists', async () => {
    const result = await request
      .put('/products/4')
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

  it('checks /products/:id exists', async () => {
    const setup = await request
      .get('/products')
      .set('Authorization', 'Bearer ' + token);

    const result = await request
      .delete(`/products/${setup.body.length}`) //setup.body.length == 7
      .set('Authorization', 'Bearer ' + token);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
  });
});
