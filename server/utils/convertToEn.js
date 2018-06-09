const letters = {
  ą: 'a',
  č: 'c',
  ę: 'e',
  ė: 'e',
  į: 'i',
  š: 's',
  ų: 'u',
  ū: 'u',
  ž: 'z',
};

module.exports = word => {
  word = word.toLowerCase();

  Object.keys(letters).forEach(letter => {
    const re = new RegExp(letter, 'g');
    word = word.replace(re, letters[letter]);
  });

  return word;
};
