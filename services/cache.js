const mongoose = require('mongoose');
const redis = require('redis');
const redisUrl = 'redis://localhost:6379';
const client = redis.createClient(redisUrl);
const util = require('util');

client.get = util.promisify(client.get);
client.set = util.promisify(client.set);
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function () {
  console.log("I'M ABOUT  TO RUN A QUERY");

  const key = JSON.stringify(
    Object.assign({}, this.getQuery(), {
      collection: this.mongooseCollection.name,
    })
  );
  console.log(key);
  // see if we have a value for key
  const cacheValue = await client.get(key);

  // if we do return that
  if (cacheValue) {
    console.log('READ FROM CACHE');
    const doc = JSON.parse(cacheValue);

    return Array.isArray(doc)
      ? doc.map((d) => new this.model(d))
      : new this.model(doc);
  }

  // Otherwise, issue the query and store the result in redis
  const result = await exec.apply(this, arguments);
  client.set(key, JSON.stringify(result));
  return result;
};
