require('dotenv').config();
const express = require('express');
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
const app = express();

const config = {
  authRequired: false,               // only protect routes you want
  auth0Logout: true,                 // log out from Auth0 on logout
  secret: process.env.AUTH0_SECRET,  // from .env
  baseURL: `http://localhost:${process.env.PORT}`,
  clientID: process.env.AUTH0_CLIENTID,
  issuerBaseURL: process.env.AUTH0_ISSUER
};

// attach the Auth0 router
app.use(auth(config));

// Example routes
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', (req, res) => {
  if (req.oidc.isAuthenticated()) {
    res.send(req.oidc.user); // user info from Auth0
  } else {
    res.status(401).send('Not logged in');
  }
});
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});
app.listen(process.env.PORT || 8090, () => console.log(`Server running on http://localhost:${process.env.PORT}`));
