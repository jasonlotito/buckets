var
  assert = require('assert'),
  Buckets = require('../index.js');

var bucket_creator = function(min, max) {
  return function(number) {
    return min <= number && number <= max;
  };
};

BasicMath = {
  add: function(x,y) { return x + y; },
  sub: function(x,y) { return x - y; },
  divide: function(x,y) { return x / y; },
  times: function(x,y) { return x * y; },
};

function zero(o) {return num(0,o)}
function one(o) {return num(1,o)}
function two(o) {return num(2,o)}
function three(o) {return num(3,o)}
function four(o) {return num(4,o)}
function five(o) {return num(5,o)}
function six(o) {return num(6,o)}
function seven(o) {return num(7,o)}
function eight(o) {return num(8,o)}
function nine(o) {return num(9,o)}

function plus(n) {return op(BasicMath.add, n)}
function minus(n) {return op(BasicMath.sub, n)}
function times(n) {return op(BasicMath.times, n)}
function dividedBy(n) {return op(BasicMath.divide, n)}

function op(o,ro){
//  console.log(o(5,5),ro());
  return function(lo){
    console.log(o);
    return o(lo,ro());
  }
}

function num(n,oper){
    return oper ? oper(n) : oper;
}

console.log(five(times(five())), seven(times(five())), 35);
//Test.assertEquals(four(plus(nine())), 13);
//Test.assertEquals(eight(minus(three())), 5);
//Test.assertEquals(six(dividedBy(two())), 3);



describe('Buckets', function(){
  describe('This is the bucket_creator function', function(){
    it('It returns a creator, making it easy to create tests', function(){
      bucket_creator = function(min, max){
        return function(number){
          return min <= number && number <= max;
        };
      };
    })
  });


  describe('#addBucket', function(){
    it('Will allow you to add a bucket to it.', function(){
      var buckets = new Buckets();
      buckets.addBucket('test bucket', bucket_creator(0,10));
      assert.ok(buckets.buckets['test bucket']);
    });

    it('Will allow you to add more than one bucket', function(){
      var buckets = new Buckets();
      buckets.addBucket('bucket one', bucket_creator(0,10));
      assert.ok(buckets.buckets['bucket one']);
      assert.ok(!buckets.buckets['bucket two']);
      buckets.addBucket('bucket two', bucket_creator(11,20));
      assert.ok(buckets.buckets['bucket two']);
    });

    it('Will override an existing bucket', function(){
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
    });
  });

  describe('#addBuckets', function(){
    it('Will allow you to add a list of buckets', function(){
      var buckets = new Buckets();
      buckets.addBuckets([
        {name: 'bucket one', test: bucket_creator(0,10)},
        {name: 'bucket two', test: bucket_creator(11,20)},
        {name: 'bucket three', test: bucket_creator(21,30)}
      ]);

      assert.ok(buckets.buckets['bucket one']);
      assert.ok(buckets.buckets['bucket two']);
      assert.ok(buckets.buckets['bucket three']);
    });
  });

  describe('#add', function(){
    var buckets;
    beforeEach(function(){
      buckets = new Buckets();
      buckets.addBuckets([
        {name: 'bucket one', test: bucket_creator(0,10)},
        {name: 'bucket two', test: bucket_creator(11,20)},
        {name: 'bucket three', test: bucket_creator(21,30)}
      ]);
    });

    it('Will allow you to add data to buckets based on the test provided with the bucket', function(){
      buckets.add(5);
      buckets.add(15);
      buckets.add(16);
      buckets.add(17);

      assert.equal(1, buckets.buckets['bucket one'].length);
      assert.equal(3, buckets.buckets['bucket two'].length);
      assert.equal(0, buckets.buckets['bucket three'].length);
    });

    it('Will add the same value multiple times', function(){
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
    });

    it('Will stop early by default given multiple available buckets', function(){
      buckets.addBucket('bucket one and a half', bucket_creator(5,15));

      // This should only appear in bucket one
      buckets.add(7);
      assert.equal(1, buckets.buckets['bucket one'].length);
      assert.equal(0, buckets.buckets['bucket one and a half'].length);
    });

    it('Will place in multiple buckets if the option stop_on_match is false', function(){
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
    });

    it('Will return the buckets that the data was added to', function(){
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
    });

  });

  describe('#addList', function(){
    var buckets;
    beforeEach(function() {
      buckets = new Buckets();
      buckets.addBuckets([
        {name: 'bucket one', test: bucket_creator(0, 10)},
        {name: 'bucket two', test: bucket_creator(11, 20)},
        {name: 'bucket three', test: bucket_creator(21, 30)}
      ]);
    });

    it('Will add the same value multiple times', function() {
      buckets.addList([5, 5, 15, 15, 27, 27, 27]);

      assert.equal(2, buckets.buckets['bucket one'].length);
      assert.equal(2, buckets.buckets['bucket two'].length);
      assert.equal(3, buckets.buckets['bucket three'].length);
    });
  });

  describe('#emptyBuckets', function(){
    var buckets = new Buckets();
    buckets.addBuckets([
      {name: 'bucket one', test: bucket_creator(0,10)},
      {name: 'bucket two', test: bucket_creator(11,20)},
      {name: 'bucket three', test: bucket_creator(21,30)}
    ]);

    it('Will empty all buckets of any data', function(){
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
    });
  });

  describe('#deleteBucket', function(){
    var buckets = new Buckets();
    buckets.addBuckets([
      {name: 'bucket one', test: bucket_creator(0,10)},
      {name: 'bucket two', test: bucket_creator(11,20)},
      {name: 'bucket three', test: bucket_creator(21,30)}
    ]);

    it('Will remove a bucket', function(){
      buckets.deleteBucket('bucket two');
      buckets.add(5);
      buckets.add(15);

      assert.equal(1, buckets.buckets['bucket one'].length);
      assert.ok(!buckets.buckets['bucket two']);
    });
  });

  describe('#getBucket', function(){

    var buckets;
    beforeEach(function() {
      buckets = new Buckets();
      buckets.addBuckets([
        {name: 'bucket one', test: bucket_creator(0, 10)},
        {name: 'bucket two', test: bucket_creator(11, 20)},
        {name: 'bucket three', test: bucket_creator(21, 30)}
      ]);

      buckets.add(5);
      buckets.add(8);
      buckets.add(7);
      buckets.add(6);
      buckets.add(15);
      buckets.add(16);
      buckets.add(17);
    });

    it('Will return a bucket\'s contents.', function(){
      var bucketOne = buckets.getBucket('bucket one')
      assert.equal(4, bucketOne.length);
      assert.equal(0, bucketOne.indexOf(5));
    });

    it('Will return an empty array if the bucket doesn\'t exist', function(){
      assert.equal(0, buckets.getBucket('I don\'t exist').length);
    });
  });

});

