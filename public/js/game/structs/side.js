'use strict';

var _ = require('lodash');

var side = {};
side.DARK = '__dark__';
side.LIGHT = '__light__';

/**
 * @param {string} side
 * @return {bool}
 */
side.isValid = function(side) {
  return _.values(side).indexOf(side) !== -1;
};
Object.defineProperty(side, 'isValid', {
  enumerable: false
});

/**
 * @return {string} random side
 */
side.random = function() {
  return _.sample(_.values(side));
};
Object.defineProperty(side, 'random', {
  enumerable: false
});

/**
 * @param {string} side_ side.DARK || side.LIGHT
 * @return {string} opposite side
 */
side.opposite = function(side_) {
  if (side_ === side.LIGHT) {
    return side.DARK;
  }
  return side.LIGHT;
};
Object.defineProperty(side, 'opposite', {
  enumerable: false
});

Object.freeze(side);
module.exports = side;
