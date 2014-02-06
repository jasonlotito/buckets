var
  assert = require('assert'),
  Buckets = require('../index.js');

describe('Buckets', function(){

  var bucket_creator = function(min, max){
    return function(number){
      return min <= number && number <= max;
    };
  };

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

  describe("#getBucket", function(){

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

    it("Will return a bucket's contents.", function(){
      var bucketOne = buckets.getBucket("bucket one")
      assert.equal(4, bucketOne.length);
      assert.equal(0, bucketOne.indexOf(5));
    });

    it("Will return an empty array if the bucket doesn't exist", function(){
      assert.equal(0, buckets.getBucket("I don't exist").length);
    });
  });

  describe('#whichBuckets', function(){
    var buckets;
    beforeEach(function() {
      buckets = new Buckets({stop_on_match:false});
      buckets.addBuckets([
        {name: 'bucket one', test: bucket_creator(0, 10)},
        {name: 'bucket two', test: bucket_creator(11, 20)},
        {name: 'bucket three', test: bucket_creator(21, 30)},
        {name: 'bucket two and a half', test: bucket_creator(18,28)}
      ]);
    });

    it('Will return the name of the bucket the value should be put in', function(){
      // One bucket returned
      assert.equal('bucket two', buckets.whichBucket(17));
      assert.equal(1, buckets.whichBucket(17).length);

      // Multiple buckets returned
      var bucketList = buckets.whichBucket(19);
      assert.equal(2, bucketList.length);
      assert.ok(bucketList.indexOf('bucket two') >= 0);
      assert.ok(bucketList.indexOf('bucket two and a half') >= 0);
    });
  });
});
