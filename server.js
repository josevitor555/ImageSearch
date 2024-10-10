import express from 'express';
import path from 'path';
import dotenv from "dotenv";

import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/GeneratedFiles', express.static(path.join(__dirname, 'GeneratedFiles')));

app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, function () {
  console.log(`Listening on http://localhost:${PORT}`);
});