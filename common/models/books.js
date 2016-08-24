"use strict";
const async = require('async');
const config = require('../../config');
const constants = config.constants;
const ERROR_MESSAGES = config.responseMessages.ERROR_MESSAGES;
module.exports = function (Books) {
  Books.remoteMethod('bookDetail', {
    accepts: {arg: 'bookId', type: 'string', required: true},
    http: {path: '/:bookId/bookDetail', verb: 'get', errorStatus: 400},
    returns: {arg: 'bookDetail', type: 'Object'}
  });
  Books.bookDetail = (bookId, callbackParent)=> {
    async.auto({
      bookDetails: (callback) => {
        let book = bookId;
        if (constants.REGEX.OBJECT_ID.test(bookId)) book = Books.getDataSource().ObjectID(bookId);
        const bookCollection = Books.getDataSource().connector.collection(Books.modelName);

        bookCollection.aggregate([
          {$match: {_id: book, isDeleted: false}},
          {
            $lookup: {
              from: 'authors',
              localField: 'authorsId',
              foreignField: '_id',
              as: 'authorDetails'
            }
          },
          {$unwind: {path: '$authorDetails', preserveNullAndEmptyArrays: true}},
          {
            $project: {
              _id: 0,
              bookName: 1,
              price: 1,
              releaseDate: 1,
              language: 1,
              numOfPages: 1,
              binding: 1,
              totalRating: 1,
              totalCustomersRated: 1,
              stock: 1,
              authorDetails: {
                id: '$authorDetails._id',
                authorName: 1,
                age: 1,
                numberOfBooks: 1
              }
            }
          }
        ], (err, res)=> {
          if (err)return callback(err);
          if (!res || (res && res.length === 0))return callback(ERROR_MESSAGES.NO_RECORDS_ID);
          return callback(null, res[0]);

        });
      }
    }, (err, res)=> {
      if (err)return callbackParent(err);
      return callbackParent(null, res.bookDetails);
    })
  }
};
