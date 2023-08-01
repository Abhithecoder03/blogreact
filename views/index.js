const express = require('express');
const cors=require('cors')
const multer = require('multer');
const mongoose= require('mongoose');
const path = require('path');
require('dotenv').config();


const port = process.env.PORT;
const mdburl=process.env.DATABASE

const fs = require('fs');

const Blog = require('./models/Blog');

const app = express();

app.use(express.json());

// const mdburl='mongodb+srv://Abhidemo03:9696858107@cluster0.jf2t9qo.mongodb.net/Student?retryWrites=true&w=majority';
mongoose.connect(mdburl,{useNewUrlParser: true,useUnifiedTopology:true})
.then((result)=>app.listen(port))
.catch((err)=>console.log(err));


app.use(cors());
//saving image using multer 
// Define storage for uploaded images using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './uploads'); // Save the uploaded images in the "uploads" folder
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Rename the uploaded file with a unique name
    }
  });
  const upload = multer({ storage });

//   app.use(express.static('./uploads'));
app.use('/uploads', express.static('uploads'));

// Define API routes for blogs
// Create a new blog
app.post('/blogs',upload.single('image'), (req, res) => {
  const { title, body, author} = req.body;
  const image = req.file ? req.file.filename : null;
  const newBlog = new Blog({ title, body, author,image});

  newBlog.save()
    .then((result) => {
      console.log('Blog saved:', result);
      res.status(201).json(result);
    })
    .catch((err) => {
      console.error('Error saving blog:', err);
      res.status(500).json({ error: 'Failed to save blog' });
    });
});

// Get all blogs
app.get('/blogs', (req, res) => {
  Blog.find()
    .then((blogs) => {
      console.log('Fetched all blogs');
      res.json(blogs);
    })
    .catch((err) => {
      console.error('Error fetching blogs:', err);
      res.status(500).json({ error: 'Failed to fetch blogs' });
    });
});

// Get a single blog by ID
app.get('/blogs/:id', (req, res) => {
  const id = req.params.id;

  Blog.findById(id)
    .then((blog) => {
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      console.log('Fetched blog by ID:', blog);
      res.json(blog);
    })
    .catch((err) => {
      console.error('Error fetching blog by ID:', err);
      res.status(500).json({ error: 'Failed to fetch blog' });
    });
});

// Delete a blog by ID
app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndDelete(id)
    .then((deletedBlog) => {
      if (!deletedBlog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
      console.log('Deleted blog:', deletedBlog);
      res.json({ message: 'Blog deleted successfully' });
    })
    .catch((err) => {
      console.error('Error deleting blog:', err);
      res.status(500).json({ error: 'Failed to delete blog' });
    });
});

// Update a blog by ID
// app.put('/blogs/:id',  upload.single('image'),async(req, res) => {
//   const id = req.params.id;
//   const { title, body, author} = req.body;
//   const image = req.file ? req.file.filename : null;
//   const newBlog = new Blog({ title, body, author,image});

//   await Blog.findByIdAndUpdate(id, {$set:{newBlog}}, { new: true })
//     .then((updatedBlog) => {
//       if (!updatedBlog) {
//         return res.status(404).json({ error: 'Blog not found' });
//       }
//       console.log('Updated blog:', updatedBlog);
//       res.json(updatedBlog);
//     })
//     .catch((err) => {
//       console.error('Error updating blog:', err);
//       res.status(500).json({ error: 'Failed to update blog' });
//     });
// });

// Update a blog by ID
app.put('/blogs/:id', upload.single('image'), async (req, res) => {
    const id = req.params.id;
    const { title, body, author } = req.body;
    const image = req.file ? req.file.filename : null;
  
    try {
      const updatedBlog = await Blog.findByIdAndUpdate(
        id,
        { $set: { title, body, author, image } }, // Use $set to update specific fields without modifying _id
        { new: true }
      );
  
      if (!updatedBlog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
  
      console.log('Updated blog:', updatedBlog);
      res.json(updatedBlog);
    } catch (err) {
      console.error('Error updating blog:', err);
      res.status(500).json({ error: 'Failed to update blog' });
    }
  });
  

// Start the server (Note: We already started the server after connecting to MongoDB)

// Other routes and middleware can be added as needed

// Export the app instance for testing purposes
module.exports = app;
