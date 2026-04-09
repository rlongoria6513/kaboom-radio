

const express = require('express');
const multer = require('multer');
const fs = require('fs');
const app = express();



app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/intro.html');
});
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname); // 👈 KEEP REAL NAME
  }
});

const upload = multer({ storage });

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

let songs = [];
let playlist = [];
let currentStream = "https://pstnet38.shoutcastnet.com:10044/stream";
let listeners = 0;

try {
 songs = JSON.parse(fs.readFileSync('songs.json'));
} catch {
 songs = [];
}

function saveSongs(){
 fs.writeFileSync('songs.json', JSON.stringify(songs));
}

app.post('/upload', upload.single('file'), (req, res) => {
 songs.push(req.file.originalname);
 saveSongs();
 res.send("Uploaded!");
});

app.get('/songs', (req, res) => res.json(songs));

app.post('/add-to-playlist', express.json(), (req,res)=>{
 playlist.push(req.body.song);
 res.send("Added");
});

app.get('/playlist', (req,res)=> res.json(playlist));

app.post('/set-stream', express.json(), (req,res)=>{
 currentStream = req.body.url;
 res.send("Updated");
});

app.get('/stream', (req,res)=> res.send(currentStream));

app.get('/listen', (req,res)=>{
 listeners++;
 res.send("Listening");
});

app.get('/listeners', (req,res)=>{
 res.send(listeners.toString());
});

let autoDJ = false;

setInterval(()=>{
 if(autoDJ && playlist.length > 0){
  currentStream = "/uploads/" + playlist[0];
 }
}, 10000);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on " + PORT));
