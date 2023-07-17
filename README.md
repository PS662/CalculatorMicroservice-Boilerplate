# Simple Calculator Microservice
## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Usage](#usage)

## About <a name = "about"></a>

A simple calculator microservice built using Node.js and Express. It provides basic arithmetic operations such as addition, subtraction, multiplication and division through HTTP endpoints.

### Features

- Addition
- Subtraction
- Multiplication
- Division
- Authentication

## Getting Started <a name = "getting_started"></a>

### Prerequisites

To run this project, you need to have Node.js and npm installed on your machine.

### Installing

1. Clone this repository: `git clone https://github.com/ps662/CalculatorMicroservice-Boilerplate.git`
2. Navigate to the project directory: `cd CalculatorMicroservice-Boilerplate`
3. Install the dependencies: `npm install`

To start the server, run the following command:

```
npm start
```

This will start the server and listen on port 3000. You can access the application in your web browser by visiting [http://localhost:3000](http://localhost:3000).

Run tests with

```
npm test
```

## Usage <a name = "usage"></a>

Send a POST request with JSON payload to one of the following endpoints:

    /add for addition
    /subtract for subtraction
    /multiply for multiplication
    /divide for division
    /api/login for login
    /api/protected for auth

The JSON payload should contain two parameters, num1 and num2, also an auth token, representing the two numbers to perform the arithmetic operation on. The response will be a JSON object containing the result of the operation.

For example, to perform an addition operation on the numbers 2 and 3, send the following POST request:

```
POST /add HTTP/1.1
Content-Type: application/json

{
  "num1": 2,
  "num2": 3
}
```
```
HTTP/1.1 200 OK
Content-Type: application/json

{
  "result": 5
}
```


