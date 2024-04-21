const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const tikwm = require('./tikwm');

const app = express();

app.set('json replacer', null);
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/get', async (req, res) => {
  try {
    const vidFile = fs.readFileSync('./videos.json');
    const videos = JSON.parse(vidFile).videos;
    const randomVid = videos[Math.floor(Math.random() * videos.length)];

    const videoInfo = await tikwm.getVideoInfo(randomVid);
    
    res.json({
      "status": "success",
      "data": {
        "title": videoInfo.data.title,
        "user": videoInfo.data.author.nickname,
        "url": "https://www.tikwm.com/video/media/hdplay/" + videoInfo.data.id + ".mp4"
      }
    });
  } catch (error) {
    console.error(error.stack);
    res.status(500).send('Something broke!');
  }
});

app.listen(3000);