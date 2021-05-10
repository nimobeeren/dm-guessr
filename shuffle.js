const fs = require('fs');
const path = require('path');

const JSON_PATH = path.resolve('./public/photos.json');

const photos = require(JSON_PATH);
photos.sort(() => Math.random() > 0.5 ? 1 : -1);
fs.writeFileSync(JSON_PATH, JSON.stringify(photos, null, 2));
