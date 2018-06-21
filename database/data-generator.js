const mysql = require('mysql');
const config = require('./config');
const pool  = mysql.createPool(config);

function seedIDs() {
	let startIndex = 1;

	for (let i = 1; i <= 20; i++) {
		
		pool.getConnection(function(err, connection) {
	  
		  let rows = [];
			let endIndex = startIndex + 500000;
			for (let i = startIndex; i < endIndex; i++) {
				rows.push([i]);
				if (i === endIndex - 1) {
					startIndex = endIndex;
				}
			}

		  connection.query('INSERT INTO listings (id) VALUES ?', [rows], function (err, results) {
		    connection.release();

		   	if (err) {
					console.log(`FAILED TO INSERT INTO DB: ${err}`);	
					process.exit();
				}

				if (i === 20) {
					process.exit();
				}

		  });
		});
	}
}

function seedReviews() {
	
}

seedIDs();
