const express = require('express');
const router = express.Router();
const Post = require('../modules/post');

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch {
    res.json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  const post = new Post({
    'first-name': req.body['first-name'],
    'last-name': req.body['last-name'],
    email: req.body.email,
    text: req.body.text
  });
  try {
    const savedPost = await post.save();
    res.json(savedPost);
  } catch {
    res.json({ message: err.message });
  }
});

module.exports = router;
