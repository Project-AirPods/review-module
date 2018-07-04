const MongoClient = require('mongodb').MongoClient;

// Use connect method to connect to the mongo server w/ pool size 10
let mongodb;
MongoClient.connect('mongodb://localhost:27017', {poolSize: 10000}, function(err, client) {
  if (err) {
  	console.log(`Error connecting to mongo: ${err}`);
  } else {
	  console.log('Successfully connected to Mongo');
	  mongodb = client.db('airpods_reviews');
  }
});

function getOverview(listingId, callback) {
	const collection = mongodb.collection('reviews');

	collection.aggregate(
		[
			{$match: {listingId: listingId}},
			{$group: 
				{
					_id: '$listingId', 
					totalReviews: {$sum: 1}, 
					avgAccuracy: {$avg: '$ratingAccuracy'}, 
					avgCommunication: {$avg: '$ratingCommunication'}, 
					avgCleanliness: {$avg: '$ratingCleanliness'}, 
					avgLocation: {$avg: '$ratingLocation'}, 
					avgCheckin: {$avg: '$ratingCheckin'}, 
					avgValue: {$avg: '$ratingValue'},
				}
			}
		],
		function(err, cursor) {
			cursor.toArray(function(err, docs) {
        callback(err, docs);
      });
		}
	);
}

function getReviews(listingId, callback) {
	const collection = mongodb.collection('reviews');

	collection.aggregate(
		[
			{$match: {listingId: listingId}},
			{$lookup: {from: "users", localField: "reviewUserId", foreignField: "id", as: "userReview"}},
			{$lookup: {from: "users", localField: "responseOwnerId", foreignField: "id", as: "hostResponse"}},
			{$project: 
				{ 
					_id: 0,
					avgRating: {$avg: ['$ratingAccuracy', '$ratingCommunication', '$ratingCleanliness', '$ratingLocation', '$ratingCheckin', '$ratingValue']},
					reviewDate: 1,
					reviewBody: 1,
					responseDate: 1,
					responseBody: 1, 
					userReview: 1,
					hostResponse: 1
				}
			}
		], 
		function(err, cursor) {
			cursor.toArray(function(err, docs) {
        callback(err, docs);
      });
		}
	);
}


module.exports.getOverview = getOverview;
module.exports.getReviews = getReviews;
