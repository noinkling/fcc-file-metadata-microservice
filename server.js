'use strict';
const express = require("express");
const Busboy = require('busboy');
// const multer = require("multer");

const app = express();
// const upload = multer();

app.set('views', __dirname);
app.set('view engine', 'jade');


app.get("*", (req, res) => {
  res.render("index");
});


app.post("*", getFileSizes, (req, res, next) => {
  
  if (!req.fileSizes[0])
    return next(new Error("There was a problem uploading the file"));
  
  res.json(req.fileSizes[0]);
  
});


// Start the server
const server = app.listen(process.env.PORT || 8080, () => {
  console.log(`Server listening on port ${server.address().port}`);
});


function getFileSizes(req, res, next) {
  req.fileSizes = [];
  
  const busboy = new Busboy({ headers: req.headers });
  
  busboy.on("file", (fieldName, file, fileName, transferEncoding, type) => {
    let fileSize = 0;
    
    console.log(`Receiving file "${fileName}" of type "${type}" using "${transferEncoding}" encoding.`);
    
    file.on("data", chunk => fileSize += chunk.length)
    .on("end", () => {
      req.fileSizes.push({
        name: fileName,
        size: fileSize
      });
      console.log(`File processed. Size: ${fileSize} bytes.`);
    });
    
  });
  
  busboy.on("finish", next);
  
  req.pipe(busboy);
}