describe('Bucket Stores', function(){

  var
    buckets,
    store,
    TestStore,
    beforeEachCallback;

  describe("TestStore is our sample store for testing", function(){
    it("Implements the TestStore interface the same way you would for your application and data store.", function(){
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
    });

    it('TestStore is passed into the bucket as the option store when the buckets are created.', function(){
      beforeEachCallback = function() {
        store = new TestStore();
        buckets = new Buckets({store: store});
        buckets.addBuckets([
          {name: 'bucket one', test: bucket_creator(0, 10)},
          {name: 'bucket two', test: bucket_creator(11, 20)},
          {name: 'bucket three', test: bucket_creator(21, 30)}
        ]);
      };
    });
  });

  beforeEachCallback = function() {
    store = new TestStore();
    buckets = new Buckets({store: store});
    buckets.addBuckets([
      {name: 'bucket one', test: bucket_creator(0, 10)},
      {name: 'bucket two', test: bucket_creator(11, 20)},
      {name: 'bucket three', test: bucket_creator(21, 30)}
    ]);
  };

  describe('#add', function() {
    beforeEach(beforeEachCallback);

    it('Will be called when new data is added to the store', function(){
      // The store method add(bucketName, value) will be called
      store.cb(function(bucketName, val){
        assert.equal('add', bucketName);
        assert.equal('bucket one', val[0]);
        assert.equal(5, val[1]);
      });

      buckets.add(5)
    });
  });

  describe('#deleteBucket', function(){
    beforeEach(beforeEachCallback);

    it('Will be called when a bucked has been deleted', function(){
      store.cb(function(methodCalled, v){
        assert.equal('deleteBucket', methodCalled);
        assert.equal('bucket one', v[0]);
      });

      buckets.deleteBucket('bucket one');
    });
  });

  describe("#empty", function(){
    beforeEach(beforeEachCallback);
    it('Will be called when we want to empty all the buckets', function(){
      store.cb(function(method, v){
        assert.equal('empty', method);
        assert.equal('bucket one', v[0][0]);
        assert.equal('bucket two', v[0][1]);
        assert.equal('bucket three', v[0][2]);
      });

      buckets.empty();
    })
  });
});


