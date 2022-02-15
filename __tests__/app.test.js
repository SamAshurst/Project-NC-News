const request = require("supertest");
const app = require("../app.js");
const seed = require("../db/seeds/seed.js");
const data = require("../db/data/test-data/index.js");
const db = require("../db/connection");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("APP", () => {
  describe("Get", () => {
    describe("/api/topics", () => {
      test("Responds with Status 200", () => {
        return request(app).get("/api/topics").expect(200);
      });
      test("The body that is returned will be an array of objects", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(Array.isArray(topics)).toBe(true);
            expect(typeof topics[0]).toBe("object");
          });
      });
      test("It will return the correct number of topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            expect(topics).toHaveLength(3);
          });
      });
      test("The returned array will have objects which contain keys of 'slug' and 'description'", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body: { topics } }) => {
            topics.forEach((topic) => {
              expect(topic).toEqual(
                expect.objectContaining({
                  slug: expect.any(String),
                  description: expect.any(String),
                })
              );
            });
          });
      });
    });
    describe("/api/articles/:article_id", () => {
      test("Responds with Status 200 when given a valid article id number", () => {
        return request(app).get("/api/articles/1").expect(200);
      });
      test("Will respond with just one article", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toHaveLength(1);
          });
      });
      test("The return body will be an array with an object containing the correct keys", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(
            ({
              body: {
                article: [article],
              },
            }) => {
              expect(article).toEqual(
                expect.objectContaining({
                  article_id: expect.any(Number),
                  title: expect.any(String),
                  topic: expect.any(String),
                  author: expect.any(String),
                  body: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                })
              );
            }
          );
      });
      test("When given a specified article_id it will return the correct article", () => {
        return request(app)
          .get("/api/articles/6")
          .expect(200)
          .then(
            ({
              body: {
                article: [article],
              },
            }) => {
              expect(article).toEqual(
                expect.objectContaining({
                  article_id: 6,
                  title: "A",
                  topic: "mitch",
                  author: "icellusedkars",
                  body: "Delicious tin of cat food",
                  created_at: "2020-10-18T01:00:00.000Z",
                  votes: 0,
                })
              );
            }
          );
      });
    });
    describe("/api/users", () => {
      test("Responds with Status 200", () => {
        return request(app).get("/api/users").expect(200);
      });
      test("The response body that is returned will be an array of objects", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(Array.isArray(users)).toBe(true);
            expect(typeof users[0]).toBe("object");
          });
      });
      test("The response will return the correct amount of users", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toHaveLength(4);
          });
      });
      test("It will only contain the usernames of the users and no other information", () => {
        const expectedResponse = [
          { username: "butter_bridge" },
          { username: "icellusedkars" },
          { username: "rogersop" },
          { username: "lurker" },
        ];
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body: { users } }) => {
            expect(users).toEqual(expectedResponse);
          });
      });
    });
  });
});
describe("Error Handling", () => {
  describe("Invalid Endpoint", () => {
    test("Responds with status 404 when given an invalid endpoint", () => {
      return request(app)
        .get("/api/invalidEndpoint")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            "Oh no! The path you are looking for does not exist!"
          );
        });
    });
  });
  describe("Get", () => {
    describe("/api/articles/:article_id", () => {
      describe("Status: 400", () => {
        test("Responds with a msg when given an article_id number that does not exist in the database", () => {
          return request(app)
            .get("/api/articles/5000")
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toBe("Sorry that id does not exist");
            });
        });
        test("Responds with a msg stating invalid id when given a word instead of a number", () => {
          return request(app)
            .get("/api/articles/NotANumber")
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toBe("Invalid id");
            });
        });
      });
    });
  });
});
