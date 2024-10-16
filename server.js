import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { createApi } from 'unsplash-js';
import nodeFetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  fetch: nodeFetch,
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/GeneratedFiles', express.static(path.join(__dirname, 'GeneratedFiles')));

// Endpoint para pesquisar e exibir imagens
app.get('/api/search', async (req, res) => {
  const query = req.query.query || 'nature';
  const page = req.query.page || 1;

  try {
    const result = await unsplash.search.getPhotos({
      query,
      page: parseInt(page),
      perPage: 10,
    });

    res.json(result.response);
  } catch (error) {
    console.error('Erro ao buscar imagens:', error);
    res.status(500).json({ error: 'Erro ao buscar imagens' });
  }
});

// Endpoint para randomizar imagens aleatórias
app.get('/api/random-images', async (req, res) => {
  const count = req.query.count || 6;

  try {
    const result = await unsplash.photos.getRandom({
      count: parseInt(count)
    });
    
    res.json(result.response);
  } catch (error) {
    console.error('Erro ao buscar imagens aleatórias:', error);
    res.status(500).json({ error: 'Erro ao buscar imagens aleatórias' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
