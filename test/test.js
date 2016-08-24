/**
 * Created by harekamsingh on 8/22/16.
 */
'use strict';
var supertest = require("supertest");
var should = require("should");
var faker = require('faker');
var async = require('async');
var config = require('../server/config.json');
var server = supertest.agent("http://" + config.host + ":" + config.port);
// UNIT test begin
var data = {};
data.author = {
  authorName: faker.name.findName(),
  age: faker.random.number(50),
  numberOfBooks: faker.random.number(50)
};
data.book = {
  "bookName": faker.name.lastName(),
  "price": faker.random.number(5000),
  "releaseDate": faker.date.past(10),
  "language": "english",
  "numOfPages": faker.random.number(1000),
  "binding": "paper back",
  "totalRating": faker.random.number(10),
  "totalCustomersRated": faker.random.number(10),
  "stock": faker.random.number(50)
};

describe("Author Book test", function () {
  it("should add author, book and eventually return book details ", function (done) {
    async.series([
      addAuthor, addBook, getBookDetails
    ], function (err) {
      if (err)done(err);
      else done();
    })
  });
});

function addAuthor(callback) {

  server
    .post('/api/authors')
    .type('form')
    .send(data.author)
    .expect(200)
    .end(function (err, res) {
      // HTTP status should be 200
      should.not.exists(err);
      should.exist(res);
      should.exist(res.status);
      res.status.should.equal(200);
      // Error key should be false.
      // res.body.error.should.equal(false);
      should.exist(res.body);
      should(res.body).be.an.Object();
      should.exist(res.body.id);
      should(res.body.id).be.a.String();
      data.author.id = res.body.id;
      data.book.authorsId = res.body.id;
      callback();

    });
}

function addBook(callback) {

  server
    .post("/api/books")
    .type('form')
    .send(data.book)
    .expect(200) // THis is HTTP response
    .end(function (err, res) {
      // HTTP status should be 200
      should.not.exists(err);
      should.exist(res);
      should.exist(res.status);
      res.status.should.equal(200);
      // Error key should be false.
      // res.body.error.should.equal(false);
      should.exist(res.body);
      should(res.body).be.an.Object();
      should.exist(res.body.id);
      should(res.body.id).be.a.String();
      data.book.id = res.body.id;
      callback();

    });
}

function getBookDetails(callback) {
  server
    .get("/api/books/" + data.book.id + "/bookDetail")
    .expect("Content-type", /json/)
    .expect(200) // THis is HTTP response
    .end(function (err, res) {
      // HTTP status should be 200
      should.not.exists(err);
      should.exist(res);
      should.exist(res.status);
      res.status.should.equal(200);
      // Error key should be false.
      // res.body.error.should.equal(false);
      should.exist(res.body.bookDetail);
      should(res.body.bookDetail).be.an.Object();
      should(res.body.bookDetail).not.be.an.Array();
      should(res.body.bookDetail.bookName).be.a.String();
      should(res.body.bookDetail.price).be.a.Number();
      should(res.body.bookDetail.language).be.a.String();
      should(res.body.bookDetail.numOfPages).be.a.Number();
      should(res.body.bookDetail.binding).be.a.String();
      should(res.body.bookDetail.totalRating).be.a.Number();
      should(res.body.bookDetail.totalCustomersRated).be.a.Number();
      should(res.body.bookDetail.stock).be.a.Number();

      should.exist(res.body.bookDetail.authorDetails);
      should(res.body.bookDetail.authorDetails).be.an.Object();
      should(res.body.bookDetail.authorDetails).not.be.an.Array();
      should(res.body.bookDetail.authorDetails.authorName).be.a.String();
      should(res.body.bookDetail.authorDetails.age).be.a.Number();
      should(res.body.bookDetail.authorDetails.numberOfBooks).be.a.Number();
      callback();

    });
}

