/* global it, describe */
'use strict';
var assert = require('assert')
  , mqs = require('..');

describe('mqs', function() {
  it('test 0', function() {
    var test = { };
    assert.deepEqual(mqs.parse(mqs.stringify(test)), test);
  });
  it('test 1', function() {
    var test = {
      $query : {
        type: {
          $in: [ 'food', 'snacks' ]
        }
      }
    };
    assert.deepEqual(mqs.parse(mqs.stringify(test)), test);
  });
  it('test 2', function() {
    var test = {
      $query : {
        type: 'food',
        price: {
          $lt: 9.95
        }
      }
    };
    assert.deepEqual(mqs.parse(mqs.stringify(test)), test);
  });


})
