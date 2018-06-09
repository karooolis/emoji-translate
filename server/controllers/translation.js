const EmojiTranslate = require('../utils/emoji-translate');
const GoogleTranslate = require('@google-cloud/translate');
const projectId = 'emoji-translator-1527858475291';
const translate = new GoogleTranslate({ projectId });
const Promise = require('bluebird');
const sqlite = require('sqlite');
const convertToEn = require('../utils/convertToEn.js');
const isUrl = require('../utils/isUrl.js');
const dbPromise = sqlite.open('./db/words.db', { Promise });

const SYMBOLS = '!"#$%&\'()*+,-./:;<=>?@[]^_`{|}~';
const OPTIONS = {
  from: 'lt',
  to: 'en',
};

exports.translate = async (req, res) => {
  const { message, replace } = req.body;
  let translatedMessage = '';

  let db;
  try {
    db = await dbPromise;
  } catch (err) {
    return res.status(500);
  }

  let allLines = message.split('\n');
  for (let line = 0; line < allLines.length; line++) {
    if (allLines[line] !== '') {
      let words = allLines[line].split(' ');

      for (let i = 0; i < words.length; i++) {
        for (let keyword of words[i].split(' ')) {
          let firstSymbol = '';
          let lastSymbol = '';

          while (SYMBOLS.indexOf(keyword[0]) != -1) {
            firstSymbol += keyword[0];
            keyword = keyword.slice(1, keyword.length);
          }

          while (SYMBOLS.indexOf(keyword[keyword.length - 1]) != -1) {
            lastSymbol += keyword[keyword.length - 1];
            keyword = keyword.slice(0, keyword.length - 1);
          }

          let translatedEmojiKeyword = '';
          if (keyword.length > 1 && !isUrl(keyword)) {
            const preparedKeyword = convertToEn(keyword);
            let keywordFromDb;

            try {
              const query = `SELECT * FROM words WHERE keyword="${preparedKeyword}"`;
              keywordFromDb = await Promise.resolve(db.get(query));
            } catch (err) {
              console.log('ERROR', err);
              return res.status(500);
            }

            let translatedKeyword;
            if (keywordFromDb) {
              translatedKeyword = keywordFromDb.translated;
            } else {
              translatedKeyword = await translate.translate(keyword.toLowerCase(), OPTIONS);
              translatedKeyword = translatedKeyword[0];

              try {
                const query = `INSERT INTO words VALUES ("${preparedKeyword}", "${translatedKeyword}")`;
                await Promise.resolve(db.get(query));
              } catch (err) {
                console.log('ERROR', err);
                return res.status(500);
              }
            }

            translatedEmojiKeyword = EmojiTranslate.translate(translatedKeyword);
          }

          if (translatedEmojiKeyword.length) {
            translatedEmojiKeyword = ' ' + translatedEmojiKeyword;
          }

          if (replace) {
            if (translatedEmojiKeyword.length) {
              translatedMessage += firstSymbol + translatedEmojiKeyword + lastSymbol;
            } else {
              translatedMessage += firstSymbol + keyword + lastSymbol;
            }
          } else {
            translatedMessage += firstSymbol + keyword + translatedEmojiKeyword + lastSymbol;
          }

          if (translatedEmojiKeyword.length && lastSymbol.length) {
            translatedMessage += ' ';
          } else if (!translatedEmojiKeyword.length) {
            translatedMessage += ' ';
          }
        }
      }
    }
    translatedMessage += '</br>';
  }

  return res.json({ message: translatedMessage });
};
