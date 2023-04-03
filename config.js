module.exports = {
  port: process.env.NODE_ENV === 'test' ? 3001 : 3000,
  secret: 'mysecretkey123',
  testUser: {
    email: 'testuser@test.com',
    password: 'testpassword'
  }
};