// Create web server
const express = require('express');
const app = express();   
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Comment = require('./models/comment');
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;
// Connect to MongoDB
mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB:', err);
});
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// Define the Comment model
const commentSchema = new mongoose.Schema({
    name: String,
    email: String,
    comment: String,
});
const Comment = mongoose.model('Comment', commentSchema);
// Define the routes
app.get('/', (req, res) => {
    res.send('Hello World');
});
app.get('/comments', async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
app.post('/comments', async (req, res) => {
    const comment = new Comment({
        name: req.body.name,
        email: req.body.email,
        comment: req.body.comment,
    });
    try {
        const savedComment = await comment.save();
        res.status(201).json(savedComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});
app.delete('/comments/:id', async (req, res) => {
    try {
        const deletedComment = await Comment.findByIdAndDelete(req.params.id);
        if (!deletedComment) {
            return res.status(404).json({ message: 'Comment not found' });
        }
        res.json(deletedComment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
