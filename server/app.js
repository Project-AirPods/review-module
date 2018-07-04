const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { getOverview } = require('../database/index.js');
const { getReviews } = require('../database/index.js');
const { postReview } = require('../database/index.js');
const { updateReview } = require('../database/index.js');
const { deleteReview } = require('../database/index.js');
const { checkCache } = require('../database/redis.js');
const { addToCache } = require('../database/redis.js');

const app = express();

// parses the incoming json data
app.use(bodyParser.json());

// resolves a specific listing requested
app.use('/', express.static(path.join(__dirname, '/../public')));
app.use('/listings/:id', express.static(path.join(__dirname, '/../public')));

// gets aggregate overview ratings
app.get('/listings/:listingId/overviews', (req, res) => {
  
  const listingId = Number(req.params.listingId);
  const query = 'overviews' + listingId;

  checkCache(query, (err, reply) => {
  	if (err) {
  		console.log(`Error retrieving data from REDIS: ${err}`);
  		res.status(500).end();
  	} 

  	// if cache doesn't have the review, fetch it from mongo, add it to cache, then send it to client 
  	if (reply === null) {
			getOverview(listingId, (err, docs) => {
				if (err) {
					console.log(`Error retrieving the doc from Mongo: ${err}`);
					res.status(500).end();
				} else {
					addToCache(query, JSON.stringify(docs), (err, reply) => {
						if (err) {
							console.log(`Error adding a review to REDIS: ${err}`);
						}
					});

					console.log('got it from database');
					res.header('Access-Control-Allow-Origin', '*');
		      res.status(200);
		      res.send(docs);			
				}
			});
  	} else {
  		console.log('got it from cache');
  		res.header('Access-Control-Allow-Origin', '*');
			res.status(200);
		  res.send(JSON.parse(reply));			
  	}
  });

});

// gets all reviews
app.get('/listings/:listingId/reviews', (req, res) => {

	const listingId = Number(req.params.listingId);
	const query = 'reviews' + listingId;

	checkCache(query, (err, reply) => {
  	if (err) {
  		console.log(`Error retrieving data from REDIS: ${err}`);
  		res.status(500).end();
  	} 

  	// if cache doesn't have the review, fetch it from mongo, add it to cache, then send it to client 
  	if (reply === null) {
			getReviews(listingId, (err, docs) => {
				if (err) {
					console.log(`Error retrieving the doc from Mongo: ${err}`);
					res.status(500).end();
				} else {
					addToCache(query, JSON.stringify(docs), (err, reply) => {
						if (err) {
							console.log(`Error adding a review to REDIS: ${err}`);
						}
					});

					console.log('got it from database');
					console.log(docs);
					res.header('Access-Control-Allow-Origin', '*');
		      res.status(200);
		      res.send(docs);			
				}
			});
  	} else {
  		console.log('got it from cache');
  		res.header('Access-Control-Allow-Origin', '*');
			res.status(200);
		  res.send(JSON.parse(reply));			
  	}
  });

});

// add a new review
app.post('/listings/:listingId', (req, res) => {
	req.body.listingId = Number(req.params.listingId);
	
	postReview(req.body, (err, userIsFound, docs) => {
		if (err) {
			console.log(`Error retrieving user data: ${err}`);
			res.status(500).end(`Error retrieving user from database: ${err}`);
		}

		if (userIsFound) {
			res.status(201).end('Successfully inserted review into database.');
		} else {
			console.log('Nothing under that userId found.');
			res.status(404).end('User associated with review was not found.');
		}
	});
});

// update an existing review
app.put('/listings/:listingId', (req, res) => {
	const conditions = {listingId: Number(req.params.listingId), reviewUserId: req.body.reviewUserId};
	const update = req.body;

	updateReview(conditions, update, (err, data) => {
		if (err) {
			console.log(`Error updating review: ${err}`);
		}	
		res.status(204).end();
	});
});

// delete an existing review
app.delete('/listings/:listingId', (req, res) => {
	const conditions = {listingId: Number(req.params.listingId), reviewUserId: req.body.reviewUserId};

	deleteReview(conditions, (err) => {
		if (err) {
			console.log(`Error deleting a review: ${err}`);
			res.status(404).send(`Error deleting a review: ${err}`);
		}
		res.status(204).send();
	});
});

module.exports = app;
