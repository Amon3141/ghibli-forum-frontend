require('dotenv').config();
require('dotenv').config({ path: './server/.env' });

const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

/* ----- Route Imports ----- */
const movieRoutes = require('./routes/movieRoutes');    // Handles /api/movies/*
const userRoutes = require('./routes/userRoutes');      // Handles /api/users/*
const threadRoutes = require('./routes/threadRoutes');  // Handles /api/threads/*
const commentRoutes = require('./routes/commentRoutes'); // Handles /api/comments/*

app.prepare().then(() => {
  const server = express();
  server.use(express.json());
  
  /* ----- API Routes ----- */
  server.use('/api/movies', movieRoutes);
  server.use('/api/users', userRoutes);
  server.use('/api/threads', threadRoutes);
  server.use('/api/comments', commentRoutes);

  // Test endpoint
  server.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express!' });
  });

  /* ----- Next.js Handler ----- */
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  /* ----- Start Server ----- */
  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Server is running on http://localhost:${port}`);
  });
});
