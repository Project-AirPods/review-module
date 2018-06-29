const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { getOverview } = require('../database/index.js');
const { getReviews } = require('../database/index.js');
const { postReview } = require('../database/index.js');
const { updateReview } = require('../database/index.js');

const app = express();

// parses the incoming json data
app.use(bodyParser.json());

// resolves a specific listing requested
app.use('/', express.static(path.join(__dirname, '/../public')));
app.use('/listings/:id', express.static(path.join(__dirname, '/../public')));

// gets aggregate overview ratings
app.get('/listings/:listingId/overviews', (req, res) => {
  
  const listingId = Number(req.params.listingId);
	getOverview(listingId, (err, docs) => {
		if (err) {
			console.log(`Error retrieving the doc: ${err}`);
			res.status(500).end();
		} else {
			res.header('Access-Control-Allow-Origin', '*');
      res.status(200);
      res.send(docs);			
		}
	});

});

// gets all reviews
app.get('/listings/:listingId/reviews', (req, res) => {

	const listingId = Number(req.params.listingId);
	getReviews(listingId, (err, docs) => {
		if (err) {
			console.log(`Error retrieving the doc: ${err}`);
			res.status(500).end();
		} else {
			res.header('Access-Control-Allow-Origin', '*');
      res.status(200);
      res.send(docs);
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
	// identify a review to update by listing id, then by user id
	updateReview({listingId: 1000089, reviewUserId: 1056731}, {responseBody: 'Hlab hlab hlab.'}, (err, data) => {
		if (err) {
			console.log(`Error: ${err}`);
		}	
		console.log(`Successfully updated review: ${data}`);
		res.status(204).end('Success updating review.');
	});

});

module.exports = app;
