const fs = require('fs');
const faker = require('faker');

const fileListings = fs.createWriteStream('./data/users.csv'); 

const generateListings = (writer) => {
  let i = 10000000;
  let id = 1;
  
  const generate = () => {
    let data = `${id},${faker.name.firstName()},${faker.image.avatar()}\n`; 
    id += 1;
    return data;
  }

  const write = () => {
    let ok = true;

    do {
      if (i === 0) {
        let data = generate();
        writer.write(data);
      } else {
        let data = generate();
        ok = writer.write(data);
      }
      i -= 1;
    } while (i > 0 && ok);
    
    if (i > 0) {
      writer.once('drain', write);
    }
  }
  write();
}

generateListings(fileListings);