[![Reviewed by Hound](https://img.shields.io/badge/ESLint%20Reviewed%20by%20-HoundCI-d16ef5)](https://houndci.com)
[![Build Status](https://travis-ci.org/daylay92/stacktrace-backend.svg?branch=develop)](https://travis-ci.org/daylay92/stacktrace-backend)
[![Coverage Status](https://coveralls.io/repos/github/daylay92/stacktrace-backend/badge.svg?branch=develop)](https://coveralls.io/github/daylay92/stacktrace-backend?branch=develop)

---

# stacktrace-backend

A simple REST API, that enables registered users to ask and get answers to questions, providing access to features like up-voting and down-voting among other things.

## Required Features

- Users can sign up
- User can sign in
- User can ask Question
- User can view Questions
- User can Upvote or Downvote questions
- User can answer a question
- User can search for questions, answers and other users

## Getting Started

To get a copy of this project up and running on your local machine for testing and development, you would need to have a minimum of the underlisted prerequisities installed on your local machine. To get a head start, I recommend visiting the [API DOCS](https://stacktrace01.herokuapp.com/api/v1/docs/).

### Prerequisites

You must have

1. [Node.js](https://nodejs.org/) (_v8.12.0 or higher_) and npm (_6.4.1 or higher_) installed on your local machine. Run `node -v` and `npm -v` in your terminal to confirm that you have them installed

2. GIT bash

### Installing

To get started, clone this repository on your local machine using the following steps:

Open your terminal and navigate to the folder you want the project to be and enter the the following commands:

```
$ git clone -b develop https://github.com/daylay92/stacktrace-backend.git
$ cd stacktrace-backend
$ npm install
```

Create a `.env` file and add the environment variables described in the .env.sample file. Below are the relevant environment variables worth adding:

- `SIGN_SECRET` - JWT secret for signing access token.
- `MONGODB_URI` - Connection string for monogodb database (test environment).
- `MONGODB_DEV_URI` - Connection string for monogodb database (test environment).

## Starting the dev server

```bash
npm run start:dev
```

## Running the tests locally

```bash
npm test
```

## Test the endpoints

The application can be tested locally through localhost on port 3000 or through the live [url](https://stacktrace01.herokuapp.com/) using postman or insomnia


### API Endpoints


Method        | Endpoint      | Enable a user to: |
------------- | ------------- | ---------------
POST  | api/v1/auth/signup  | Create a user account  |
POST  | api/v1/auth/signin  | Login a user |
POST  | api/v1/question | Ask a question |
GET  | api/v1/question/<:id>  | Get a specific question by its id |
GET  | api/v1/question | Get a collection of questions |
PATCH  | api/v1/question/upvote/<:id>  | Upvote a question |
PATCH  | api/v1/question/downvote/<:id> | Downvote a question |
POST  | api/v1/question/<:id>/answer | Answer a question |



## Technologies

- Node JS
- Express
- MongoDB
- Mocha & Chai
- ESLint
- Babel
- Hound CI
- Travis CI
- Coveralls

## API

The API is currently in version 1 (v1) and it is hosted on heroku at [Base URL](https://stacktrace01.herokuapp.com/api/v1)

## API Documentation

You can find the documentation here [API DOCS](https://stacktrace01.herokuapp.com/api/v1/docs/)
For best results, I recommend testing via the API DOCS

## Author

- **Ayodele Akinbohun**
