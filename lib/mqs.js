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


MQS.prototype.get = function (key, def, val) {
  var self = this;
  if (def === undefined) {
    def = val
  }
  if (key === undefined) {
    return self.input;
  }
  if (Array.isArray(key)) {
    return key.reduce(function(prev, cur) {
      if (self.input[cur] !== undefined) {
        return self.input[cur];
      }
      else {
        return prev;
      }
    } , def)
  }
  if (self.input[key] !== undefined) {
    return self.input[key];
  }
  else {
    return def;
  }
}

MQS.prototype.$query = MQS.prototype.$find = function (def)
{
  return Object(this.get(['$find', '$query'], def, {}));
}
MQS.prototype.$update = function (def)
{
  return Object(this.get('$update', def, {}));
}
MQS.prototype.$upsert = function (def)
{
  return Object(this.get('$upsert', def, {}));
}
MQS.prototype.$orderby = MQS.prototype.$sort = function (def)
{
  return Object(this.get(['$sort', '$orderby'], def, {}));
}
MQS.prototype.$limit = function (def)
{
  return Number(this.get('$limit', def));
}
MQS.prototype.$offset = MQS.prototype.$skip = function (def)
{
  return Number(this.get(['$skip', '$offset'], def));
}

function bury(prefix, value) {
  if (value instanceof Date) {
    return value.valueOf().toString().concat('^D');
  }
  else if (value instanceof RegExp) {
    return value.toString().concat('^R');
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
    else if (x.slice(-2) === '^R') {
      this.update(new RegExp(x.slice(0, -2)));
    }
  }
}

exports.stringify = function (query, options) {
  options = options || {};
  options.encode = options.encode ? options.encode : true;
  var opt = {
    filter: bury,
    encode: options.encode
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
