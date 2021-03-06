const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/airpods_reviews');

const db = mongoose.connection;

db.on('error', (error) => {
	console.log(`Error connecting to the database: ${error}`);	
});
db.once('open', function() {
	console.log('Successfuly connected to the database!');
});

// Collections schemas
const usersSchema = mongoose.Schema({
	id: Number, 
	username: String,
	avatar: String,
});

const reviewsSchema = mongoose.Schema({
	listingId: Number, 

	ratingAccuracy: Number, 
	ratingCommunication: Number, 
	ratingCleanliness: Number, 
	ratingLocation: Number,
	ratingCheckin: Number,
	ratingValue: Number,	

	reviewUserId: Number,
	reviewBody: String, 
	reviewDate: String,

	responseOwnerId: Number,
	responseBody: String,
	responseDate: String,
});

// Models
const User = mongoose.model('User', usersSchema);
const Review = mongoose.model('Review', reviewsSchema);

// Get the overview data from the database 
function getOverview(listingId, callback) {
	Review.aggregate([ 
		{$match: {listingId: listingId}}, 
		{$group: {
				_id: '$listingId', 
				totalReviews: {$sum: 1}, 
				avgAccuracy: {$avg: '$ratingAccuracy'}, 
				avgCommunication: {$avg: '$ratingCommunication'}, 
				avgCleanliness: {$avg: '$ratingCleanliness'}, 
				avgLocation: {$avg: '$ratingLocation'}, 
				avgCheckin: {$avg: '$ratingCheckin'}, 
				avgValue: {$avg: '$ratingValue'}
			}
		}], 
		function(err, docs) {
			callback(err, docs);
		}
	);
}

// Get the reviews data from the database
function getReviews(listingId, callback) {
	Review.aggregate([ 
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
		function(err, docs) {
			callback(err, docs);
		}
	);
}

function postReviews(listingId, userId, callback) {

}

module.exports.getOverview = getOverview;
module.exports.getReviews = getReviews;
