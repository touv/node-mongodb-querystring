'use strict';
var qs = require('qs')
  , traverse = require('traverse')
  ;

function MQS(input) {
  if (!(this instanceof MQS)) {
    return new MQS(input);
  }
  this.input = exports.parse(input);
}

MQS.prototype.$query = function (def)
{
  if (def === undefined) {
    def = {}
  }
  if (this.input['$query'] !== undefined && typeof this.input['$query'] === 'object') {
    return Object(this.input['$query']);
  }
  else {
    return Object(def);
  }
}


MQS.prototype.get = function (key, def, val) {
  if (def === undefined) {
    def = val
  }
  if (key === undefined) {
    return this.input;
  }
  if (this.input[key] !== undefined) {
    return this.input[key];
  }
  else {
    return def;
  }
}

MQS.prototype.$sort = function (def)
{
  return Object(this.get('$sort', def, {}));
}
MQS.prototype.$limit = function (def)
{
  return Number(this.get('$limit', def));
}
MQS.prototype.$offset = MQS.prototype.$skip = function (def)
{
  return Number(this.get('$skip', def));
}

function bury(prefix, value) {
  if (value instanceof Date) {
    return value.valueOf().toString().concat('^D');
  }
  else if (value instanceof Boolean) {
    return value ? '1^B' : '0^B';
  }
  else if (typeof value === 'number') {
    return value.toString().concat('^N');
  }
  return value;
}

function revive (x) {
  if (typeof x === 'string') {
    if (x.slice(-2) === '^N') {
      this.update(Number(x.slice(0, -2)));
    }
    else if (x.slice(-2) === '^D') {
      this.update(new Date(Number(x.slice(0, -2))));
    }
    else if (x.slice(-2) === '^B') {
      this.update(Boolean(Number(x.slice(0, -2))));
    }
  }
}

exports.stringify = function (query, options) {
  var opt = {
    filter: bury,
    encode: false
  }
  return qs.stringify(query, opt);
}

exports.parse = function (input) {
  if (typeof input === 'string') {
    input = qs.parse(input);
  }
  if (typeof input === 'object') {
    traverse(input).forEach(revive);
  }
  return input;
}

exports.create = exports.from = function (input) {
  return new MQS(input);
}
