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
      test("The return body will be an object containing the correct keys", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
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
          });
      });
      test("When given a specified article_id it will return the correct article", () => {
        return request(app)
          .get("/api/articles/6")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: 6,
                title: "A",
                topic: "mitch",
                author: "icellusedkars",
                body: "Delicious tin of cat food",
                created_at: expect.any(String),
                votes: 0,
              })
            );
          });
      });
      test("Feature Request - the specfied article will now return with a key of comment_count", () => {
        return request(app)
          .get("/api/articles/1")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual(
              expect.objectContaining({
                comment_count: expect.any(Number),
              })
            );
          });
      });
      test("Feature Request - comment_count will have the correct value of 2 when making a request to get article 5", () => {
        return request(app)
          .get("/api/articles/5")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.comment_count).toBe(2);
          });
      });
      test("Feature Request - comment_count will have the correct value of 0 when making a request to get article 2", () => {
        return request(app)
          .get("/api/articles/2")
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.comment_count).toBe(0);
          });
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
    describe("/api/articles", () => {
      test("Responds with Status 200", () => {
        return request(app).get("/api/articles").expect(200);
      });
      test("The body that is returned will be an array of objects", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(Array.isArray(articles)).toBe(true);
            expect(typeof articles[0]).toBe("object");
          });
      });
      test("The response will return all of the articles, 12 in the test database", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(12);
          });
      });
      test("The array of article objects will contain the correct keys", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  article_id: expect.any(Number),
                  title: expect.any(String),
                  topic: expect.any(String),
                  author: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                })
              );
              expect(article).toEqual(
                expect.not.objectContaining({
                  body: expect.any(String),
                })
              );
            });
          });
      });
      test("The articles will be ordered by created_at in descending order", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSorted({
              key: "created_at",
              descending: true,
            });
          });
      });
      test("Feature Request - The articles returned will no include a key of comment_count", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach((article) => {
              expect(article).toEqual(
                expect.objectContaining({
                  comment_count: expect.any(Number),
                })
              );
            });
          });
      });
      test("Feature Request - The comment_count is the correct value for each article", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            const commentCountByArticleOrder = [
              2, 1, 0, 0, 2, 11, 2, 0, 0, 0, 0, 0,
            ];
            articles.forEach((article, index) => {
              expect(article.comment_count).toEqual(
                commentCountByArticleOrder[index]
              );
            });
          });
      });
      test("Feature Request Queries - User is able to sort_by a valid column with default descening order", () => {
        return request(app)
          .get("/api/articles/?sort_by=title")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSorted({
              key: "title",
              descending: true,
            });
          });
      });
      test("Feature Request Queries - Returns all articles sorted by votes", () => {
        return request(app)
          .get("/api/articles/?sort_by=votes")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSorted({
              key: "votes",
              descending: true,
            });
          });
      });
      test("Feature Request Queries - User is now able to sort by ascending for the valid column", () => {
        return request(app)
          .get("/api/articles/?sort_by=title&order=asc")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSorted({
              key: "title",
              ascending: true,
            });
          });
      });
      test("Feature Request Queries - User can filter topics with the topic query", () => {
        return request(app)
          .get("/api/articles/?topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            articles.forEach((article) => {
              expect(article.topic).toEqual("mitch");
            });
          });
      });
      test("Feature Request Queries - Returns an empty array when searching for a topic that exists but has no articles", () => {
        return request(app)
          .get("/api/articles/?topic=paper")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toHaveLength(0);
          });
      });
      test("Feature Request Queries - Able to chain sort_by, order and topic query", () => {
        return request(app)
          .get("/api/articles/?sort_by=author&order=asc&topic=mitch")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles).toBeSorted({
              key: "author",
              ascending: true,
            });
            articles.forEach((article) => {
              expect(article.topic).toBe("mitch");
            });
          });
      });
    });
    describe("/api/articles/:article_id/comments", () => {
      test("Responds with status 200", () => {
        return request(app).get("/api/articles/1/comments").expect(200);
      });
      test("The response will be an array of all the comments in objects", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(Array.isArray(comments)).toBe(true);
            expect(typeof comments[0]).toBe("object");
          });
      });
      test("It will return the correct amount of comments for the specified article, article 1 should return 11 comments", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(11);
          });
      });
      test("The return body will be an object containing the correct keys", () => {
        return request(app)
          .get("/api/articles/1/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            comments.forEach((comment) => {
              expect(comment).toEqual(
                expect.objectContaining({
                  comment_id: expect.any(Number),
                  body: expect.any(String),
                  author: expect.any(String),
                  created_at: expect.any(String),
                  votes: expect.any(Number),
                })
              );
            });
          });
      });
      test("Will return an empty array when the article_id exists but there are no comments on the article yet", () => {
        return request(app)
          .get("/api/articles/2/comments")
          .expect(200)
          .then(({ body: { comments } }) => {
            expect(comments).toHaveLength(0);
          });
      });
    });
    describe("/api", () => {
      test("Responds with Status 200 and a JSON file with all available endpoints", () => {
        return request(app)
          .get("/api")
          .expect(200)
          .then(({ body }) => {
            expect(typeof body).toBe("object");
          });
      });
    });
    describe("/users/:username", () => {
      test("Responds with Status 200 when given a valid username", () => {
        return request(app).get("/api/users/butter_bridge").expect(200);
      });
      test("The return body will be an object containing the correct keys for the username requested", () => {
        return request(app)
          .get("/api/users/butter_bridge")
          .expect(200)
          .then(({ body: { user } }) => {
            expect(user).toEqual({
              username: "butter_bridge",
              avatar_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
              name: "jonny",
            });
          });
      });
    });
  });
  describe("Patch", () => {
    describe("/api/articles/:article_id", () => {
      test("Responds with Status 200 and the article when all information required is correct", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: 1,
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
      });
      test("When given inc_votes: 1, it will return test article 1 with 101 votes", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article.votes).toBe(101);
          });
      });
      test("When given inc_votes: -100, it will return test article 1 with 0 votes", () => {
        return request(app)
          .patch("/api/articles/1")
          .send({ inc_votes: -100 })
          .expect(200)
          .then(({ body: { article } }) => {
            expect(article).toEqual(
              expect.objectContaining({
                votes: 0,
              })
            );
          });
      });
      test("When given multiple instances of votes it will correctly update each time, E.G. inc_votes:1 repeated twice on article 1 returns votes: 102", () => {
        const patch = () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: 1 })
            .then(({ body: { article } }) => {
              return article;
            });
        };
        return Promise.all([patch(), patch()]).then((promise) => {
          expect(promise[0].votes).toBe(101);
          expect(promise[1].votes).toBe(102);
        });
      });
      test("Will return a negative number with an article with 0 votes gets a patch with inc_votes: -1 (No constraint for negative values)", () => {
        return request(app)
          .patch("/api/articles/2")
          .send({ inc_votes: -1 })
          .then(({ body: { article } }) => {
            expect(article.votes).toBe(-1);
          });
      });
    });
    describe("/api/comments/:comment_id", () => {
      test("Responds with Status 200 and the article when all information required is correct", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: 1,
                article_id: expect.any(Number),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          });
      });
      test("When given inc_votes: 1, it will return test comment 1 with 17 votes", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: 1 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment.votes).toBe(17);
          });
      });
      test("When given inc_votes: -1, it will return test comment 1 with 15 votes", () => {
        return request(app)
          .patch("/api/comments/1")
          .send({ inc_votes: -1 })
          .expect(200)
          .then(({ body: { comment } }) => {
            expect(comment.votes).toBe(15);
          });
      });
      test("Will successfully patch votes twice in a row, mimicking real use case", () => {
        const patch = () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 1 })
            .then(({ body: { comment } }) => {
              return comment;
            });
        };
        return Promise.all([patch(), patch()]).then((promise) => {
          expect(promise[0].votes).toBe(17);
          expect(promise[1].votes).toBe(18);
        });
      });
      test("Will successfully patch votes twice in a row, increment and decrement, mimicking real use case", () => {
        const patchInc = () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: 1 })
            .then(({ body: { comment } }) => {
              return comment;
            });
        };
        const patchDec = () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: -7 })
            .then(({ body: { comment } }) => {
              return comment;
            });
        };
        return Promise.all([patchInc(), patchDec()]).then((promise) => {
          expect(promise[0].votes).toBe(17);
          expect(promise[1].votes).toBe(10);
        });
      });
      test("Will return a negative number with a comment with 0 votes gets a patch with inc_votes: -1", () => {
        return request(app)
          .patch("/api/comments/5")
          .send({ inc_votes: -1 })
          .then(({ body: { comment } }) => {
            expect(comment.votes).toBe(-1);
          });
      });
    });
  });
  describe("Post", () => {
    describe("/api/articles/:article_id/comments", () => {
      test("Reponds with Status 201", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ username: "butter_bridge", body: "Test comment" })
          .expect(201);
      });
      test("A successful post will return the newly created comment with the additional keys used to create the comment", () => {
        return request(app)
          .post("/api/articles/1/comments")
          .send({ username: "butter_bridge", body: "Test comment" })
          .expect(201)
          .then(({ body: { comment } }) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: 19,
                article_id: 1,
                author: "butter_bridge",
                body: "Test comment",
                created_at: expect.any(String),
                votes: 0,
              })
            );
          });
      });
      test("When posting multiple comments, the comment_id correctly increases (The database reseeds after each test, mimics real use case", () => {
        const postComment = (comment) => {
          const newComment = { username: "butter_bridge" };
          newComment["body"] = comment;
          return request(app)
            .post("/api/articles/1/comments")
            .send(newComment)
            .then(({ body: { comment } }) => {
              return comment;
            });
        };
        return Promise.all([postComment("first"), postComment("second")]).then(
          ([first, second]) => {
            expect(first).toEqual(
              expect.objectContaining({
                comment_id: 19,
                body: "first",
                article_id: expect.any(Number),
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
            expect(second).toEqual(
              expect.objectContaining({
                comment_id: 20,
                body: "second",
                article_id: expect.any(Number),
                author: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
              })
            );
          }
        );
      });
    });
  });
  describe("Delete", () => {
    describe("/api/comments/comment_id", () => {
      test("Responds with Status 204 when comment_id is valid", () => {
        return request(app).delete("/api/comments/1").expect(204);
      });
      test("After deleting a comment the length of the comments table will now be 17 instead of 18 with no comment_id of 1 ", () => {
        return request(app).delete("/api/comments/1").expect(204);
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
        test("Status: 400 - Responds with a msg stating invalid id when given a word instead of a number", () => {
          return request(app)
            .get("/api/articles/NotANumber")
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toBe("Invalid id");
            });
        });
      });
      describe("Status: 404", () => {
        test("Status: 404 - Responds with a msg when given an article_id number that does not exist in the database", () => {
          return request(app)
            .get("/api/articles/5000")
            .expect(404)
            .then((response) => {
              expect(response.body.msg).toBe("Sorry that id does not exist");
            });
        });
      });
    });
    describe("/api/articles/:article_id/comments", () => {
      describe("Status: 400", () => {
        test("Status: 400 - Responds with a msg stating invalid id when given a word instead of a number", () => {
          return request(app)
            .get("/api/articles/NotANumber/comments")
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toBe("Invalid id");
            });
        });
      });
      describe("Status: 404", () => {
        test("Status: 404 - Responds with a msg when given an article_id number that does not exist in the database", () => {
          return request(app)
            .get("/api/articles/100/comments")
            .expect(404)
            .then((response) => {
              expect(response.body.msg).toBe("Sorry that id does not exist");
            });
        });
      });
    });
    describe("/api/articles/ - queries", () => {
      describe("Status: 400", () => {
        test("Status: 400 - Feature Request Queries - Responds with a msg when trying to sort_by a column that doesn't exist", () => {
          return request(app)
            .get("/api/articles/?sort_by=NotAColumn")
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toBe("Invalid sort query");
            });
        });
        test("Status: 400 - Feature Request Queries - Responds with a msg when trying to order by something other than asc or desc", () => {
          return request(app)
            .get("/api/articles/?order=RandomOrder")
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toBe("Invalid order query");
            });
        });
        test("Status: 400 - Feature Request Queries - Responds with a msg when given an invalid query, E.G. misspelt topic", () => {
          return request(app)
            .get("/api/articles/?topi=mitch")
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toBe("Bad Request");
            });
        });
        test("Status: 400 - Feature Request Queries - Responds with a msg when given an a chain of queries and one is invalid", () => {
          return request(app)
            .get("/api/articles/?sortby=author&order=asc&topic=mitch")
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toBe("Bad Request");
            });
        });
      });
      describe("Status: 404", () => {
        test("Status: 404 - Feature Request Queries - Responds with a msg when trying to filter by a topic that does not exist", () => {
          return request(app)
            .get("/api/articles/?topic=NotATopic")
            .expect(404)
            .then((response) => {
              expect(response.body.msg).toBe("Sorry that topic does not exist");
            });
        });
      });
    });
    describe("/api/users/:username", () => {
      describe("Status:400", () => {
        test("Status: 400 - Responds with a msg stating invalid username when giving a numner instead of a word/name", () => {
          return request(app)
            .get("/api/users/1")
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toBe("Invalid username");
            });
        });
      });
      describe("Status:404", () => {
        test("Status: 404 - Responds with a msg when the requested username does not exist", () => {
          return request(app)
            .get("/api/users/NotAUser")
            .expect(404)
            .then((response) => {
              expect(response.body.msg).toBe("User does not exist");
            });
        });
      });
    });
  });
  describe("Patch", () => {
    describe("/api/articles/:article_id", () => {
      describe("Status: 400", () => {
        test("Status: 400 - Responds with a msg when article id exists but there is no inc_votes on the request body", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({})
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toBe("Bad Request");
            });
        });
        test("Status: 400 - Responds with a msg when article id exists but inc_votes is a word and not the required number", () => {
          return request(app)
            .patch("/api/articles/1")
            .send({ inc_votes: "cat" })
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toBe("Bad Request");
            });
        });
      });
      describe("Status: 404", () => {
        test("Status: 404 - Returns a msg when trying to patch and article with an id that does not exist", () => {
          return request(app)
            .patch("/api/articles/500")
            .send({ inc_votes: 1 })
            .expect(404)
            .then((response) => {
              expect(response.body.msg).toBe("Sorry that id does not exist");
            });
        });
      });
    });
    describe("/api/comments/:comment_id", () => {
      describe("Status: 400", () => {
        test("Status: 400 - Responds with a msg when article id exists but there is no inc_votes on the request body", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({})
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toBe("Bad Request");
            });
        });
        test("Status: 400 - Responds with a msg when article id exists but inc_votes is not a number", () => {
          return request(app)
            .patch("/api/comments/1")
            .send({ inc_votes: "upvote" })
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toBe("Bad Request");
            });
        });
      });
      describe("Status: 404", () => {
        test("Status: 404 - Returns a msg when trying to patch and comment with an id that does not exist", () => {
          return request(app)
            .patch("/api/comments/404")
            .send({ inc_votes: 1 })
            .expect(404)
            .then((response) => {
              expect(response.body.msg).toBe("Sorry that id does not exist");
            });
        });
      });
    });
  });
  describe("Post", () => {
    describe("/api/articles/:article_id/comments", () => {
      describe("Status: 400", () => {
        test("Status: 400 - Responds with bad request when there is no username provided", () => {
          return request(app)
            .post("/api/articles/2/comments")
            .send({ body: "No username" })
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toBe("Bad Request");
            });
        });
        test("Status: 400 - Responds with bad request when no comment body is provided", () => {
          return request(app)
            .post("/api/articles/2/comments")
            .send({ username: "butter_bridge" })
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toBe("Bad Request");
            });
        });
        test("Status: 400 - Responds with bad request when the comment body is not a string", () => {
          return request(app)
            .post("/api/articles/2/comments")
            .send({ username: "butter_bridge", body: 123 })
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toBe("Bad Request");
            });
        });
      });
      describe("Status: 401", () => {
        test("Status: 401 - Responds with unauthorised when the post request meets the criteria however the username does not exist in our database", () => {
          return request(app)
            .post("/api/articles/2/comments")
            .send({ username: "unknown", body: "mystery" })
            .expect(401)
            .then((response) => {
              expect(response.body.msg).toBe("Unauthorised user");
            });
        });
      });
    });
  });
  describe("Delete", () => {
    describe("/api/comments/:comment_id", () => {
      describe("Status: 400", () => {
        test("Status: 400 - Responds with a msg stating invalid id when given a word instead of a number", () => {
          return request(app)
            .delete("/api/comments/NotANumber")
            .expect(400)
            .then((response) => {
              expect(response.body.msg).toBe("Invalid id");
            });
        });
      });
      describe("Status: 404", () => {
        test("Status: 404 - Responds with a msg when trying to delete a comment_id that does not exist", () => {
          return request(app)
            .delete("/api/comments/80")
            .expect(404)
            .then((response) => {
              expect(response.body.msg).toBe("Sorry that id does not exist");
            });
        });
      });
    });
  });
});
