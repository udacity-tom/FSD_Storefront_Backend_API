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

  it('checks /products exists checks SQL logic delivers array', async () => {
    const productsArray = [
      {
        id: 1,
        name: 'Pen',
        price: '1.20',
        category: 'stationary'
      },
      {
        id: 2,
        name: 'Pencil',
        price: '0.50',
        category: 'stationary'
      },
      {
        id: 3,
        name: 'Pad of Paper',
        price: '2.10',
        category: 'stationary'
      },
      {
        id: 4,
        name: 'Stapler',
        price: '5.00',
        category: 'stationary'
      },
      {
        id: 5,
        name: 'Desktop Computer',
        price: '1000.00',
        category: 'office electronics'
      },
      {
        id: 6,
        name: 'Phone',
        price: '399.00',
        category: 'office electronics'
      }
    ];
    const result = await request.get('/products');
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
    expect(result.body.length).toEqual(6);
    expect(result.body).toEqual(productsArray);
  });

  it('checks products show method exists', async () => {
    expect(product.show).toBeDefined();
  });

  it('checks /products/:id exists Checks SQL logic returns product id=2', async () => {
    const productTwo = {
      id: 2,
      name: 'Pencil',
      price: '0.50',
      category: 'stationary'
    };
    const result = await request.get('/products/2');
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
    expect(result.body).toEqual(productTwo);
  });

  it('checks products create method exists', () => {
    expect(product.create).toBeDefined();
  });

  it('checks /product/create exists, checks SQL returned item', async () => {
    const result = await request
      .post('/products/create')
      .set('Authorization', 'Bearer ' + token)
      .send({
        name: 'Printer - label',
        price: '350.00',
        category: 'printer'
      })
      .set('Accept', 'application/json');
    console.log('result.body is ', result.body);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();
    expect(result.body.name).toEqual('Printer - label');
    expect(result.body.price).toEqual('350.00');
    expect(result.body.category).toEqual('printer');
  });

  it('checks product update method exists', () => {
    expect(product.update).toBeDefined();
  });

  it('checks put/update route /products/:id exists and SQL updates', async () => {
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

  it('checks delte route /products/:id exists checks SQL delete', async () => {
    const setup = await request
      .get('/products')
      .set('Authorization', 'Bearer ' + token);

    const result = await request
      .delete(`/products/${setup.body.length}`) //setup.body.length == 7
      .set('Authorization', 'Bearer ' + token);
    expect(result.status).toBe(200);
    expect(result).toBeDefined();

    const testDelete = await request
      .get('/products')
      .set('Authorization', 'Bearer ' + token);
    expect(testDelete.body.length).toEqual(setup.body.length - 1);
  });
});
