const EmojiTranslate = require('../utils/emoji-translate');
const GoogleTranslate = require('@google-cloud/translate');
const projectId = 'emoji-translator-1527858475291';
const translate = new GoogleTranslate({ projectId });

const SYMBOLS = '!"#$%&\'()*+,-./:;<=>?@[]^_`{|}~';
const OPTIONS = {
  from: 'lt',
  to: 'en'
};

exports.translate = async (req, res) => {
  const { message } = req.body;
  let translatedMessage = '';

  let allLines = message.split('\n');
  for (let line = 0; line < allLines.length; line++) {
    if (allLines[line] !== '') {
      let words = allLines[line].split(' ');
      // Re-add the translated words.
      for (let i = 0; i < words.length; i++ ) {
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
      
          if (keyword.toLowerCase() === 'labas') {
            translatedEmojiKeyword = '👋';
          } else {
            let translatedKeyword = await translate.translate(keyword.toLowerCase(), OPTIONS);
            translatedKeyword = translatedKeyword[0];
            translatedEmojiKeyword = EmojiTranslate.translate(translatedKeyword);
          }
      
          if (translatedEmojiKeyword.length) {
            translatedEmojiKeyword = ' ' + translatedEmojiKeyword;
          }
          
          // translatedMessage += firstSymbol + keyword + translatedEmojiKeyword + lastSymbol;

          if (translatedEmojiKeyword.length) {
            translatedMessage += firstSymbol + translatedEmojiKeyword + lastSymbol;
          } else {
            translatedMessage += firstSymbol + keyword + lastSymbol;
          }

          if (translatedEmojiKeyword.length && lastSymbol.length) {
            translatedMessage += ' ';
          } else if (!translatedEmojiKeyword.length) {
            translatedMessage += ' ';
          }
        }
      }
    }
    translatedMessage += '</br>'
  }

  return res.json({ message: translatedMessage })
}
