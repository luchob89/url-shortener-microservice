# URL Shortener Microservice

A small Node.js/Express API that shortens URLs and redirects short codes back to the original URL, backed by MongoDB.

It started as the freeCodeCamp [Back End Development and APIs - URL Shortener Microservice](https://www.freecodecamp.org/learn/back-end-development-and-apis/back-end-development-and-apis-projects/url-shortener-microservice) project, and is now also the backend for my [React Native URL shortener app](https://github.com/luchob89/React-Native-showcase).

## API Endpoints

### `GET /`

Serves a basic HTML form (`views/index.html`) for testing the API directly in a browser.

### `POST /api/shorturl`

Creates a short URL.

- Body: `{ "url": "https://example.com" }`
- Validates that `url` is present and contains `http`.
- On success, returns `{ "original_url": "...", "short_url": <number> }`.
- On invalid input, returns `{ "error": "invalid req.body" }` or `{ "error": "invalid url" }`.

### `GET /api/shorturl/:shortUrlNumber`

Redirects (HTTP 301) to the original URL matching `shortUrlNumber`, or returns `{ "error": "invalid url" }` if not found.

## Tech Stack

- Node.js, Express
- MongoDB via Mongoose
- `cors` for cross-origin requests, `dotenv` for environment variables

## Running Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root with:

   ```
   MONGO_URI=
   PORT=
   ```

   (`PORT` is optional and defaults to `3000`.)

3. Start the server:

   ```bash
   npm start
   ```

## Frontend

This API is consumed by [React-Native-showcase](https://github.com/luchob89/React-Native-showcase), a mobile URL shortener client for iOS, Android, and web.
