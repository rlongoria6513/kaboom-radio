const express = require('express');
const multer = require('multer');
const app = express();

const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

let songs = [];

app.post('/upload', upload.single('file'), (req, res) => {
    songs.push(req.file.filename);
    res.send("Uploaded!");
});

app.get('/songs', (req, res) => {
    res.json(songs);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT))://localhost:3000"));
