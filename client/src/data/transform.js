const fs = require('fs');
const emojis = require('./emojis.json');

const wstream = fs.createWriteStream('emojis-en.json');
wstream.write('[\n');

const emojisNum = Object.keys(emojis).length;
let transformedNum = 0;

Object.keys(emojis).forEach(emoji => {
  const transformedEmoji = {
    keywords: [...emojis[emoji].keywords, emoji],
    char: emojis[emoji].char
  }

  transformedNum += 1;
  if (transformedNum === emojisNum) {
    wstream.write(`${JSON.stringify(transformedEmoji)}\n`);
    wstream.write(']');
    wstream.end();
  } else {
    wstream.write(`${JSON.stringify(transformedEmoji)},\n`);
  }
});