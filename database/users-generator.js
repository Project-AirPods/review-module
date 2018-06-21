const mysql = require('mysql');
const config = require('./config');
const loremIpsum = require('lorem-ipsum');
const faker = require('faker');

const pool  = mysql.createPool(config);

// Seed any table
function seedTable(callback, numOfRows, table, fields, lastIteration, i, iterations) {
	pool.getConnection(function(err, connection) {

		let rows = callback(numOfRows); 

	  connection.query(`INSERT INTO ${table} (${fields}) VALUES ?`, [rows], function (err, results) {
	    connection.release();

	   	if (err) {
				console.log(`FAILED TO INSERT INTO DB: ${err}`);	
				process.exit();
			}

			if (lastIteration) {
				if (i === iterations) {
					console.log('Table seeded successfuly. Exiting node.');
					process.exit();
				}
			}

	  });
	});
}

function generateUsersRows(numOfRows) {
	let rows = [];
	for (let i = 1; i < numOfRows; i++) {
		rows.push([faker.name.firstName(), faker.image.avatar()]);
	}
	return rows;
}

function seedUsers() {
	for (let i = 1; i <= 10; i++) {
		seedTable(generateUsersRows, 200001, 'users', ['username', 'avatar'], true, i, 10);
	}	
}

seedUsers();	























