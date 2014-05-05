'use strict';
var Q = require('q');
var db = require('./../lib/db.js');
var getSession = Q.nbind(db.mongoStore.get, db.mongoStore);

module.exports = {
  get: getSession,
  saveNew: db.mongoStore.set
};
