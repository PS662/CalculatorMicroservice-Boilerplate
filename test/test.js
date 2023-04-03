process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../server');
const { expect } = require('chai');
const config = require('../config');

describe('GET /', () => {
  it('should return status 200 and a HTML page with a title, heading, and paragraph', async () => {
    const response = await request(app)
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200);
  });
});

let token;
before(async () => {
  const response = await request(app)
    .post('/api/login')
    .send({ email: config.testUser.email, password: config.testUser.password });
  token = response.body.token;
});

describe('POST /add', () => {
  it('should return status 200 and the sum of two numbers', async () => {
    const num1 = 2;
    const num2 = 3;
    const response = await request(app)
      .post('/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ num1: num1, num2: num2 })
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body).to.deep.equal({ result: num1 + num2 });
  });
  it('should return status 400 and an error message for invalid input', async () => {
    const num1 = 'invalid';
    const num2 = 3;
    const response = await request(app)
      .post('/add')
      .set('Authorization', `Bearer ${token}`)
      .send({ num1: num1, num2: num2 })
      .expect('Content-Type', /json/)
      .expect(400);
    expect(response.body).to.deep.equal({ error: 'Invalid input parameters' });
  });
});

describe('POST /subtract', () => {
  it('should return status 200 and the difference of two numbers', async () => {
    const num1 = 5;
    const num2 = 2;
    const response = await request(app)
      .post('/subtract')
      .set('Authorization', `Bearer ${token}`)
      .send({ num1: num1, num2: num2 })
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body).to.deep.equal({ result: num1 - num2 });
  });
  it('should return status 400 and an error message for invalid input', async () => {
    const num1 = 'invalid';
    const num2 = 3;
    const response = await request(app)
      .post('/subtract')
      .set('Authorization', `Bearer ${token}`)
      .send({ num1: num1, num2: num2 })
      .expect('Content-Type', /json/)
      .expect(400);
    expect(response.body).to.deep.equal({ error: 'Invalid input parameters' });
  });
});

describe('POST /multiply', () => {
  it('should return status 200 and the product of two numbers', async () => {
    const num1 = 2;
    const num2 = 3;
    const response = await request(app)
      .post('/multiply')
      .set('Authorization', `Bearer ${token}`)
      .send({ num1: num1, num2: num2 })
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body).to.deep.equal({ result: num1 * num2 });
  });
  it('should return status 400 and an error message for invalid input', async () => {
    const num1 = 'invalid';
    const num2 = 3;
    const response = await request(app)
      .post('/multiply')
      .set('Authorization', `Bearer ${token}`)
      .send({ num1: num1, num2: num2 })
      .expect('Content-Type', /json/)
      .expect(400);
    expect(response.body).to.deep.equal({ error: 'Invalid input parameters' });
  });
});

describe('POST /divide', () => {
  it('should return status 200 and the quotient of two numbers', async () => {
    const num1 = 6;
    const num2 = 3;
    const response = await request(app)
      .post('/divide')
      .set('Authorization', `Bearer ${token}`)
      .send({ num1: num1, num2: num2 })
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body).to.deep.equal({ result: num1 / num2 });
  });

  it('should return status 400 and an error message for invalid input', async () => {
    const num1 = 'invalid';
    const num2 = 3;
    const response = await request(app)
      .post('/divide')
      .set('Authorization', `Bearer ${token}`)
      .send({ num1: num1, num2: num2 })
      .expect('Content-Type', /json/)
      .expect(400);
    expect(response.body).to.deep.equal({ error: 'Invalid input parameters' });
  });
  it('should return status 400 and an error message for division by zero', async () => {
    const num1 = 6;
    const num2 = 0;
    const response = await request(app)
      .post('/divide')
      .set('Authorization', `Bearer ${token}`)
      .send({ num1: num1, num2: num2 })
      .expect('Content-Type', /json/)
      .expect(400);
    expect(response.body).to.deep.equal({ error: 'Cannot divide by zero' });
  });
});

describe('POST /login', () => {
  it('should return status 200 and a token for valid credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: config.testUser.email, password: config.testUser.password })
      .expect('Content-Type', /json/)
      .expect(200);
    expect(response.body).to.have.property('token');
  });

  it('should return status 401 and an error message for invalid credentials', async () => {
    const response = await request(app)
      .post('/api/login')
      .send({ email: config.testUser.email, password: 'invalidpassword' })
      .expect('Content-Type', /json/)
      .expect(401);
    expect(response.body).to.deep.equal({ success: false, message: 'Invalid email or password' });
  });
});

describe('GET /protected', () => {
  it('should return status 401 and an error message for unauthenticated requests', async () => {
    const response = await request(app)
      .get('/api/protected')
      .expect(401);
  });

  it('should return status 200 and a success message for authenticated requests', async () => {
    const response = await request(app)
      .get('/api/protected')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body).to.deep.equal({ success: true, message: 'You have access to protected content!' });
  });
});