# MongoDB query through URL

Pass MongoDB query through URL query string.

## Contributors

  * [Nicolas Thouvenin](https://github.com/touv)

# Installation

With [npm](http://npmjs.org) do:

    $ npm install mongodb-querystring


# Tests

Use [mocha](https://github.com/visionmedia/mocha) to run the tests.

    $ npm install mocha
    $ mocha test

# API Documentation

## stringify(input : Object, [separator : String]) : String

Converts `query` to a URL query string.

```javascript
	var mqs = require('mongodb-querystring');
	var qry = {
     "$query" : {
       "age" : {
         "$gte" : new Date(1976, 11, 14)
       },
       "$or": [
         { "cuisine": "Italian" },
         { "address.zipcode": "10075" }
       ]
     },
     "$limit" : 20,
     "$orderby" : {
       "age" : -1,
       "posts": 1
     }
   };
   console.log(mqs.stringify(qry);

```
Output:

	'$query[age][$gte]=219366000000^D&$query[$or][0][cuisine]=Italian&$query[$or][1][address.zipcode]=10075&$limit=20^N&$orderby[age]=-1^N&$orderby[posts]=1^N'

## parse(input : String) : Object
## parse(input : Object) : Object

Parse `input` to convert to an query.
```javascript
	var mqs = require('mongodb-querystring');
	var qry = '$query[type][$in][0]=food&$query[type][$in][1]=snacks';
	console.dir(mqs.parse(qry));

```
Output:

	{ '$query': { type: { '$in': [ 'food', 'snacks' ] } } }

## create(input : String) : Object
## create(input : Object) : Object

Parse `input` to convert to an Object query.
```javascript
	var mqs = require('mongodb-querystring');
	var qry = mqs.create(req.query);
	console.log(qry.$query());
	console.log(qry.$limit(10));

```
# Also

* https://www.npmjs.com/package/query-to-mongo
* https://www.npmjs.com/package/mongo-querystring


