require('./models/User');
require('./models/Track');
const express = require('express');
const mongooose = require('mongoose');
const authRoutes = require('../src/routes/authRoutes');
const trackRoutes = require('../src/routes/trackRoutes');
const bodyParser = require('body-parser');
const requireAuth = require('./middlewares/requireAuth');

var morgan = require('morgan');
const app = express();
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(authRoutes);
app.use(trackRoutes);

const mongoUri =
  'mongodb+srv://admin:passwordpassword@track-app.1viko.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

mongooose.connect(mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

app.get('/', requireAuth, (req, res) => {
  res.send(`your email id is : ${req.user.email}`);
});

mongooose.connection.on('connected', () => {
  console.log('Connected to mongoose instance');
});
mongooose.connection.on('error', err => {
  console.error('Error connecting to mongoDB', err);
});

app.listen(3000, () => console.log('listening on port 3000'));
