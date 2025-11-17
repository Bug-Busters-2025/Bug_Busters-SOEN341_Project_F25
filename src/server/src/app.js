const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '..', '..', '..', '.env'),
  override: true,
});

const express = require('express');
const cors = require('cors');
const { clerkMiddleware, requireAuth, getAuth } = require('@clerk/express');

const api = require('./routes');
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/error');

const { ping, pool } = require('./db');

const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.get('/api/health/db', async (_req, res, next) => {
  try { res.json({ ok: await ping() }); } catch (e) { next(e); }
});

const useAuth = process.env.ENABLE_AUTH === '1';
if (useAuth) {
  app.use(clerkMiddleware());
}

app.use('/api/v1', api);

app.get('/public', (_req, res) => res.json({ ok: true }));
app.get('/protected', useAuth ? requireAuth() : (_req, _res, next) => next(), (req, res) => {
  const { userId } = useAuth ? getAuth(req) : { userId: 'dev-bypass' };
  res.json({ ok: true, userId });
});

app.use(notFound);
app.use(errorHandler);

module.exports = app;
