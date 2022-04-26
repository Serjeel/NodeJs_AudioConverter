const express = require("express");

let Mic = require('node-microphone');

const ffmpeg = require("fluent-ffmpeg");

const bodyParser = require("body-parser");

const fs = require("fs");

const fileUpload = require("express-fileupload");

const app = express();
app.use(express.static('src'))

const options = {
  channels: 2,
  rate: 44100,
}

let mic = new Mic(options);

const PORT = process.env.PORT || 5000;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//support parsing of application/x-www-form-urlencoded post data

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

console.log(ffmpeg);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/src/index.html");
});

app.post("/startRecord", (req, res) => {
  let writableStream = fs.createWriteStream("tmp/demo.wav");
  let micStream = mic.startRecording();
  micStream.pipe(writableStream);
  console.log('started recording');
});

app.post("/stopRecord", (req, res) => {
  mic.stopRecording();
  console.log('stopped recording');

  const file = "tmp/demo.wav"
  res.download(file);

  setTimeout(() => {
    fs.unlink(file, function (err) {
      if (err) throw err;
      console.log("File deleted");
    });
  }, 1000);
});

app.post("/convert", (req, res) => {
  let to = req.body.to;
  let file = req.files.file;
  let fileName = file.name.split('.')[0];
  let toFormat = `.${to}`;
  let bitrate = req.body.bitrate;
  console.log(to);
  console.log(file);

  file.mv("tmp/" + file.name, function (err) {
    if (err) return res.sendStatus(500).send(err);
    console.log("File Uploaded successfully");
  });
  ffmpeg("tmp/" + file.name)
    .withOutputFormat(to)
    .audioBitrate(bitrate)
    .on("end", function (stdout, stderr) {
      console.log("Finished");
      res.download("tmp/" + fileName + toFormat, function (err) {
        if (err) throw err;
        
        fs.unlink("tmp/" + file.name, function (err) {
          if (err) throw err;
          console.log("Input file deleted");
        });

        fs.unlink("tmp/" + fileName + toFormat, function (err) {
          if (err) throw err;
          console.log("Output file deleted");
        });
      });
    })
    .on("error", function (err) {
      console.log("an error happened: " + err.message);
      fs.unlink("tmp/" + file.name, function (err) {
        if (err) throw err;
        console.log("File deleted");
      });
    })
    .saveToFile("tmp/" + fileName + toFormat);
  //.pipe(res, { end: true });
});

app.listen(PORT);
