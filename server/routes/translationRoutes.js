const Translation = require('../controllers/translation');

module.exports = app => {
  app.post('/api/translate', Translation.translate);
};
