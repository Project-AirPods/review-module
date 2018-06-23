DROP DATABASE IF EXISTS airpods_reviews;

CREATE DATABASE airpods_reviews;
GRANT ALL PRIVILEGES ON DATABASE airpods_reviews TO sdc;

\connect airpods_reviews;

CREATE TABLE listings (
  id SERIAL NOT NULL PRIMARY KEY
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
  review_date DATE NOT NULL,

  response_date DATE DEFAULT NULL,
  response_owner_id INTEGER DEFAULT NULL REFERENCES users(id),
  response_body TEXT DEFAULT NULL
);