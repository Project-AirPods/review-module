// const cluster = require('cluster');
// const numCPUs = require('os').cpus().length;
const pgp = require('pg-promise')();

const db = pgp('http://localhost:5432/airpods_reviews');

// db.tx(t => {

//     const queries = rows.map(row => {
//       return t.none('INSERT INTO listings(id) VALUES(${id})', row);
//     });
//     return t.batch(queries);
//   })
//     .then(data => {
//       console.log('Table seeded successfuly. Exiting process.');
//       process.exit();
//     })
//     .catch(error => {
//       console.log(`FAILED TO INSERT INTO DB: ${err}`);  
//       process.exit();

//     });

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

const cs = new pgp.helpers.ColumnSet(['id'], {table: 'listings'});

function seedTable(callback, numOfRows, i, iterations) {
  const rows = callback(numOfRows);
  const query = pgp.helpers.insert(rows, cs);

  db.none(query)
    .then(data => {
      if (i === iterations) {
        console.log('Table seeded successfuly. Exiting process.');
        process.exit();
      }
    })
    .catch(error => {
      console.log(`FAILED TO INSERT INTO DB: ${err}`);
      process.exit();
    });

}


function generateListingsRows(numOfRows) {
	let rows = [];
	for (let i = 1; i < numOfRows; i++) {
		rows.push({id: i});
	}
	return rows;
}

function seedListings() {
  for (let i = 1; i <= 4; i++) {
	  seedTable(generateListingsRows, 1000001, i, 4);
	}
}

seedListings();

// function createWorkers() {
// 	for (let i = 0; i < numCPUs; i++) {
// 		cluster.fork();
// 	}
// 	console.log(`${numCPUs} workers created.`);
// 	// process.exit();
// }

// create workers or seed the database.
// if (cluster.isMaster) {
// 	createWorkers();
// } else {
// 	seedListings();
// }