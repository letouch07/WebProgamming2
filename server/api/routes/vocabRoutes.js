const vocabBuilder = require('../controllers/vocabController');
console.log("Function of vocabBuilder:", vocabBuilder);//Test function is working or not//

module.exports = app => {
  app
    .route('/words')
    .get(vocabBuilder.list_all_words)
    .post(vocabBuilder.create_a_word);

  app
    .route('/words/:wordId')
    .get(vocabBuilder.read_a_word)
    .put(vocabBuilder.update_a_word)
    .delete(vocabBuilder.delete_a_word);
  app
    .route('/translate')
    .post(vocabBuilder.translateText);
};


