const mongoose = require('mongoose');
const Vocab = mongoose.model('Vocab');
const translate = require('google-translate-api-x');


//============================================//
//============================================//
exports.list_all_words = (req, res) => {
  Vocab.find({}, (err, words) => {
    if (err) res.send(err);
    res.json(words);
  });
};

exports.create_a_word = (req, res) => {
  const newWord = new Vocab(req.body);
  newWord.save((err, word) => {
    if (err) res.send(err);
    res.json(word);
  });
};

exports.read_a_word = (req, res) => {
  Vocab.findById(req.params.wordId, (err, word) => {
    if (err) res.send(err);
    res.json(word);
  });
};

exports.update_a_word = (req, res) => {
  Vocab.findOneAndUpdate(
    { _id: req.params.wordId },
    req.body,
    { new: true },
    (err, word) => {
      if (err) res.send(err);
      res.json(word);
    }
  );
};

exports.delete_a_word = (req, res) => {
  Vocab.deleteOne({ _id: req.params.wordId }, err => {
    if (err) res.send(err);
    res.json({
      message: 'Word successfully deleted',
      _id: req.params.wordId
    });
  });
};

exports.translateText = async (req, res) => {
  try {
    const { text, target } = req.body;
    const result = await translate(text, { to: target });
    res.json({ translation: result.text });
  } catch (err) {
    console.error('Translation error:', err);
    res.status(500).json({ error: err.message });
  }
};

