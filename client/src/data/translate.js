const fs = require('fs');
const Translate = require('@google-cloud/translate');
const projectId = 'emoji-translator-1527858475291';
let emojis = require('./emojis-en.json');

const translate = new Translate({ projectId });
const target = 'lt';

const wstream = fs.createWriteStream('emojis-ltu.json');
wstream.write('[\n');

(async () => {
  for (let idx in emojis) {
    const emoji = emojis[idx];

    emoji['keywords_ltu'] = [];

    for (let keyword of emoji.keywords) {
      const translatedEmoji = await translate.translate(keyword, target);
      emoji['keywords_ltu'].push(translatedEmoji[0]);
    }

    if (parseInt(idx) === emojis.length - 1) {
      wstream.write(`${JSON.stringify(emoji)}\n`);
      wstream.write(']');
      wstream.end();
    } else {
      wstream.write(`${JSON.stringify(emoji)},\n`);
    }
  }
})();
