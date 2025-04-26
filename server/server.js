require('dotenv').config();
require('dotenv').config({ path: './server/.env' });

const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

/* ----- Routes ----- */
const movieRoutes = require('./routes/movieRoutes');

app.prepare().then(() => {
  const server = express();
  server.use(express.json());
  
  /* ----- Custom Express API routes ----- */
  server.use('/api/movies', movieRoutes);

  server.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Express!' });
  });

  /* ----- All other Next.js API routes ----- */
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  /* ----- Start the server ----- */
  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Server is running on http://localhost:${port}`);
  });
});
