import express from "express";
const app = express();
const port = 3000;
import fetch from "node-fetch"
import { fileURLToPath } from 'url';
import path from 'path';

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function normalizeMaterialName(materialName) {
    const parts = materialName.split('_');
    let normalized = '';
    for (const part of parts) {
      if (normalized.length > 0) {
        normalized += ' ';
      }
      normalized += part.charAt(0) + part.slice(1).toLowerCase();
    }
    return normalized;
  }

function translateText(str, server) {
    let normal_str = normalizeMaterialName(str)
    let url = `https://api.mymemory.translated.net/get?q=${normal_str}&langpair=en|ru`
    fetch(url).then(res => res.json()).then(data => {
        server.send({
            "output": data.responseData.translatedText
        })
    })
}

app.get('/', (req, res) => {
    res.sendFile('./pages/preview.html', { root: __dirname });
});

app.post('/translate', (req, res) => {
    const { itemName } = req.body;
    if (itemName) {
        translateText(itemName, res)
    } else {
        res.send({
            "output": 'itemName не может быть пустым значением!'
        });
    }
});

app.listen(port, () => {
    console.log(`Server has started on port ${port}`);
});
