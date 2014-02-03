var
  _ = require('lodash'),
  async = require('async');

/**
 * Buckets
 *
 * A simple library for creating simple buckets.
 *
 * @constructor
 */
function Buckets(){
  this.buckets = {};
  this.bucketConditions = [];
}

/**
 * Add a new bucket
 *
 * @param {string} name The name of the bucket
 * @param {function({mixed}) : boolean} test The callback to test input when adding data to buckets
 * @return {Buckets}
 */
Buckets.prototype.addBucket = function(name, test)
{
  this.buckets[name] = [];
  this.bucketConditions.push({
    name: name,
    test: test
  });

  return this;
};

/**
 * Add a list of buckets
 *
 * @param {Array.<{name: string, test: {function({mixed}) : boolean}}>} buckets A list of buckets to add
 * @return {Buckets}
 */
Buckets.prototype.addBuckets = function(buckets)
{
  _.each(buckets, function(bucket){
    this.addBucket(bucket.name, bucket.test);
  }.bind(this));

  return this;
}

/**
 * Delete a bucket and it's data
 *
 * @param {string} name The name of the bucket
 * @param {function()} cb Callback when the bucket deletion is done
 */
Buckets.prototype.deleteBucket = function(name, cb)
{
  delete this.buckets[name];
  this.bucketConditions = _.filter(this.bucketConditions, function(item){
    return item.name !== name;
  });
};

/**
 * Add data to the bucket list
 *
 * @param {*} data
 * @param {function()} cb Callback when the insert is done
 */
Buckets.prototype.add = function(data, cb){
  async.each(this.bucketConditions, function(c){
    if(c.test(data)){
      this.buckets[c.name].push(data);
    }
  }.bind(this), cb);
};

Buckets.prototype.empty = function()
{
  _.each(this.buckets, function(bucket, k){
    this.buckets[k] = [];
  }.bind(this));
}

module.exports = Buckets;
