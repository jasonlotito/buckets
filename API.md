# TOC
   - [Buckets](#buckets)
     - [This is the bucket_creator function](#buckets-this-is-the-bucket_creator-function)
     - [#addBucket](#buckets-addbucket)
     - [#addBuckets](#buckets-addbuckets)
     - [#add](#buckets-add)
     - [#emptyBuckets](#buckets-emptybuckets)
     - [#delectBucket](#buckets-delectbucket)
<a name=""></a>
 
<a name="buckets"></a>
# Buckets
<a name="buckets-this-is-the-bucket_creator-function"></a>
## This is the bucket_creator function
It returns a creator, making it easy to create tests.

```js
bucket_creator = function(min, max){
  return function(number){
    return min < number && number < max;
  };
};
```

<a name="buckets-addbucket"></a>
## #addBucket
will allow you to add a bucket to it..

```js
var buckets = new Buckets();
buckets.addBucket('test bucket', bucket_creator(0,10));
assert.ok(buckets.buckets['test bucket']);
```

will allow you to add more than one bucket.

```js
var buckets = new Buckets();
buckets.addBucket('bucket one', bucket_creator(0,10));
assert.ok(buckets.buckets['bucket one']);
assert.ok(!buckets.buckets['bucket two']);
buckets.addBucket('bucket two', bucket_creator(11,20));
assert.ok(buckets.buckets['bucket two']);
```

will override an existing bucket.

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
will allow you to add a list of buckets.

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
will allow you to add data to buckets based on the test provided with the bucket.

```js
buckets.add(5);
buckets.add(15);
buckets.add(16);
buckets.add(17);
assert.equal(1, buckets.buckets['bucket one'].length);
assert.equal(3, buckets.buckets['bucket two'].length);
assert.equal(0, buckets.buckets['bucket three'].length);
```

will stop early by default given multiple available buckets.

```js
buckets.addBucket('bucket one and a half', bucket_creator(5,15));
// This should only appear in bucket one
buckets.add(7);
assert.equal(1, buckets.buckets['bucket one'].length);
assert.equal(0, buckets.buckets['bucket one and a half'].length);
```

it will place in multiple buckets if the option stop_on_match is false.

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

<a name="buckets-emptybuckets"></a>
## #emptyBuckets
will empty all buckets of any data.

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

<a name="buckets-delectbucket"></a>
## #delectBucket
will remove a bucket.

```js
buckets.deleteBucket('bucket two');
buckets.add(5);
buckets.add(15);
assert.equal(1, buckets.buckets['bucket one'].length);
assert.ok(!buckets.buckets['bucket two']);
```

# TOC
   - [Buckets](#buckets)
     - [This is the bucket_creator function](#buckets-this-is-the-bucket_creator-function)
     - [#addBucket](#buckets-addbucket)
     - [#addBuckets](#buckets-addbuckets)
     - [#add](#buckets-add)
     - [#emptyBuckets](#buckets-emptybuckets)
     - [#delectBucket](#buckets-delectbucket)
<a name=""></a>
 
<a name="buckets"></a>
# Buckets
<a name="buckets-this-is-the-bucket_creator-function"></a>
## This is the bucket_creator function
It returns a creator, making it easy to create tests.

```js
bucket_creator = function(min, max){
  return function(number){
    return min < number && number < max;
  };
};
```

<a name="buckets-addbucket"></a>
## #addBucket
will allow you to add a bucket to it..

```js
var buckets = new Buckets();
buckets.addBucket('test bucket', bucket_creator(0,10));
assert.ok(buckets.buckets['test bucket']);
```

will allow you to add more than one bucket.

```js
var buckets = new Buckets();
buckets.addBucket('bucket one', bucket_creator(0,10));
assert.ok(buckets.buckets['bucket one']);
assert.ok(!buckets.buckets['bucket two']);
buckets.addBucket('bucket two', bucket_creator(11,20));
assert.ok(buckets.buckets['bucket two']);
```

will override an existing bucket.

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
will allow you to add a list of buckets.

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
will allow you to add data to buckets based on the test provided with the bucket.

```js
buckets.add(5);
buckets.add(15);
buckets.add(16);
buckets.add(17);
assert.equal(1, buckets.buckets['bucket one'].length);
assert.equal(3, buckets.buckets['bucket two'].length);
assert.equal(0, buckets.buckets['bucket three'].length);
```

will stop early by default given multiple available buckets.

```js
buckets.addBucket('bucket one and a half', bucket_creator(5,15));
// This should only appear in bucket one
buckets.add(7);
assert.equal(1, buckets.buckets['bucket one'].length);
assert.equal(0, buckets.buckets['bucket one and a half'].length);
```

it will place in multiple buckets if the option stop_on_match is false.

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

<a name="buckets-emptybuckets"></a>
## #emptyBuckets
will empty all buckets of any data.

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

<a name="buckets-delectbucket"></a>
## #delectBucket
will remove a bucket.

```js
buckets.deleteBucket('bucket two');
buckets.add(5);
buckets.add(15);
assert.equal(1, buckets.buckets['bucket one'].length);
assert.ok(!buckets.buckets['bucket two']);
```

# TOC
   - [Buckets](#buckets)
     - [This is the bucket_creator function](#buckets-this-is-the-bucket_creator-function)
     - [#addBucket](#buckets-addbucket)
     - [#addBuckets](#buckets-addbuckets)
     - [#add](#buckets-add)
     - [#emptyBuckets](#buckets-emptybuckets)
     - [#delectBucket](#buckets-delectbucket)
<a name=""></a>
 
<a name="buckets"></a>
# Buckets
<a name="buckets-this-is-the-bucket_creator-function"></a>
## This is the bucket_creator function
It returns a creator, making it easy to create tests.

```js
bucket_creator = function(min, max){
  return function(number){
    return min < number && number < max;
  };
};
```

<a name="buckets-addbucket"></a>
## #addBucket
will allow you to add a bucket to it..

```js
var buckets = new Buckets();
buckets.addBucket('test bucket', bucket_creator(0,10));
assert.ok(buckets.buckets['test bucket']);
```

will allow you to add more than one bucket.

```js
var buckets = new Buckets();
buckets.addBucket('bucket one', bucket_creator(0,10));
assert.ok(buckets.buckets['bucket one']);
assert.ok(!buckets.buckets['bucket two']);
buckets.addBucket('bucket two', bucket_creator(11,20));
assert.ok(buckets.buckets['bucket two']);
```

will override an existing bucket.

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
will allow you to add a list of buckets.

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
will allow you to add data to buckets based on the test provided with the bucket.

```js
buckets.add(5);
buckets.add(15);
buckets.add(16);
buckets.add(17);
assert.equal(1, buckets.buckets['bucket one'].length);
assert.equal(3, buckets.buckets['bucket two'].length);
assert.equal(0, buckets.buckets['bucket three'].length);
```

will stop early by default given multiple available buckets.

```js
buckets.addBucket('bucket one and a half', bucket_creator(5,15));
// This should only appear in bucket one
buckets.add(7);
assert.equal(1, buckets.buckets['bucket one'].length);
assert.equal(0, buckets.buckets['bucket one and a half'].length);
```

it will place in multiple buckets if the option stop_on_match is false.

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

<a name="buckets-emptybuckets"></a>
## #emptyBuckets
will empty all buckets of any data.

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

<a name="buckets-delectbucket"></a>
## #delectBucket
will remove a bucket.

```js
buckets.deleteBucket('bucket two');
buckets.add(5);
buckets.add(15);
assert.equal(1, buckets.buckets['bucket one'].length);
assert.ok(!buckets.buckets['bucket two']);
```
