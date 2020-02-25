const express = require('express');
const serverApp = express();
const mongoose = require('mongoose');
const path = require('path');
require('dotenv/config');
const postsRoute = require('./routes/news-posts');
const feadbackRoute = require('./routes/feadback-posts');
const bodyParser = require('body-parser');

serverApp.use(bodyParser.json());

serverApp.use(express.static(path.resolve(__dirname, './')));

serverApp.use('/news', postsRoute);
serverApp.use('/feadback', feadbackRoute);

serverApp.get('/', (req, res) => {
  res.send('test page');
});

mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true }, () =>
  console.log('DB Connected!')
);

console.log(
  'Server is running on',
  process.env.PORT || 3000,
  process.env.IP || '0.0.0.0'
);

serverApp.listen(process.env.PORT || 3000, process.env.IP || '0.0.0.0');
