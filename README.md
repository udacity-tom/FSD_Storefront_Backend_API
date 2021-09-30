# FSD Storefront Backend API

Full Stack Developer Nanodegree, create a node based API to support a frontend store website.


## Introduction/API Functionality

An Express based RESTful API design was used to interface to a backend using CRUD to access a Postgres database for data storage and retrieval.
Using REST Endpoints with JWT tokens to provide stateless authenticated access to retreiving and storing data in persistent storage.

This API provides multiple endpoints to 
- Browse, review, create, store, update and delete Products 
- Review, create, delete, show details and add products to Orders using a shopping basket
- List, show individual, register (create), login & authenticate, update and delete Users

The project is written in Typescript, Node/Express for the application logic, dotenv for environmental variables, db-migrate for migrations, Jsonwebtoken for JWT and Jasmine for testing.

Middleware was written to verify JWT validity and check for unique usernames at account creation.

Using npm, scripts were written to create test databases and run Jasmine test specs.


## Installation, Environment Setup

Clone the repository and make sure node (min v 12.13.1) and npm are installed in your local dev environment.
Install the relevant packages with the [node package manager](https://docs.npmjs.com/).
After cloning, run the following script from a terminal in the cloned directory: 

 ```npm i```

This will install the necessary packages and dependencies based on the supplied ``package.json``.

NOTE: Depending on your system configuration it may be necessary to install db-migrate globally, i.e.
````
npm intstall -g db-migrate
````

## Setup PostgresSQL
For the entire project I have used [PostGresSQL](https://www.postgresql.org/). 
Download a copy and have it already installed on your system before you complete the next stage.

The following environment variables ``.env`` are required for Postgres and the subsequent project to function correctly.

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
```

Once these are set, start an instance of Postgres, ensure Postgres is started on port 5432.

### Setup the required databases

In order to use the API you must pre-configure the initial database.
To do so access the `psql` prompt as ``postgres`` on the installed Postgres database and enter the following commands at the prompt:

```
CREATE DATABASE storefront_dev;
CREATE USER storefont_admin WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE storefront_dev TO storefront_admin;
```

### Setting the environmental variables
In the root directory of the cloned repository create a file with the name ``.env`` .
Copy the following into the file:

```
    POSTGRES_HOST=127.0.0.1  //or whereever the Postgres database is located
    
    POSTGRES_DB=storefront_dev
    POSTGRES_USER_DEV=storefront_admin
    POSTGRES_PASSWORD_DEV=password
    
    POSTGRES_TEST_DB=storefront_test
    POSTGRES_USER_TEST=storefront_admin
    POSTGRES_PASSWORD_TEST=password
    
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=password
    
    ENV=dev

    BCRYPT_PASSWORD=go-and-take-five-times-orange
    SALT_ROUNDS=10
    TOKEN_SECRET=Carny-LON*gorange
```
The environmental variables can be adjusted dependent on your specific needs, but the given variables will allow automatic Jasmine testing.

## Running the Jasmine Tests

To run the jasmine tests use the following commands: 
```
npm run create-test-up
```
```
npm run test
```
When finished run the down migration for the test database with: 
```
npm run create-test-down
```
The tests will run with one failure if the ``run watch-test`` script is notaborted aforehand. 
```
- Uncaught exception: Error: listen EADDRINUSE: address already in use :::3002
```

## Interactively Running the API
To call the API interactively, with the provided test data, using something like [Postman](https://www.postman.com/), follow these instructions

Access a terminal in the repo directory and enter the following command:
```
npm run create-test-up
```
Then to bring up the watch mode: 
```
npm run watch-test
```
When finished run the down migration for the test database with: 
```
npm run create-test-down
```

## Running the Automatic Test

To run the fully automated tests access a terminal in the repo directory and key in the following command:
```
npm run create-test
```
upon execution, the script will
- run the build script (```npm run build```), 
- create a test database (```storefront_test```) within the postgres instance using the ```db-migrate up:setup``` command,
- add the database scheme (as outlined in the REQUIREMENTS.md) to the test database using ```db-migrate --env test up```,
- populate the test database scheme with data using ```db-migrate --env test up:test```,
- run the 46 Jasmine tests using ```ENV=test jasmine```, 
- reverse the up migration and remove the database scheme and database using down migrations.


If previous tests have been run, reset the database structure on the test database before running the automatic test:
```
npm run create-test-reset
```
### Accessing the API/Endpoint Review
Accessing the API is simple using [Postman](https://www.postman.com/).
But the API is also available via a browser. ````http://127.0.0.1:3002/````
will access the landing page where a list of the implemented API Endpoints is viewable.
All unauthenticated links are accessible from a regular browser e.g. ```http://127.0.0.1:3002/products```

### Resetting the migrations

Should the data migrations get out of sync (it happens!) run:
```
npm run create-test-reset
```
And this will run the ``db-migrate`` reset commands for all tables and schemas and will correct any postgres scheme problems.
It will be necessary to re-run the 'up' migrations again.





## Technologies Used

- Node (asynchronous endpoints for API access)
- Express (for creating endpoints, routing, and serving files)
- TypeScript throughout the API
- Javascript (async, express, middleware, etc in a modular design)
- Jasmine (for JS testing)
- Jason Web Token (JWT) for stateless interaction
- Basic Error handling
- Misc. middle ware, checking username, handling authentication



## About Udacity's Full Stack Javascript Developer Nanodegree

Students who graduate from the program will be able to:
• Build client-side experiences and applications using Angular, collecting data from users and from
backends, providing rich user interactions and organizing code and data.
• Build server-side executed code with TypeScript and integrate with 3rd party code such as
Angular’s Server Side Rendering.
• Leverage Express.js to architect and build APIs that power dynamic functionality and to generate
and supply data to web and mobile clients.
• Persist data to a database, query and retrieve data, and pass this data all the way through to
various client devices.

 [Udacity Full Stack Javascript Developer Nanodegree](https://www.udacity.com/course/full-stack-javascript-developer-nanodegree--nd0067)