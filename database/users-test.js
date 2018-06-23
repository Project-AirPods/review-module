const pgp = require('pg-promise')();
const faker = require('faker');

const db = pgp('http://localhost:5432/airpods_reviews');

const cs = new pgp.helpers.ColumnSet(['username', 'avatar'], {table: 'users'});

function seedTable(callback, numOfRows) {
  const rows = callback(numOfRows);
  const query = pgp.helpers.insert(rows, cs);

  db.none(query)
    .then(data => {
      console.log('Table seeded successfuly. Exiting process.');
      process.exit();
    })
    .catch(error => {
      console.log(`FAILED TO INSERT INTO DB: ${err}`);
      process.exit();
    });

}

function generateUsersRows(numOfRows) {
	let rows = [];
	for (let i = 1; i < numOfRows; i++) {
		rows.push({username: faker.name.firstName(), avatar: faker.image.avatar()});
	}
	return rows;
}

function seedUsers() {
	seedTable(generateUsersRows, 10000001);
}

seedUsers();	
