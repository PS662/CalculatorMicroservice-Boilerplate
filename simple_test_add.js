const axios = require('axios');
const config = require('./config');

async function getAccessToken() {
  try {
    const response = await axios.post(`http://localhost:${config.port}/api/login`, {
      email: config.testUser.email,
      password: config.testUser.password
    });
    return response.data.token;
  } catch (error) {
    console.error(error);
  }
}

async function testAddition() {
  const num1 = 3;
  const num2 = 4;
  const accessToken = await getAccessToken();
  console.log(`Response: ${JSON.stringify(accessToken)}`);
  try {
    const response = await axios.post(`http://localhost:${config.port}/add`, {
      num1: num1,
      num2: num2
    }, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
      });
    console.log(`Result of ${num1} + ${num2} is: ${response.data["result"]}`);
  } catch (error) {
    console.error(error);
  }
}

testAddition();