require('dotenv').config();
const dns = require('dns');
const { URL } = require('url');
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose  = require('mongoose');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(express.json()); // Middleware to parse JSON body


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


/* db Code */
mongoose.connect(process.env.MONGO_URI)
  .catch((err) => console.error('MongoDB connection error:', err));
mongoose.connection.on('error', (err) => console.error('MongoDB error:', err));

const urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: Number
});
const Url = mongoose.model('Url', urlSchema);

function isValidHttpUrl(value) {
  try {
    return ['http:', 'https:'].includes(new URL(value).protocol);
  } catch {
    return false;
  }
}

async function generateUniqueShortUrl() {
  function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let shortUrl;
  do {
    shortUrl = randomInteger(1, 50000);
  } while (await Url.exists({ short_url: shortUrl }));

  return shortUrl;
}

// Validation middleware
app.post('/api/shorturl', function(req, res, next) {
  if ( req.body.url == undefined || !req.body.url ) return res.json({ error: 'invalid req.body' });
  if ( !isValidHttpUrl(req.body.url) ) return res.json({ error: 'invalid url' });
  next();
})

// Save new url to db
app.post('/api/shorturl', function(req, res) {
  const { hostname } = new URL(req.body.url);

  dns.lookup(hostname, async (err) => {
    if (err) return res.json({ error: 'invalid url' });

    const shortUrl = await generateUniqueShortUrl();

    const newUrl = new Url({
      original_url: req.body.url,
      short_url: shortUrl
    });
    await newUrl.save();

    res.json({
      original_url: req.body.url,
      short_url: shortUrl
    });
  });
});

// GET dynamic endpoint
app.get('/api/shorturl/:shortUrlNumber', function(req, res, next) {

    if ( req.params.shortUrlNumber == undefined || !req.params.shortUrlNumber ) return res.json({ error: 'invalid url' });
    next();

  }, async (req, res) => {

  const getUrl = await Url.findOne({ short_url: req.params.shortUrlNumber });

  if ( !getUrl ) return res.json({ error: 'invalid url' });

  res.writeHead(301, {
    Location: getUrl.original_url
  }).end();

})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
