const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { getOverview } = require('../database/mongo.js');
const { getReviews } = require('../database/mongo.js');

const app = express();

// parses the incoming json data
app.use(bodyParser.json());

// resolves a specific listing requested
app.use('/', express.static(path.join(__dirname, '/../public')));
app.use('/listings/:id', express.static(path.join(__dirname, '/../public')));

app.get('/listings/:listingId/overviews', (req, res) => {
	const listingId = Number(req.params.listingId);

	getOverview(listingId, (err, docs) => {
		if (err) {
			console.log(`Error retrieving the doc from Mongo: ${err}`);
			res.status(500).end();
		} else {
			
		  res.header('Access-Control-Allow-Origin', '*');
			res.status(200);
	    res.send(docs);			
		}
	});
});

app.get('/listings/:listingId/reviews', (req, res) => {
	const listingId = Number(req.params.listingId);

	getReviews(listingId, (err, docs) => {
		if (err) {
			console.log(`Error retrieving the doc from Mongo: ${err}`);
			res.status(500).end();
		} else {
			
			res.header('Access-Control-Allow-Origin', '*');
	    res.status(200);
	    res.send(docs);			
		}
	});
});


module.exports = app;
