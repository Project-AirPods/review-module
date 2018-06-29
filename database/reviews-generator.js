const fs = require('fs');
const faker = require('faker');
const loremIpsum = require('lorem-ipsum');

const fileListings = fs.createWriteStream('./data/reviews.csv'); 

const generateListings = (writer) => {
  let i = 10000000;
  let id = 1;
  
  const generate = () => {
    let ratingAccuracy = Math.ceil(Math.random() * 5);
    let ratingCommunication = Math.ceil(Math.random() * 5);
    let ratingCleanliness = Math.ceil(Math.random() * 5);
    let ratingLocation = Math.ceil(Math.random() * 5);
    let ratingCheckin = Math.ceil(Math.random() * 5);
    let ratingValue = Math.ceil(Math.random() * 5);

    let reviewUserId = Math.ceil(Math.random() * 10000000);
    let reviewBody = loremIpsum({
      count: 1,                       // Number of words, sentences, or paragraphs to generate.
      units: 'paragraphs',            // Generate words, sentences, or paragraphs.
      sentenceLowerBound: 2,          // Minimum words per sentence.
      sentenceUpperBound: 5,          // Maximum words per sentence.
      paragraphLowerBound: 2,         // Minimum sentences per paragraph.
      paragraphUpperBound: 5,         // Maximum sentences per paragraph.
      format: 'plain',                // Plain text or html
    });
    let reviewDate = faker.date.month() + ' 2018';

    let responseBody = Math.random() > 0.8 ? 
      loremIpsum({
        count: 1,                       // Number of words, sentences, or paragraphs to generate.
        units: 'paragraphs',            // Generate words, sentences, or paragraphs.
        sentenceLowerBound: 3,          // Minimum words per sentence.
        sentenceUpperBound: 9,          // Maximum words per sentence.
        paragraphLowerBound: 3,         // Minimum sentences per paragraph.
        paragraphUpperBound: 7,         // Maximum sentences per paragraph.
        format: 'plain',                // Plain text or html
      }) : 
      null;
      let responseDate = responseBody ? faker.date.month() + ' 2018' : null;
      let responseOwnerId = responseBody ? Math.ceil(Math.random() * 10000000) : null;

    let data = `${id}, ${ratingAccuracy}, ${ratingCommunication}, ${ratingCleanliness}, ${ratingLocation}, ${ratingCheckin}, ${ratingValue}, ${reviewUserId}, ${reviewBody}, ${reviewDate}, ${responseDate}, ${responseOwnerId}, ${responseBody}\n`; 
                
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