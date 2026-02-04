const { listFormQuestions } = require('../utils/formOptions');

function getFormMetadata(req, res) {
  res.json({
    questions: listFormQuestions()
  });
}

module.exports = {
  getFormMetadata
};
