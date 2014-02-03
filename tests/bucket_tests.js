var
  assert = require("assert"),
  Buckets = require('../index.js');

describe('Buckets', function(){

  var bucket_creator = function(min, max){
    return function(number){
      return min < number && number < max;
    };
  };;

  describe("This is the bucket_creator function", function(){
    it("It returns a creator, making it easy to create tests", function(){
      bucket_creator = function(min, max){
        return function(number){
          return min < number && number < max;
        };
      };
    })
  });


  describe('#addBucket', function(){
    it('will allow you to add a bucket to it.', function(){
      var buckets = new Buckets();
      buckets.addBucket('test bucket', bucket_creator(0,10));
      assert.ok(buckets.buckets['test bucket']);
    });

    it('will allow you to add more than one bucket', function(){
      var buckets = new Buckets();
      buckets.addBucket('bucket one', bucket_creator(0,10));
      assert.ok(buckets.buckets['bucket one']);
      assert.ok(!buckets.buckets['bucket two']);
      buckets.addBucket('bucket two', bucket_creator(11,20));
      assert.ok(buckets.buckets['bucket two']);
    });

    it('will override an existing bucket', function(){
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

  describe("#addBuckets", function(){
    it('will allow you to add a list of buckets', function(){
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

  describe("#add", function(){
    var buckets = new Buckets();
    buckets.addBuckets([
      {name: 'bucket one', test: bucket_creator(0,10)},
      {name: 'bucket two', test: bucket_creator(11,20)},
      {name: 'bucket three', test: bucket_creator(21,30)}
    ]);

    it("will allow you to add data to buckets based on the test provided with the bucket", function(){
      buckets.add(5);
      buckets.add(15);
      buckets.add(16);
      buckets.add(17);

      assert.equal(1, buckets.buckets['bucket one'].length);
      assert.equal(3, buckets.buckets['bucket two'].length);
      assert.equal(0, buckets.buckets['bucket three'].length);
    })
  });

  describe("#emptyBuckets", function(){
    var buckets = new Buckets();
    buckets.addBuckets([
      {name: 'bucket one', test: bucket_creator(0,10)},
      {name: 'bucket two', test: bucket_creator(11,20)},
      {name: 'bucket three', test: bucket_creator(21,30)}
    ]);

    it("will empty all buckets of any data", function(){
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

  describe("#delectBucket", function(){
    var buckets = new Buckets();
    buckets.addBuckets([
      {name: 'bucket one', test: bucket_creator(0,10)},
      {name: 'bucket two', test: bucket_creator(11,20)},
      {name: 'bucket three', test: bucket_creator(21,30)}
    ]);

    it("will remove a bucket", function(){
      buckets.deleteBucket('bucket two');
      buckets.add(5);
      buckets.add(15);

      assert.equal(1, buckets.buckets['bucket one'].length);
      assert.ok(!buckets.buckets['bucket two']);
    });
  });

});
