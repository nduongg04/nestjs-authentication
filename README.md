# NestJS Authentication with JWT

This is a application that use NestJs, Jwt and Google Oauth2 for authentication

## Table of Contents

-   [Description](#description)
-   [Installation](#installation)
-   [Usage](#usage)
-   [License](#license)

## Description

This project is a starter template for implementing authentication in a NestJS application using JWT (JSON Web Tokens). It includes user registration, login, and token generation (access and refresh tokens).

## Installation

```bash
$ npm install
```

### Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

### Environment Variables

Create a .env file in the root directory and add the following environment variables:

```env
JWT_ACCESS_TOKEN_SECRET=your_access_token_secret
JWT_ACCESS_TOKEN_EXPIRES_IN=3600s
JWT_REFRESH_TOKEN_SECRET=your_refresh_token_secret
JWT_REFRESH_TOKEN_EXPIRES_IN=7d
```

## Usage

### User Registration

To register a new user, send a POST request to `http://localhost:4000//api/auth/register` with the user's details.

### User Login

To log in, send a POST request to `http://localhost:4000/api/auth/login` with the user's email and password. The response will include an access token and a refresh token.

### Token Refresh

To refresh the access token, send a POST request to `http://localhost:4000/api/auth/refresh` with the refresh token.

## License

This project is licensed under the MIT License.
