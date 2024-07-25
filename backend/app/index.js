const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();

const app = express();
const mediaRouter = require('./routes/igMedia');
const fbAutheticationRouter = require('./routes/fbAuthentication');
const fbCallbackRouter = require('./routes/fbCallback');
const fetchFacebookDataRouter = require('./routes/fetchFbData');

app.use(bodyParser.json());
app.use(morgan('dev'));

const corsOptions = {
  origin: 'http://localhost:8081',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use('/api/media', mediaRouter);

app.use('/auth/facebook', fbAutheticationRouter);

app.use('/auth/facebook/callback', fbCallbackRouter);

app.use('/fetch-facebook-data', fetchFacebookDataRouter);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;