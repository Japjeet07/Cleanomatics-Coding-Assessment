import express from 'express';
import fs from 'node:fs/promises';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';



const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8000;
const HOST = process.env.HOST ?? 'localhost';


const app = express();



app.use(
  
  express.static('public/'),
);




app.get('/hello-world.html', (request, response) => {
  response.status(200).send('Hello, world!');
});


app.get('/random', (request, response) => {
  response.status(200).send(Math.random().toString());
});


app.get('/add/:first/:second', (request, response) => {
  const a = parseInt(request.params.first, 10); // Grab the param called "first" and convert to an int
  const b = parseInt(request.params.second, 10); // The second argument to parseInt parses in base-10

  const sum = a + b;

  response.status(200).send(sum.toString());
});



app.get('/a', async (request, response) => {
  const htmlContents = await fs.readFile('public/a.html');
  response.status(200).send(htmlContents.toString());
});

app.get('/b', (request, response) => {
  response.status(200).sendFile('public/b.html', { root: __dirname }); // We do need to tell Express where to look!
});

app.get('/c', (request, response) => {
  response.status(200).sendFile('public/c.html', { root: __dirname });
});



app.listen(PORT, HOST, () => {
  console.log(`Server listening at http://${HOST}:${PORT}`);
});
