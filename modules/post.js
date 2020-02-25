const mongoose = require('mongoose');

const PostSchema = mongoose.Schema({
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
  text: String
});

module.exports = mongoose.model('post', PostSchema);
