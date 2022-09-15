const mongoose = require('mongoose');
const { toJSON } = require('#@/utils/mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
    default: 0,
  },
});

blogSchema.set('toJSON', toJSON);

module.exports = mongoose.model('Blog', blogSchema);
