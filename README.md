# Buckets

Buckets is a simple library for creating and using buckets.  You simply give your buckets keys and then assign them
callbacks which act as testers.  Each time you add a value, we loop through all your testers, passing in the value, and
add that value to any bucket that the value passes the test for.

# TOC
   - [Buckets](#buckets)
     - [This is the bucket_creator function](#buckets-this-is-the-bucket_creator-function)
     - [#addBucket](#buckets-addbucket)
     - [#addBuckets](#buckets-addbuckets)
     - [#add](#buckets-add)
     - [#addList](#buckets-addlist)
     - [#emptyBuckets](#buckets-emptybuckets)
     - [#deleteBucket](#buckets-deletebucket)
     - [#getBucket](#buckets-getbucket)
   - [Bucket Stores](#bucket-stores)
     - [TestStore is our sample store for testing](#bucket-stores-teststore-is-our-sample-store-for-testing)
     - [#add](#bucket-stores-add)
     - [#deleteBucket](#bucket-stores-deletebucket)
     - [#empty](#bucket-stores-empty)
<a name=""></a>
 
<a name="buckets"></a>
# Buckets
<a name="buckets-this-is-the-bucket_creator-function"></a>
## This is the bucket_creator function
It returns a creator, making it easy to create tests.

```js
bucket_creator = function(min, max){
  return function(number){
    return min <= number && number <= max;
  };
};
```

<a name="buckets-addbucket"></a>
## #addBucket
Will allow you to add a bucket to it..

```js
var buckets = new Buckets();
buckets.addBucket('test bucket', bucket_creator(0,10));
assert.ok(buckets.buckets['test bucket']);
```

Will allow you to add more than one bucket.

```js
var buckets = new Buckets();
buckets.addBucket('bucket one', bucket_creator(0,10));
assert.ok(buckets.buckets['bucket one']);
assert.ok(!buckets.buckets['bucket two']);
buckets.addBucket('bucket two', bucket_creator(11,20));
assert.ok(buckets.buckets['bucket two']);
```

Will override an existing bucket.

```js
var buckets = new Buckets();
buckets.addBucket('bucket one', bucket_creator(0,10));
assert.ok(buckets.buckets['bucket one']);
buckets.addBucket('bucket one', bucket_creator(10,20));
assert.ok(buckets.buckets['bucket one']);
// This should not get added
buckets.add(5);
assert.equal(0, buckets.buckets['bucket one'].length);
// This will get added
buckets.add(15);
assert.equal(1, buckets.buckets['bucket one'].length);
```

<a name="buckets-addbuckets"></a>
## #addBuckets
Will allow you to add a list of buckets.

```js
var buckets = new Buckets();
buckets.addBuckets([
  {name: 'bucket one', test: bucket_creator(0,10)},
  {name: 'bucket two', test: bucket_creator(11,20)},
  {name: 'bucket three', test: bucket_creator(21,30)}
]);
assert.ok(buckets.buckets['bucket one']);
assert.ok(buckets.buckets['bucket two']);
assert.ok(buckets.buckets['bucket three']);
```

<a name="buckets-add"></a>
## #add
Will allow you to add data to buckets based on the test provided with the bucket.

```js
buckets.add(5);
buckets.add(15);
buckets.add(16);
buckets.add(17);
assert.equal(1, buckets.buckets['bucket one'].length);
assert.equal(3, buckets.buckets['bucket two'].length);
assert.equal(0, buckets.buckets['bucket three'].length);
```

Will add the same value multiple times.

```js
buckets.add(5);
buckets.add(5);
buckets.add(15);
buckets.add(15);
buckets.add(27);
buckets.add(27);
buckets.add(27);
assert.equal(2, buckets.buckets['bucket one'].length);
assert.equal(2, buckets.buckets['bucket two'].length);
assert.equal(3, buckets.buckets['bucket three'].length);
```

Will stop early by default given multiple available buckets.

```js
buckets.addBucket('bucket one and a half', bucket_creator(5,15));
// This should only appear in bucket one
buckets.add(7);
assert.equal(1, buckets.buckets['bucket one'].length);
assert.equal(0, buckets.buckets['bucket one and a half'].length);
```

Will place in multiple buckets if the option stop_on_match is false.

```js
var buckets = new Buckets({stop_on_match:false});
buckets.addBuckets([
  {name: 'bucket one', test: bucket_creator(0,10)},
  {name: 'bucket one and a half', test: bucket_creator(5, 15)},
  {name: 'bucket two', test: bucket_creator(11,20)},
  {name: 'bucket three', test: bucket_creator(21,30)}
]);
// This should appear in both buckets
buckets.add(7);
assert.equal(1, buckets.buckets['bucket one'].length);
assert.equal(1, buckets.buckets['bucket one and a half'].length);
```

Will return the buckets that the data was added to.

```js
var buckets = new Buckets({stop_on_match: false});
buckets.addBuckets([
  {name: 'bucket one', test: bucket_creator(0, 10)},
  {name: 'bucket two', test: bucket_creator(11, 20)},
  {name: 'bucket three', test: bucket_creator(21, 30)}
]);
assert.equal('bucket one', buckets.add(5).pop());
buckets.addBucket('bucket one and a half', bucket_creator(5, 15));
assert.equal(2, buckets.add(5).length);
// Buckets are returned in the order they are checked, which is the order they are added
assert.equal('bucket one and a half', buckets.add(5)[1]);
```

<a name="buckets-addlist"></a>
## #addList
Will add the same value multiple times.

```js
buckets.addList([5, 5, 15, 15, 27, 27, 27]);
assert.equal(2, buckets.buckets['bucket one'].length);
assert.equal(2, buckets.buckets['bucket two'].length);
assert.equal(3, buckets.buckets['bucket three'].length);
```

<a name="buckets-emptybuckets"></a>
## #emptyBuckets
Will empty all buckets of any data.

```js
buckets.add(5);
buckets.add(15);
buckets.add(16);
buckets.add(17);
assert.equal(1, buckets.buckets['bucket one'].length);
assert.equal(3, buckets.buckets['bucket two'].length);
assert.equal(0, buckets.buckets['bucket three'].length);
buckets.empty();
assert.equal(0, buckets.buckets['bucket one'].length);
assert.equal(0, buckets.buckets['bucket two'].length);
assert.equal(0, buckets.buckets['bucket three'].length);
```

<a name="buckets-deletebucket"></a>
## #deleteBucket
Will remove a bucket.

```js
buckets.deleteBucket('bucket two');
buckets.add(5);
buckets.add(15);
assert.equal(1, buckets.buckets['bucket one'].length);
assert.ok(!buckets.buckets['bucket two']);
```

<a name="buckets-getbucket"></a>
## #getBucket
Will return a bucket's contents..

```js
var bucketOne = buckets.getBucket('bucket one')
assert.equal(4, bucketOne.length);
assert.equal(0, bucketOne.indexOf(5));
```

Will return an empty array if the bucket doesn't exist.

```js
assert.equal(0, buckets.getBucket('I don\'t exist').length);
```

<a name="bucket-stores"></a>
# Bucket Stores
<a name="bucket-stores-teststore-is-our-sample-store-for-testing"></a>
## TestStore is our sample store for testing
Implements the TestStore interface the same way you would for your application and data store..

```js
TestStore = function(){
  var cb = function(called, value){};
  this.add = function(bucketName, val) {
    cb('add', [bucketName, val]);
  };
  this.deleteBucket = function(bucketName) {
    cb('deleteBucket', [bucketName]);
  };
  this.empty = function(bucketList) {
    cb('empty', [bucketList]);
  };
  this.sync = function(bucketsArray) {
    cb('sync', [bucketsArray]);
  };
  this.cb = function(callback){
    cb = callback;
  };
}
```

TestStore is passed into the bucket as the option store when the buckets are created..

```js
beforeEachCallback = function() {
  store = new TestStore();
  buckets = new Buckets({store: store});
  buckets.addBuckets([
    {name: 'bucket one', test: bucket_creator(0, 10)},
    {name: 'bucket two', test: bucket_creator(11, 20)},
    {name: 'bucket three', test: bucket_creator(21, 30)}
  ]);
  assert.ok(true);
};
```

<a name="bucket-stores-add"></a>
## #add
Will be called when new data is added to the store.

```js
// The store method add(bucketName, value) will be called
store.cb(function(bucketName, val){
  assert.equal('add', bucketName);
  assert.equal('bucket one', val[0]);
  assert.equal(5, val[1]);
});
buckets.add(5)
```

<a name="bucket-stores-deletebucket"></a>
## #deleteBucket
Will be called when a bucked has been deleted.

```js
store.cb(function(methodCalled, v){
  assert.equal('deleteBucket', methodCalled);
  assert.equal('bucket one', v[0]);
});
buckets.deleteBucket('bucket one');
```

<a name="bucket-stores-empty"></a>
## #empty
Will be called when we want to empty all the buckets.

```js
store.cb(function(method, v){
  assert.equal('empty', method);
  assert.equal('bucket one', v[0][0]);
  assert.equal('bucket two', v[0][1]);
  assert.equal('bucket three', v[0][2]);
});
buckets.empty();
```

# License

The MIT License (MIT)

Copyright (c) 2014 Jason Lotito

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
