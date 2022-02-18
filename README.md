#  Northcoders News API - Back End Project

This is a RESTful API providing data from the Northcoders News database. The database used is PSQL and node-postgres is used to interact with it. The data available is Topics, Articles, Users and Comments which are all accessible via the provided endpoints while using the appropriate methods of GET, POST, PATCH and DELETE.

This API is hosted on Heroku, which can be found here: [https://project-northcoders-news.herokuapp.com/](https://project-northcoders-news.herokuapp.com/)

The github repository can be found here: [https://github.com/SamAshurst/Project-NC-News](https://github.com/SamAshurst/Project-NC-News)


### Prerequisites
---
Please ensure these are installed and are at least the minimum versions:
* Node: v17.0
* Node Package Manager: v8.0
* Postgres: v:14

### Getting Started
---
To set up your own repository of this project, there are a few simple steps to follow, outlined below

1. Decide which directory you will want this in and then copy the code block below and paste it into your terminal.
```
 git clone https://github.com/SamAshurst/Project-NC-News.git
```

2. Once cloned, using the terminal again enter the command below to change into the newly cloned directory.
```
cd Project-NC-News 
```

3. Now inside the cloned directory we can open with the IDE of your choice.

4. Using the terminal inside your IDE we will need to run the following command to install the packages required to run this project.
```
npm install
```

These dependencies should now be installed:
* dotenv
* express
* pg
* pg-format

These developer dependencies are required for testing:
* jest
* jest-extended
* jest-sorted
* supertest
* husky

5. We now need to create two .env files, in the root level of the directory, so the test and development databases can be linked, this need to be named like so:
`.env.test`
`.env.development`

6. Inside the  `.env.test` add `PGDATABASE=nc_news_test` and inside `.env.development` add  `PGDATABASE=nc_news`  

7. To now create the databases, run the following command in the terminal:
```
npm run setup-dbs
```

8. Once complete we can now seed the development database using this command in the terminal:
```
npm run seed
```

9. After that has been all set up and completed, it is now possible to run the server locally using:
```
npm start
```
You can use software such as Insomnia to make requests using
 `http://localhost:9090`

## Testing

All the tests for the app can be found in `__tests__/app.test.js`
To run the test suite, enter the command below into your terminal:
```
npm run test
```
If everything is set up correctly this should seed the test database first and then run the tests on said database. This happens before each test to ensure that all tests are independent and do not rely on other tests to pass first.

## Routes

This project currently has the following endpoints:
* GET /api - Which servers a JSON object of all available endpoints with queries available and an example response
* GET /api/topics - Which serves a list of all topics
* GET /api/users - Serves a list of all usernames
* GET /api/users/:username - Responds with the user with the requested username
* GET /api/articles - Serves a list of all articles
* GET /api/articles/:article_id - Responds with the article on the requested id
* GET /api/articles/:article_id/comments - Serves all the comments for the requested id
* POST /api/articles/:article_id/comments - Adds a new comment to the requested id and will return with the newly created comment
* PATCH /api/articles/:article_id - Able to increase or decrease votes on the requested article
* PATCH /api/comments/:comment_id - Able to increase or decrease votes on the requested comment
* DELETE /api/comments/:comment_id - Delete a comment on the requested id 

