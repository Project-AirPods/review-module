const mysql = require('mysql');
const config = require('./config');
const loremIpsum = require('lorem-ipsum');
const faker = require('faker');
const lodash = require('lodash');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

const pool  = mysql.createPool(config);

// Seed any table
function seedTable(callback, listingID, numOfRows, table, fields, i, iterations) {
	pool.getConnection(function(err, connection) {

		let rows = callback(listingID, numOfRows); 

	  connection.query(`INSERT INTO ${table} (${fields}) VALUES ?`, [rows], function (err, results) {
	    connection.release();

	   	if (err) {
				console.log(`FAILED TO INSERT INTO DB: ${err}`);	
				process.exit();
			}

			if (i === iterations) {
				console.log('Table seeded successfuly. Exiting node.');
				process.exit();
			}
	  });
	});
}

function generateReviewsRows(listingID, numOfRows) {
	let rows = [];

	let reviewsRange = lodash.range(4, 11);

	for (let i = 1; i < numOfRows; i++) {

		let responseOwnerId = Math.ceil(Math.random() * 1000000);
		let numOfReviews = reviewsRange[Math.floor(Math.random() * reviewsRange.length)];

		for (let i = 1; i <= numOfReviews; i++) {
			
			let ratingAccuracy = Math.ceil(Math.random() * 5);
			let ratingCommunication = Math.ceil(Math.random() * 5);
			let ratingCleanliness = Math.ceil(Math.random() * 5);
			let ratingLocation = Math.ceil(Math.random() * 5);
			let ratingCheckin = Math.ceil(Math.random() * 5);
			let ratingValue = Math.ceil(Math.random() * 5);

			let reviewUserId = Math.ceil(Math.random() * 1000000);
			let reviewBody = loremIpsum({
				count: 1,                       // Number of words, sentences, or paragraphs to generate.
  			units: 'paragraphs',            // Generate words, sentences, or paragraphs.
  			sentenceLowerBound: 2,          // Minimum words per sentence.
  			sentenceUpperBound: 5,         	// Maximum words per sentence.
  			paragraphLowerBound: 2,         // Minimum sentences per paragraph.
  			paragraphUpperBound: 5,	        // Maximum sentences per paragraph.
  			format: 'plain',                // Plain text or html
			});
			let reviewDate = faker.date.recent();

			let responseDate = faker.date.recent();
			let responseBody = Math.random() > 0.9 ? 
				loremIpsum({
					count: 1,                       // Number of words, sentences, or paragraphs to generate.
	  			units: 'paragraphs',            // Generate words, sentences, or paragraphs.
	  			sentenceLowerBound: 3,          // Minimum words per sentence.
	  			sentenceUpperBound: 9,         	// Maximum words per sentence.
	  			paragraphLowerBound: 3,         // Minimum sentences per paragraph.
	  			paragraphUpperBound: 7,	        // Maximum sentences per paragraph.
	  			format: 'plain',                // Plain text or html
				}) : 
				"";

			rows.push([
				listingID, 
				ratingAccuracy, 
				ratingCommunication, 
				ratingCleanliness, 
				ratingLocation, 
				ratingCheckin, 
				ratingValue,
				reviewUserId,
				reviewBody,
				reviewDate,
				responseDate,
				responseOwnerId,
				responseBody,
			]);
		} 

		listingID += 1;
	}

	return rows;
}

function seedReviews(listingID) {
	for (let i = 1; i <= 10; i++) {
		seedTable(
			generateReviewsRows, 
			listingID,
			5001, 
			'reviews', 
			[
				'listing_id', 
				'rating_accuracy', 
				'rating_communication',
				'rating_cleanliness',
				'rating_location',
				'rating_checkin',
				'rating_value',
				'review_user_id',
				'review_body',
				'review_date',
				'response_date',
				'response_owner_id',
				'response_body',
			], 
			i, 
			10);
		listingID += 5000;
	}	
}

function getListingId(callback) {
	pool.getConnection(function(err, connection) {
		connection.query(`SELECT MAX(listing_id) FROM reviews`, function(err, results) {
			connection.release();

			if (err) {
				console.log(`FAILED TO QUERY THE DB: ${err}`);	
				process.exit();
			}
			
			results[0] ? 
				callback(results[0]['MAX(listing_id)'] + 1) : 
				callback(1);
		}); 
	});
}

getListingId(seedReviews);	

