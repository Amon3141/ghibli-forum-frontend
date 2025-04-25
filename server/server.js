require('dotenv').config(); // load env variables

const express = require('express');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  /* ----- Custom Express API routes ----- */
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
