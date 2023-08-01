// models/Blog.js
const mongoose = require('mongoose');

// Define the schema for the blog data
const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    
  },
});

// Create the Blog model using the schema
const Blog = mongoose.model('Blog', blogSchema);

// Export the model
module.exports = Blog;
