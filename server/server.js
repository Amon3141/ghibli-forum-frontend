require('dotenv').config();
require('dotenv').config({ path: './server/.env' });

const express = require('express');
const next = require('next');
const cookieParser = require('cookie-parser');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

/* ----- Route Imports ----- */
const movieRoutes = require('./routes/movieRoutes');    // api/movies/*
const userRoutes = require('./routes/userRoutes');      // api/users/*
const threadRoutes = require('./routes/threadRoutes');  // api/threads/*
const commentRoutes = require('./routes/commentRoutes'); // api/comments/*
const authRoutes = require('./routes/authRoutes');      // api/auth/*
const sasRoutes = require('./routes/sasRoutes');        // api/sas/*

app.prepare().then(() => {
  const server = express();
  server.use(express.json());
  server.use(cookieParser());

  /* ----- API Routes ----- */
  server.use('/api/movies', movieRoutes);
  server.use('/api/threads', threadRoutes);
  server.use('/api/comments', commentRoutes);
  server.use('/api/users', userRoutes);
  server.use('/api/auth', authRoutes);
  server.use('/api/sas', sasRoutes);

  /* ----- Next.js Handler ----- */
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  /* ----- Start Server ----- */
  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    if (dev) console.log(`> Server is running on http://localhost:${port}`);
  });
});
