const SYMBOLS = '!"#$%&\'()*+,-./:;<=>?@[]^_`{|}~';
const allEmoji = require('../data/emojis.json');

/**
 * Returns true for something that's already an emoji like 🤖.
 * @param {String} word The word to be translated
 * @returns {Bool}
 */
function isMaybeAlreadyAnEmoji(word) {
  let ranges = [
      '\ud83c[\udf00-\udfff]', // U+1F300 to U+1F3FF
      '\ud83d[\udc00-\ude4f]', // U+1F400 to U+1F64F
      '\ud83d[\ude80-\udeff]' // U+1F680 to U+1F6FF
  ];
  return word.match(ranges.join('|')) !== null;
}

/**
 * Returns the list of all emoji translations of an english word.
 * @param {String} word The word to be translated
 * @returns {Array} The list of emoji translations or '' if none exist.
 */
function getAllEmojiForWord(originalWord) {
  let word = originalWord.trim().toLowerCase();

  if (!word || word === '' || word === 'a' || word === 'it' || word === 'is')
    return '';

  // Maybe this is a plural word but the word is the singular?
  // Don't do it for two letter words since "as" would become "a" etc.
  let maybeSingular = '';
  if (word.length > 2 && word[word.length - 1] == 's') {
    maybeSingular = word.slice(0, word.length - 1);
  }

  // Maybe this is a singular word but the word is the plural?
  // Don't do this for single letter since that will pluralize crazy things.
  let maybePlural = (word.length == 1) ? '' : word + 's';

  let maybeVerbedSimple = '';
  let maybeVerbedVowel = '';
  let maybeVerbedDoubled  = '';

  if (word.indexOf('ing') !== -1) {
    let verb = word.substr(0, word.length - 3);
    // eating -> eat
    maybeVerbedSimple = verb;
    // dancing -> dance
    maybeVerbedVowel = verb + 'e';
    // running -> run
    maybeVerbedDoubled = verb.substr(0, verb.length - 1);
  }

  // Go through all the things and find the first one that matches.
  let useful = [];

  // If this is already an emoji, don't try to translate it.
  if (isMaybeAlreadyAnEmoji(word)) {
    useful.push(word);
    return useful;
  }

  // If it's "i" or "i", add some faces to it.
  if (word === 'i' || word === 'you' || word === 'me') {
    useful.push('😊');
  } else if (word === 'she'){
    useful.push('💁');
  } else if (word === 'mine' || word === 'my'){
    useful.push('😊👈');
  } else if (word === 'he'){
    useful.push('💁‍♂️');
  } else if (word === 'we' || word === 'they') {
    useful.push('👩‍👩‍👦‍👦');
  } else if (word === 'am') {
    useful.push('👈');
  } else if (word === 'is' || word === 'are' || word === 'you' || word === 'your') {
    useful.push('👉');
  } else if (word === 'thanks') {
    useful.push('🙌');
  }

  for (let emoji in allEmoji) {
    let words = allEmoji[emoji].keywords;
    // TODO: omg refactor this one day, please. Why is this even. Why.
    if (word == allEmoji[emoji].char ||
        emoji == word || (emoji == word + '_face') ||
        emoji == maybeSingular || emoji == maybePlural ||
        emoji == maybeVerbedSimple || emoji == maybeVerbedVowel || emoji == maybeVerbedDoubled ||
        (words && words.indexOf(word) >= 0) ||
        (words && words.indexOf(maybeSingular) >= 0) ||
        (words && words.indexOf(maybePlural) >= 0) ||
        (words && words.indexOf(maybeVerbedSimple) >= 0) ||
        (words && words.indexOf(maybeVerbedVowel) >= 0) ||
        (words && words.indexOf(maybeVerbedDoubled) >= 0)) {
      // If it's a two letter word that got translated to a flag, it's 99% of the
      // time incorrect, so stop doing that.
      if (!(word.length <= 3 && allEmoji[emoji].category == 'flags')) {
        useful.push(allEmoji[emoji].char);
      }
    }
  }

  return (useful.length === 0) ? '' : useful;
}

/**
 * Returns a random emoji translation of an english word.
 * @param {String} word The word to be translated.
 * @returns {String} A random emoji translation or '' if none exists.
 */
function getEmojiForWord(word) {
  let translations = getAllEmojiForWord(word);
  return translations[Math.floor(Math.random() * translations.length)];
}

/**
 * Translates an entire sentence to emoji. If multiple translations exist
 * for a particular word, a random emoji is picked.
 * @param {String} sentence The sentence to be translated
 * @param {Bool} onlyEmoji True if the translation should omit all untranslatable words
 * @returns {String} An emoji translation!
 */
function translate(sentence, onlyEmoji) {
  let translation = '';
  let words = sentence.split(' ');
  for (let i = 0; i < words.length; i++ ) {
    // Punctuation blows. Get all the punctuation at the start and end of the word.
    // TODO: stop copy pasting this.
    let firstSymbol = '';
    let lastSymbol = '';
    var word = words[i];

    while (SYMBOLS.indexOf(word[0]) != -1) {
      firstSymbol += word[0];
      word = word.slice(1, word.length);
    }
    while (SYMBOLS.indexOf(word[word.length - 1]) != -1) {
      lastSymbol += word[word.length - 1];
      word = word.slice(0, word.length - 1);
    }

    if (onlyEmoji) {
      firstSymbol = lastSymbol = ''
    }

    let translated = getEmojiForWord(word);
    if (translated) {
      translation += translated;
    }
  }
  return translation;
}

module.exports.isMaybeAlreadyAnEmoji = isMaybeAlreadyAnEmoji;
module.exports.getAllEmojiForWord = getAllEmojiForWord;
module.exports.getEmojiForWord = getEmojiForWord;
module.exports.translate = translate;
