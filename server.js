const express = require('express');
const winston = require('winston');
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const config = require('./config');

//Ideally I would have this somewhere else, but just for demonstration
const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    password: 'password'
  },
  {
    id: 2,
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    password: 'password'
  },
  {
    id: 3,
    name: 'Test User',
    email: 'testuser@test.com',
    password: 'testpassword'
  }
];

const app = express();
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  defaultMeta: { service: 'calculator-microservice' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple(),
      ),
    }),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secret,
};

const strategy = new JwtStrategy(jwtOptions, (jwtPayload, next) => {
  const user = users.find((user) => user.id === jwtPayload.id);
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((user) => user.email === email && user.password === password);
  if (user) {
    const payload = { id: user.id };
    const token = jwt.sign(payload, config.secret);
    res.json({ success: true, token: token });
  } else {
    res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
});

app.get('/api/protected', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ success: true, message: 'You have access to protected content!' });
}, (err, req, res, next) => {
  res.status(401).json({ success: false, message: 'Invalid or expired token' });
});

app.use((req, res, next) => {
  logger.info({
    message: 'Request',
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    headers: req.headers,
  });

  const oldSend = res.send;
  res.send = function (data) {
    logger.info({
      message: 'Response',
      status: res.statusCode,
      body: data,
    });
    oldSend.apply(res, arguments);
  };
  next();
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Calculator</title>
      </head>
      <body>
        <h1>Hello JS!!</h1>
        <p>This is a calculator, served via Express.</p>
      </body>
    </html>
  `);
});

function checkInputs(req, res, next) {
  const num1 = parseFloat(req.body.num1);
  const num2 = parseFloat(req.body.num2);
  if (isNaN(num1) || isNaN(num2)) {
    logger.error('Invalid input parameters');
    return res.status(400).json({ error: 'Invalid input parameters' });
  }
  // Pass control to the next middleware function
  next();
}

app.post('/add', passport.authenticate('jwt', { session: false }), checkInputs, (req, res) => {
  const num1 = parseFloat(req.body.num1);
  const num2 = parseFloat(req.body.num2);
  const result = num1 + num2;
  logger.info(`Performed addition of ${num1} and ${num2} to get ${result}`);
  res.setHeader('Content-Type', 'application/json');
  return res.json({ result: result });
});

app.post('/subtract', passport.authenticate('jwt', { session: false }), checkInputs, (req, res) => {
  const num1 = parseFloat(req.body.num1);
  const num2 = parseFloat(req.body.num2);
  const result = num1 - num2;
  logger.info(`Performed subtraction of ${num2} from ${num1} to get ${result}`);
  res.setHeader('Content-Type', 'application/json');
  return res.json({ result: result });
});

app.post('/multiply', passport.authenticate('jwt', { session: false }), checkInputs, (req, res) => {
  const num1 = parseFloat(req.body.num1);
  const num2 = parseFloat(req.body.num2);
  const result = num1 * num2;
  logger.info(`Performed multiplication of ${num1} and ${num2} to get ${result}`);
  res.setHeader('Content-Type', 'application/json');
  return res.json({ result: result });
});

app.post('/divide', passport.authenticate('jwt', { session: false }), checkInputs, (req, res) => {
  const num1 = parseFloat(req.body.num1);
  const num2 = parseFloat(req.body.num2);
  if (num2 === 0) {
    logger.error('Attempted to divide by zero');
    return res.status(400).json({ error: 'Cannot divide by zero' });
  }
  const result = num1 / num2;
  logger.info(`Performed division of ${num1} by ${num2} to get ${result}`);
  res.setHeader('Content-Type', 'application/json');
  return res.json({ result: result });
});

app.listen(config.port, () => {
  logger.info(`Calculator microservice listening at http://localhost:${config.port}`);
});

module.exports = app;