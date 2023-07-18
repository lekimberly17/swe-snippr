require('dotenv').config('.env');
const cors = require('cors');
const express = require('express');
const app = express();
const morgan = require('morgan');
const { Snippet } = require('./db');

// middleware
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const {
  AUTH0_SECRET,
  AUTH0_BASE_URL = 'http://localhost:5000',
  AUTH0_CLIENT_ID,
  AUTH0_ISSUER_BASE_URL,
} = process.env;

const config = {
  authRequired: true,
  auth0Logout: true,
  secret: AUTH0_SECRET,
  baseURL: AUTH0_BASE_URL,
  clientID: AUTH0_CLIENT_ID,
  issuerBaseURL: AUTH0_ISSUER_BASE_URL,
};

const { auth } = require('express-openid-connect');

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  console.log(req.oidc.user);
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/snippets', async (req, res, next) => {
  try {
    const snippets = await Snippet.findAll();
    res.send(snippets);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

app.post('/snippets', async (req, res, next) => {
  try {
    const { language, code } = req.body;
    const snippet = await Snippet.create({ language, code });
    res.status(201).json(snippet);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

// error handling middleware
app.use((error, req, res, next) => {
  console.error('SERVER ERROR: ', error);
  if (res.statusCode < 400) res.status(500);
  res.send({ error: error.message, name: error.name, message: error.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Snippr is ready at http://localhost:${PORT}`);
});