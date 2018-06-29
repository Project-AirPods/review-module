DROP DATABASE IF EXISTS airpods_reviews;

CREATE DATABASE airpods_reviews;

\connect airpods_reviews;

CREATE TABLE listings (
  id INTEGER NOT NULL PRIMARY KEY
);

CREATE TABLE users (
  id SERIAL NOT NULL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  avatar VARCHAR(256) NOT NULL
);

CREATE TABLE reviews (
  id SERIAL NOT NULL PRIMARY KEY,
  listing_id INTEGER NOT NULL REFERENCES listings(id),

  rating_accuracy INTEGER NOT NULL,
  rating_communication INTEGER NOT NULL,
  rating_cleanliness INTEGER NOT NULL,
  rating_location INTEGER NOT NULL,
  rating_checkin INTEGER NOT NULL,
  rating_value INTEGER NOT NULL,

  review_user_id INTEGER NOT NULL REFERENCES users(id),
  review_body TEXT NOT NULL,
  review_date VARCHAR(50) NOT NULL,

  response_date VARCHAR(50) DEFAULT NULL,
  response_owner_id INTEGER DEFAULT NULL REFERENCES users(id),
  response_body TEXT DEFAULT NULL
);

COPY listings (id) FROM '/Users/ruslanfarutdinov/Desktop/hr96/sdc/review-module/data/listings.csv' with delimiter as ',' csv;
COPY users (id, username, avatar) FROM '/Users/ruslanfarutdinov/Desktop/hr96/sdc/review-module/data/users.csv' with delimiter as ',' csv;
COPY reviews (listing_id, rating_accuracy, rating_communication, rating_cleanliness, rating_location, rating_checkin, rating_value, review_user_id, review_body, review_date, response_date, response_owner_id, response_body) FROM '/Users/ruslanfarutdinov/Desktop/hr96/sdc/review-module/data/reviews.csv' with delimiter as ',' NULL AS ' null' csv;