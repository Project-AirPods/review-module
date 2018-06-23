// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;
const pgp = require('pg-promise')();

const config = {
    host: 'localhost',
    port: 5432,
    database: 'airpods_reviews',
    user: 'ruslanfarutdinov',
};

const db = pgp(config);


let rows = [ {id: 1}, {id: 2}, {id: 3} ];

db.tx(t => {
  const queries = rows.map(row => {
    return t.none(`INSERT INTO listings(id) VALUES(${id})`, row);
  });
  return t.batch(queries);
})
	.then(data => {
		console.log(`FAILED TO INSERT INTO DB: ${err}`);	
		process.exit();
    // SUCCESS
    // data = array of null-s
	})
	.catch(error => {
	  console.log('Table seeded successfuly. Exiting process.');
		process.exit();
    // ERROR
	});


// const { Client } = require('pg');
// const client = new Client('http://localhost:5432/airpods_reviews');

// client.connect();

// client.query(`INSERT INTO listings (id) VALUES (${[[1], [2], [3]]})`, (err, res) => {
// 	if (err) {
// 		console.log(`FAILED TO INSERT INTO DB: ${err}`);	
// 		client.end();
// 		process.exit();
// 	}

// 	console.log('Table seeded successfuly. Exiting process.');
// 	client.end();
// 	process.exit();
// });

// MYSQL API FOR SEEDING DATA
// const mysql = require('mysql');
// const config = require('./config');
// const pool  = mysql.createPool(config);
// Seed any table
// function seedTable(callback, numOfRows, table, fields, i, iterations) {
// 	pool.getConnection(function(err, connection) {

// 		let rows = callback(numOfRows); 

// 	  connection.query(`INSERT INTO ${table} (${fields}) VALUES ?`, [rows], function (err, results) {
// 	    connection.release();

// 	   	if (err) {
// 				console.log(`FAILED TO INSERT INTO DB: ${err}`);	
// 				process.exit();
// 			}

// 			if (i === iterations) {
// 				console.log('Table seeded successfuly. Exiting process.');
// 				process.exit();
// 			}
// 	  });
// 	});
// }


// function generateListingsRows(numOfRows) {
// 	let rows = [];
// 	for (let i = 1; i < numOfRows; i++) {
// 		rows.push([]);
// 	}
// 	return rows;
// }

// function seedListings() {
// 	for (let i = 1; i <= 4; i++) {
// 		seedTable(generateListingsRows, 2500001, 'listings', [], i, 4);
// 	}
// }

// // seedListings();

// function createWorkers() {
// 	for (let i = 0; i < numCPUs; i++) {
// 		cluster.fork();
// 	}
// 	console.log(`${numCPUs} workers created.`);
// 	// process.exit();
// }

// seedListings();

// create workers or seed the database.
// if (cluster.isMaster) {
// 	createWorkers();
// } else {
// 	seedListings();
// }