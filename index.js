var
  _ = require('lodash');

function getBuckets (buckets, data, cb) {
  var stopEarly = ! (buckets.options.stop_on_match === true);

  _.each(buckets.bucketConditions, function(c) {
    if (c.test(data)) {
      cb(c);
      return stopEarly;
    }
  });
}

/**
 * Buckets
 *
 * A simple library for creating simple buckets.
 *
 * @constructor
 */
function Buckets(options){
  this.options = _.merge({}, { stop_on_match: true }, options || {});
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
  if(this.buckets[name]) {
    this.deleteBucket(name);
  }

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
 * Get a bucket and return the data
 *
 * @param {string} name
 * @returns {[]}
 */
Buckets.prototype.getBucket = function(name)
{
  if(!this.buckets[name]) {
    return [];
  }

  return this.buckets[name];
};

/**
 * Delete a bucket and it's data
 *
 * @param {string} name The name of the bucket
 * @return {Buckets}
 */
Buckets.prototype.deleteBucket = function(name)
{
  delete this.buckets[name];
  this.bucketConditions = _.filter(this.bucketConditions, function(item){
    return item.name !== name;
  });

  return this;
};

/**
 * Add data to the bucket list
 *
 * @param {*} data
 * @return {Array.<string>}
 */
Buckets.prototype.add = function(data)
{
  var
    buckets = [];

  getBuckets(this, data, function(c){
    this.buckets[c.name].push(data);
    buckets.push(c.name);
  }.bind(this));

  return buckets;
};

/**
 * Add a list of data
 *
 * @param {Array.<mixed>} data
 */
Buckets.prototype.addList = function(data)
{
  _.each(data, this.add.bind(this));
};

/**
 * Empty all the buckets
 *
 * @return {Buckets}
 */
Buckets.prototype.empty = function()
{
  _.each(this.buckets, function(bucket, k){
    this.buckets[k] = [];
  }.bind(this));

  return this;
};

/**
 * Returns which buckets the data would be put into
 *
 * @param {*} data
 * @returns {Array.<string>}
 */
Buckets.prototype.whichBucket = function(data)
{
  var
    buckets = [];

  getBuckets(this, data, function(c){
    this.buckets[c.name].push(data);
    buckets.push(c.name);
  }.bind(this));

  return buckets;
};

module.exports = Buckets;
