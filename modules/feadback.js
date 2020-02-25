const mongoose = require('mongoose');

const FeadbackSchema = mongoose.Schema({
  'first-name': {
    required: true,
    type: String
  },

  'last-name': {
    required: true,
    type: String
  },
  email: {
    required: true,
    type: String
  },
  feadback: String
});

module.exports = mongoose.model('feadback', FeadbackSchema);
