# ExpressJS REST API

<a href="https://expressjs.com/"><img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge" /></a> <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" /></a> <a href="https://jwt.io/"><img src="https://img.shields.io/badge/JWT-FB015B?style=for-the-badge" /></a>

REST API with ExpressJS and MongoDB, with JWT authentication.

## Setup

Setup environment variables: Create .env file in root of the project and set 3 enviroment variables

```
PORT = ""

DB_URL = ""

JWT_SECRET = ""
```

  > **PORT:** Port number for local host <br/>
  > **DB_URL:** MongoDB URL, You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) as database <br/>
  > **JWT_SECRET:** A random string that will be used for JWT encoding and authentication <br/>

## API endpoints

| **Endpoint** | **Purpose** | **Features** |
| :------------- | :---------- | :----------- |
| / | Homepage  | None |
| /api/user/register | Registration route that saves information of a new user on the database  | Duplicate user check, password hashing |
| /api/user/login | Login route that returns token on successful login  | User existance check, Password match check, JWT Creation |
| /api/private | Example private route that can't be accessed without a token  | "auth-token" header is required, which means user must be logged in to access this route |

## Production dependencies

| **Package** | **Version** | **Purpose** |
| :------------- | :---------- | :----------- |
| [express](https://expressjs.com/) | ^4.17.1 | Creating the REST API |
| [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)  | ^8.5.1 | Generating JWT and Authenticating it |
| [mongoose](https://www.npmjs.com/package/mongoose) | ^6.0.9 | Connecting to MongoDB |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs) | ^2.4.3 | Hashing the password  |
| [@hapi/joi](https://www.npmjs.com/package/joi) | ^17.1.1 | Schema validation check |
| [dotenv](https://www.npmjs.com/package/dotenv) | ^10.0.0 | Loads environment variables |
| [cors](https://www.npmjs.com/package/cors) | ^2.8.5| enable CORS |
