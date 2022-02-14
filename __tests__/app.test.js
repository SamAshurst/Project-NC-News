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
  });
  describe("Error Handling", () => {
    describe("Invalid Endpoint", () => {
      test("Responds with status:404 when given an invalid endpoint", () => {
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
  });
});
