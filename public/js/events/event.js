'use strict';
var _ = require('./../lib/lodash.js');
_.negate = require('./../lib/negate.js');

var Event = function() {};
Event.prototype = {
  get isValid() {
    if (typeof this._isValid !== 'undefined') {
      return this._isValid;
    }

    return _.every(_.keys(this), _.negate(_.isNull));
  },
  set isValid(value) {
    this._isValid = value;
  },
  get json() {
    var removeMethods = function(o) {
      var getProperty = function(prop) {return this[prop];};
      var oWithoutFunctions = _.reduceRight(
        _.keys(o).filter(
         _.compose(_.negate(_.isFunction), getProperty.bind(o))),
        function(oWithoutFunctions, prop) {
          oWithoutFunctions[prop] = o[prop];
          return oWithoutFunctions;
        }, {});
        return _.omit(oWithoutFunctions, '_isValid');
    };

    var removeMethodsFromChildren = function(result) {
      result = removeMethods(result);
      var prop;
      for (prop in result) {
        if (_.isObject(result[prop]) && !(result[prop] instanceof Array)) {
          result[prop] = removeMethodsFromChildren(result[prop]);
        }
      }
      return result;
    };

    return removeMethodsFromChildren(_.clone(this, true));
  },
  set json(value) {
    return value;
  }
};

module.exports = Event;
