const mysql = require('mysql');
const config = require('./config');
const loremIpsum = require('lorem-ipsum');

const pool  = mysql.createPool(config);

// Seed any table
function seedTable(callback, numOfRows, table, fields, i, iterations) {
	pool.getConnection(function(err, connection) {

		let rows = callback(numOfRows);

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

let startIndex = 1;
function generateListingsRows(numOfRows) {
	let rows = [];
	let endIndex = startIndex + numOfRows;
	for (let i = startIndex; i < endIndex; i++) {
		rows.push([i]);
		if (i === endIndex - 1) {
			startIndex = endIndex;
		}
	}
	return rows;
}

function seedListings() {
	for (let i = 1; i <= 20; i++) {
		seedTable(generateListingsRows, 500000, 'listings', ['id'], i, 20);
	}
}

// function seedReviews() {
// 	let startIndex = 1;
// 	for (let i = 1; i <= 20; i++) {
		
// 		pool.getConnection(function(err, connection) {
	  
// 		  let rows = [];
// 			let endIndex = startIndex + 500000;
// 			for (let i = startIndex; i < endIndex; i++) {
// 				const review = loremIpsum({
// 			    count: 1,                      // Number of words, sentences, or paragraphs to generate.
// 			  	units: 'paragraphs',           // Generate words, sentences, or paragraphs.
// 			  	sentenceLowerBound: 2,         // Minimum words per sentence.
// 			  	sentenceUpperBound: 9,         // Maximum words per sentence.
// 			  	paragraphLowerBound: 2,        // Minimum sentences per paragraph.
// 			  	paragraphUpperBound: 7,        // Maximum sentences per paragraph.
// 			  	format: 'plain',               // Plain text or html
// 				});

// 				rows.push([i]);
// 				if (i === endIndex - 1) {
// 					startIndex = endIndex;
// 				}
// 			}

// 		  connection.query('INSERT INTO listings (id) VALUES ?', [rows], function (err, results) {
// 		    connection.release();

// 		   	if (err) {
// 					console.log(`FAILED TO INSERT INTO DB: ${err}`);	
// 					process.exit();
// 				}

// 				if (i === 20) {
// 					process.exit();
// 				}

// 		  });
// 		});
// 	}

// }

seedListings();
// seedReviews();
