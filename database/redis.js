const redis = require('redis');

const client = redis.createClient();

client.on('error', function (err) {
	console.log(`Error connecting to redis: ${err}`);
});

function addToCache(listingId, review, callback) {
	client.SET(listingId, review, (err, reply) => {
		callback(err, reply);
	});
}

function checkCache(listingId, callback) {
	client.GET(listingId, (err, reply) => {
		callback(err, reply);
	});
}

module.exports.addToCache = addToCache;
module.exports.checkCache = checkCache;
