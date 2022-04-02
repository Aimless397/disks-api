<div id="top"></div>

# DISKS API

## About The Project

Disks API is a REST & GraphQL API using TypeScript, NestJS, Prisma, PostgreSQL, Apollo Server and GraphQL.
This API allows you to create, update, like, disable, deleted, uploadImage disks, also you can create orders and buy disks.

<p align="right">(<a href="#top">back to top</a>)</p>

The main entities used in the API Postman Documentation will be:

* Auth / Users
* Disks
* Orders

##

### Auth / Users
Manage user authentication endpoints:

* Login
* Signup
* Profile
* Logout
* PasswordRecovery

### Disks
Manage disk endpoints:

* GetAllDisks
* FindOneDisk
* CreateDisk
* UpdateDisk
* DeleteDisk
* DisableDisk
* GenerateSignedUrl
* UploadImageFromSignedUrl
* LikeDisk

### Orders
Manage order endpoints:

* GetAllOrders
* FindOneOrder
* AddToCart
* Payment
* GetMyOrder

##

## Built With

This project was built using these main technologies.

* [NestJS](https://nestjs.com//)
* [Jest.js](https://jestjs.io/)
* [TypeScript](https://www.typescriptlang.org/)
* [PostgreSQL](https://www.postgresql.org/)
* [Prisma](https://www.prisma.io/)
* [GraphQL](https://graphql.org/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.
### Prerequisites

* npm

  ```sh
  npm install npm@latest -g
  
  ```
### Installation
1. Get a free API Key at [https://signup.sendgrid.com](https://signup.sendgrid.com)
2. Clone the repo
   ```sh
   
   git clone https://github.com/Aimless397/disks-api.git
   ```
3. Install NPM packages
   ```sh
   
   npm install
   
   ```
4. Enter your Environment Variables in `.env`

   ```js
   PORT
   DATABASE_URL
   JWT_EXPIRATION_TIME
   JWT_SECRET_KEY

   SENDGRID_API_KEY
   AWS_REGION
   AWS_ACCESS_KEY_ID
   AWS_SECRET_ACCESS_KEY
   AWS_PUBLIC_BUCKET_NAME
   AWS_EXPIRE_TIME=18000
   
   SENDGRID_API_KEY
   SENDGRID_SENDER_EMAIL
   
   ```
5. Create a PostgreSQL database and setup connection
   ```sh
   
   DATABASE_URL = postgresql://username:password@localhost:port/DB_NAME?schema-public
   PORT = default(5432)
   
   ```
6. Install PrismaCLI and execute Prisma Migration script to execute the migrations, and also run Prisma Generate command.
   ```
   npm install @prisma/cli --save-dev
   npm run prisma:migrate
   npm run prisma:generate
   ```
7. To run the server, use the following command:
   ```
   npm run start:dev
   ```
8. To run tests, use the following command:
  ```
  npm run test:watch
  ```
  Run tests collecting coverage:
  ```
  npm run test:cov
  ```
<p align="right">(<a href="#top">back to top</a>)</p>
 
<p align="center">
 <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

## Disks API on Heroku

https://disks-api.herokuapp.com/

## Swagger Documentation

https://disks-api.herokuapp.com/api

## PlayGround Documentation

https://disks-api.herokuapp.com/graphql

## Postman Documentation

https://documenter.getpostman.com/view/13158230/UVsHV8PU
